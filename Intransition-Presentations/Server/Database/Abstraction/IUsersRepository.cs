using Itrantion.Server.Models;

namespace Itrantion.Server.Database.Abstraction
{
    public interface IUsersRepository
    {
        Task<(string? error, UserModel? instance)> Login(string nickname, int color);
    }
}