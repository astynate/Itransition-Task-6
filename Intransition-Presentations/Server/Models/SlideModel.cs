using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itrantion.Server.Models
{
    [Table("slides")]
    public class SlideModel
    {
        [Column("id")][Key] public Guid Id { get; set; } = Guid.NewGuid();
        [Column("presentation_id")] public Guid PresentationId { get; set; }
        [Column("index")] public int Index { get; set; } = 0;

        [NotMapped] public TextModel[] texts { get; set; } = [];

        public SlideModel(int index, Guid presentationId) 
        {
            Index = index;
            PresentationId = presentationId;
        }
    }
}