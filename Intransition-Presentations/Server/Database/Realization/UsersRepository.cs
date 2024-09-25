using Itrantion.Server.Database.Abstraction;
using Itrantion.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Itrantion.Server.Database.Realization
{
    public class UsersRepository : IUsersRepository
    {
        public DatabaseContext _context;

        public UsersRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<(string? error, UserModel? instance)> Login(string nickname, int color)
        {
            var searchUserResult = await _context.Users.FirstOrDefaultAsync(x => x.Username == nickname);

            if (searchUserResult != null)
                return (null, searchUserResult);

            var user = UserModel.Create(nickname, color);

            if (user.error != null || user.instance == null)
                return user;

            await _context.AddAsync(user.instance);
            await _context.SaveChangesAsync();

            return user;
        }
    }
}