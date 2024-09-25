using System.ComponentModel.DataAnnotations.Schema;

namespace Itrantion.Server.Models
{
    [Table("connections")]
    public class UserConnection
    {
        [Column("username")] public string User { get; set; }
        [Column("connection_id")] public string ConnectionId { get; set; }
        [Column("presentation")] public Guid Presentation { get; set; }

        public UserConnection(string user, string connectionId, Guid presentation)
        {
            User = user;
            ConnectionId = connectionId;
            Presentation = presentation;
        }
    }
}