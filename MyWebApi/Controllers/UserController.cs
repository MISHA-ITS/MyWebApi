using Microsoft.AspNetCore.Mvc;
using MyWebApi.BLL.DTOs.User;
using MyWebApi.BLL.Services.User;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/user")]

    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("List")]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await _userService.GetAllAsync();

            return Ok(result);
        }
    }
}
