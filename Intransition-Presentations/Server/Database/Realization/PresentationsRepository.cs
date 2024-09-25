using Itrantion.Server.Database.Abstraction;
using Itrantion.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Itrantion.Server.Database.Realization
{
    public class PresentationsRepository : IPresentationsRepository
    {
        private readonly DatabaseContext _context;

        private readonly IUsersRepository _userRepository;

        public PresentationsRepository(DatabaseContext context, IUsersRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        public async Task<PresentationModel[]> GetAll() => await _context.Presentations.ToArrayAsync();

        public async Task<UserModel?> RegisterNewConnection(string username, string connectionId, Guid presentationId)
        {
            var user = await _userRepository.Login(username, 0);

            if (user.error != null || user.instance == null)
                return null;

            var result = await _context.Connections
                .Where(x => x.User == username && x.Presentation == presentationId)
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.ConnectionId, connectionId));

            if (result == 0)
            {
                await _context.Connections
                    .AddAsync(new UserConnection(username, connectionId, presentationId));
            }

            await _context.SaveChangesAsync();
            return user.instance;
        }

        public async Task<(Guid? presentationId, string? username)> DeleteConnection(string connectionId)
        {
            var connection = await _context.Connections
                .FirstOrDefaultAsync(x => x.ConnectionId == connectionId);

            if (connection != null)
            {
                _context.Connections.Remove(connection);
                await _context.SaveChangesAsync();

                return (connection.Presentation, connection.User);
            }

            return (null, null);
        }

        public class PresentationResult
        {
            public PresentationModel? Presentation { get; set; }
            public SlideModel[]? Slides { get; set; }
            public TextModel[]? Texts { get; set; }
        }

        public async Task<PresentationResult> GetModel(Guid id)
        {
            var result = await _context.Presentations
                .Where(x => x.Id == id)
                .Select(presentation => new
                {
                    Presentation = presentation,
                    Slides = _context.Slides
                        .Where(slide => slide.PresentationId == presentation.Id)
                        .ToArray(),
                    Texts = _context.Texts
                        .Where(text => _context.Slides.Any(slide => slide.Id == text.SlideId && slide.PresentationId == presentation.Id))
                        .ToArray()
                })
                .FirstOrDefaultAsync();

            if (result == null)
            {
                return new PresentationResult();
            }

            result.Presentation.connectedUsers = await _context.Connections
                    .Where(x => x.Presentation == id)
                    .Join(_context.Users,
                        (link) => link.User,
                        (user) => user.Username,
                        (link, user) => user)
                    .ToListAsync();

            return new PresentationResult() {
                Presentation = result!.Presentation,
                Slides = result.Slides,
                Texts = result.Texts
            };
        }

        public async Task<(string? error, PresentationModel? instance)> Create(string nickname, string name = "No name")
        {
            var searchUserResult = await _context.Users.FirstOrDefaultAsync(x => x.Username == nickname);

            if (searchUserResult == null)
                return ("User not found", null);

            var presentation = PresentationModel.Create(name, nickname, DateTime.Now);

            if (presentation.error != null || presentation.instance == null)
                return presentation;

            var slide = new SlideModel(0, presentation.instance.Id);

            await _context.AddAsync(presentation.instance);
            await _context.AddAsync(slide);

            await _context.SaveChangesAsync();

            return presentation;
        }
    }
}