using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itrantion.Server.Models
{
    [Table("permissions")]
    public class PermissionModel
    {
        [Column("id")][Key] public Guid Id { get; set; } = Guid.NewGuid();
        [Column("username")] public string Username { get; set; } = string.Empty;
        [Column("presentation_id")] public Guid PresentationId { get; set; }
        [Column("permission")] public string Permission { get; set; } = Permissions.ReadAndEdit.ToString();
    }
}