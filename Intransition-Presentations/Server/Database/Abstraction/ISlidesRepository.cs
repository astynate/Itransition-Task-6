using Itrantion.Server.Models;

namespace Instend.Server.Database.Abstraction
{
    public interface ISlidesRepository
    {
        Task<SlideModel?> AddSlide(Guid presentationId, string username);
        Task AddText(TextModel model);
        Task DeleteText(Guid id);
        Task<Guid?> DeleteSlide(Guid presentationId, Guid slideId);
        Task UpdateText(TextModel model);
    }
}