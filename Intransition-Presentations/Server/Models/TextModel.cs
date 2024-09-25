using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itrantion.Server.Models
{
    [Table("texts")]
    public class TextModel
    {
        [Column("id")][Key] public Guid Id { get; set; } = Guid.NewGuid();
        [Column("slide_id")] public Guid SlideId { get; set; }
        [Column("text")] public string Text { get; set; } = string.Empty;
        [Column("top")] public int Top { get; set; }
        [Column("left")] public int Left { get; set; }
        [Column("height")] public int Height { get; set; }
        [Column("width")] public int Width { get; set; }
    }
}