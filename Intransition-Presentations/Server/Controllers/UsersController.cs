using Itrantion.Server.Database.Abstraction;
using Microsoft.AspNetCore.Mvc;

namespace Itrantion.Server.Controllers
{
    [ApiController]
    [Route("/api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _userRepository;

        public UsersController(IUsersRepository usersRepository)
        {
            _userRepository = usersRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromForm] string nickname, [FromForm] int color)
        {
            var result = await _userRepository.Login(nickname, color);

            if (result.error != null || result.instance == null)
            {
                return BadRequest(result.error);
            }

            return Ok(result.instance);
        }
    }
}