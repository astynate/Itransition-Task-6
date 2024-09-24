using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Server.Models
{
    [Table("permissions")]
    public class PermissionModel
    {
        [Column("id")][Key] public Guid Id { get; set; } = Guid.NewGuid();
        [Column("user_id")] public Guid UserId { get; set; }
        [Column("presentation_id")] public Guid PresentationId { get; set; }
        [Column("Permission")] public Permissions Permission { get; set; } = Permissions.ReadAndEdit;
    }
}