using Itrantion.Server.Models;
using static Itrantion.Server.Database.Realization.PresentationsRepository;

namespace Itrantion.Server.Database.Abstraction
{
    public interface IPresentationsRepository
    {
        Task<(string? error, PresentationModel? instance)> Create(string nickname, string name = "No name");
        Task<(Guid? presentationId, string? username)> DeleteConnection(string connectionId);
        Task<PresentationModel[]> GetAll();
        Task<PresentationResult> GetModel(Guid id);
        Task<UserModel?> RegisterNewConnection(string username, string connectionId, Guid presentationId);
    }
}