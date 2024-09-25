using Instend.Server.Database.Abstraction;
using Itransition.Server.Hubs;
using Itrantion.Server.Database.Abstraction;
using Itrantion.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Itrantion.Server.Controllers
{
    [ApiController]
    [Route("/api/presentations")]
    public class PresentationsController : ControllerBase
    {
        private readonly IPresentationsRepository _presentationsRepository;

        private readonly ISlidesRepository _slidesRepository;

        private readonly IHubContext<UserHub> _userHub;

        public PresentationsController
        (
            IPresentationsRepository presentationsRepository, 
            ISlidesRepository slidesRepository,
            IHubContext<UserHub> userHub
        )
        {
            _presentationsRepository = presentationsRepository;
            _slidesRepository = slidesRepository;
            _userHub = userHub;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _presentationsRepository.GetAll());

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] string username)
        {
            var result = await _presentationsRepository.Create(username);

            if (result.error != null || result.instance == null)
            {
                return BadRequest(result.error);
            }

            return Ok(result.instance);
        }

        [HttpPost]
        [Route("/api/presentations/slide")]
        public async Task AddSlide([FromForm] string username, [FromForm] Guid presentationId)
        {
            var result = await _slidesRepository
                .AddSlide(presentationId, username);

            await _userHub.Clients
                .Group(presentationId.ToString())
                .SendAsync("AddSlide", SerializationHelper.SerializeWithCamelCase(result));
        }

        [HttpDelete]
        [Route("/api/presentations/slide")]
        public async Task DeleteSlide([FromForm] Guid slideId, [FromForm] Guid presentationId)
        {
            var result = await _slidesRepository
                .DeleteSlide(presentationId, slideId);

            await _userHub.Clients
                .Group(presentationId.ToString())
                .SendAsync("DeleteSlide", result);
        }
    }
}