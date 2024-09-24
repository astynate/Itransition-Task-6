namespace Instend.Server.Models
{
    public class SlideModel
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid PresentationId { get; set; }
        public int Index { get; set; } = 0;

        public SlideModel(int index, Guid presentationId) 
        {
            Index = index;
            PresentationId = presentationId;
        }
    }
}