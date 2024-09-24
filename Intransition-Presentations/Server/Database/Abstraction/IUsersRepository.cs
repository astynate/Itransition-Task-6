using Instend.Server.Models;

namespace Instend.Server.Database.Abstraction
{
    public interface IUsersRepository
    {
        Task<(string? error, UserModel? instance)> Login(string nickname, int color);
    }
}