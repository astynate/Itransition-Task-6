using Instend.Server.Database.Abstraction;
using Instend.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Instend.Server.Database.Realization
{
    public class PresentationsRepository : IPresentationsRepository
    {
        public DatabaseContext _context;

        public PresentationsRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<PresentationModel[]> GetAll() => await _context.Presentations.ToArrayAsync();

        public async Task RegisterNewConnection(string username, Guid presentationId)
        {
            await _context.Connections.AddAsync(new UserConnection(username, presentationId));
            await _context.SaveChangesAsync();
        }

        public async Task DeleteConnection(string username, Guid presentationId)
        {
            await _context.Connections
                .Where(x => x.User == username && x.Presentation == presentationId)
                .ExecuteDeleteAsync();

            await _context.SaveChangesAsync();
        }

        public async Task<object> GetModel(Guid id)
        {
            return await _context.Presentations
                .Where(x => x.Id == id)
                .Join(_context.Slides,
                    (presentation) => presentation.Id,
                    (slide) => slide.PresentationId,
                    (presentation, slides) => new 
                    {
                        slides,
                        presentation
                    }
                )
                .GroupJoin(_context.Texts,
                    (prev) => prev.slides.Id,
                    (text) => text.SlideId,
                    (prev, text) => new
                    {
                        prev.presentation,
                        prev.slides,
                        text
                    }
                )
                .ToArrayAsync();
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