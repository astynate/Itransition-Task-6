using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Server.Models
{
    [Table("connections")]
    public class UserConnection
    {
        [Column("username")] public string User { get; set; }
        [Column("presentation")] public Guid Presentation { get; set; }

        public UserConnection(string user, Guid presentation)
        {
            User = user;
            Presentation = presentation;
        }
    }
}