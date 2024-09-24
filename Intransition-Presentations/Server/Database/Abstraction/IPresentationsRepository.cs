using Instend.Server.Models;

namespace Instend.Server.Database.Abstraction
{
    public interface IPresentationsRepository
    {
        Task<(string? error, PresentationModel? instance)> Create(string nickname, string name = "No name");
        Task DeleteConnection(string username, Guid presentationId);
        Task<PresentationModel[]> GetAll();
        Task<object> GetModel(Guid id);
        Task RegisterNewConnection(string username, Guid presentationId);
    }
}