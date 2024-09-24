using Instend.Server.Database.Abstraction;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/presentations")]
    public class PresentationsController : ControllerBase
    {
        private readonly IPresentationsRepository _presentationsRepository;

        public PresentationsController(IPresentationsRepository presentationsRepository) 
        {
            _presentationsRepository = presentationsRepository;
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
    }
}