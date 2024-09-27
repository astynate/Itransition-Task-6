using Instend.Server.Database.Abstraction;
using Itrantion.Server.Database;
using Itrantion.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Instend.Server.Database.Realization
{
    public class SlidesRepository : ISlidesRepository
    {
        private readonly DatabaseContext _context;

        public SlidesRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<SlideModel?> AddSlide(Guid presentationId, string username)
        {
            var result = await _context.Presentations
                .FirstOrDefaultAsync(x => x.Id == presentationId);

            if (result == null)
                return null;

            var permission = await _context.Permissions
                .FirstOrDefaultAsync(x =>
                    x.Username == username &&
                    x.Id == presentationId &&
                    x.Permission == Permissions.ReadAndEdit.ToString());

            if (permission == null && result.Owner != username)
                return null;

            var maxIndex = await _context.Slides
                .Where(x => x.PresentationId == presentationId)
                .Select(x => x.Index)
                .MaxAsync();

            if (maxIndex >= 14)
                return null;

            SlideModel model = new SlideModel(maxIndex + 1, presentationId);

            await _context.Slides.AddAsync(model);
            await _context.SaveChangesAsync();

            return model;
        }

        public async Task<Guid?> DeleteSlide(Guid presentationId, Guid slideId)
        {
            var slides = await _context.Slides
                .Where(x => x.PresentationId == presentationId)
                .ToArrayAsync();

            if (slides.Length < 2)
                return null;

            int index = 0;

            Array.Sort(slides, (a, b) => a.Index - b.Index);

            for (int i = 0; i < slides.Length; i++)
            {
                if (slides[i].Id != slideId)
                {
                    slides[i].Index = index;
                    index++;
                }
            }

            await _context.Slides.Where(x => x.Id == slideId).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();

            return slideId;
        }

        public async Task AddText(TextModel model)
        {
            await _context.Texts.AddAsync(model);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteText(Guid id)
        {
            await _context.Texts.Where(x => x.Id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
        }

        public async Task UpdateText(TextModel model)
        {
            await _context.Texts
                .Where(x => x.Id == model.Id)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(x => x.Text, model.Text)
                    .SetProperty(x => x.FontFamily, model.FontFamily)
                    .SetProperty(x => x.FontSize, model.FontSize)
                    .SetProperty(x => x.FontStyle, model.FontStyle)
                    .SetProperty(x => x.FontWeight, model.FontWeight)
                    .SetProperty(x => x.TextAlign, model.TextAlign)
                    .SetProperty(x => x.SheetHeight, model.SheetHeight)
                    .SetProperty(x => x.SheetWidth, model.SheetWidth)
                    .SetProperty(x => x.TextDecoration, model.TextDecoration)
                    .SetProperty(x => x.Top, model.Top)
                    .SetProperty(x => x.Left, model.Left)
                    .SetProperty(x => x.Height, model.Height)
                    .SetProperty(x => x.Width, model.Width));

            await _context.SaveChangesAsync();
        }
    }
}