using Instend.Server.Database.Abstraction;
using Itransition.Server.Hubs;
using Itrantion.Server.Models;
using Itrantion.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/texts")]
    public class TextController : ControllerBase
    {
        private readonly ISlidesRepository _slidesRepository;

        private readonly IHubContext<UserHub> _userHub;

        public TextController(ISlidesRepository slidesRepository, IHubContext<UserHub> userHub)
        {
            _slidesRepository = slidesRepository;
            _userHub = userHub;
        }

        [HttpPost]
        public async Task<IActionResult> AddTest([FromForm] TextModel model)
        {
            await _slidesRepository.AddText(model);

            await _userHub.Clients
                .Group(model.PresentationId.ToString())
                .SendAsync("AddText", SerializationHelper.SerializeWithCamelCase(model));

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTest([FromForm] Guid presentationId, [FromForm] Guid id)
        {
            await _slidesRepository.DeleteText(id);

            await _userHub.Clients
                .Group(presentationId.ToString())
                .SendAsync("DeleteText", id);

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTest([FromForm] TextModel model)
        {
            await _slidesRepository.UpdateText(model);

            await _userHub.Clients
                .Group(model.PresentationId.ToString())
                .SendAsync("UpdateText", SerializationHelper.SerializeWithCamelCase(model));

            return Ok();
        }
    }
}