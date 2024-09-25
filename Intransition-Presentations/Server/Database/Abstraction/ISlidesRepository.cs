using Itrantion.Server.Models;

namespace Instend.Server.Database.Abstraction
{
    public interface ISlidesRepository
    {
        Task<SlideModel?> AddSlide(Guid presentationId, string username);
        Task<Guid?> DeleteSlide(Guid presentationId, Guid slideId);
    }
}