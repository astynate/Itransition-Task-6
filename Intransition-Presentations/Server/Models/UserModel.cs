using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itrantion.Server.Models
{
    [Table("users")]
    public class UserModel
    {
        [Column("username")][Key] public string Username { get; private set; } = string.Empty;
        [Column("color")] public int Color { get; private set; } = 0;

        private UserModel() { }

        public static (string? error, UserModel? instance) Create(string username, int color)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrWhiteSpace(username))
            {
                return new ("Username is required", null);
            }

            if (color < 0 || color > 2) 
            {
                return new("Invalid color", null);
            }

            return new (null, new UserModel()
            {
                Username = username,
                Color = color
            });
        }
    }
}