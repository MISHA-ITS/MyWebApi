using Microsoft.AspNetCore.Mvc;
using MyWebApi.BLL.DTOs.Account;
using MyWebApi.BLL.Services.Account;
using MyWebApi.DAL.Entities.Identity;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync(RegisterDTO dto)
        {
            var user = await _accountService.RegisterAsync(dto);

            if (user == null)
            {
                return BadRequest("Register error");
            }

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync(LoginDTO dto)
        {
            var response = await _accountService.LoginAsync(dto);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLoginAsync(GoogleLoginDTO dto)
        {
            var response = await _accountService.GoogleLoginAsync(dto);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpGet("confirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string? userId, string? token)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
            {
                return BadRequest("Некоректний запит на підтвердження електронної пошти.");
            }

            var response = await _accountService.ConfirmEmailAsync(userId, token);

            if (response.IsSuccess)
            {
                return Redirect("http://Localhost:3000");
            }

            return BadRequest(response);
        }

        [HttpGet("user-logins")]
        public async Task<IActionResult> GetUserLoginsAsync(string userId)
        {
            var response = await _accountService.GetUserLoginsAsync(userId);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpDelete("remove-login")]
        public async Task<IActionResult> RemoveLoginAsync(string userId, string loginProvider, string providerKey)
        {
            var response = await _accountService.RemoveLoginAsync(userId, loginProvider, providerKey);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }
    }
}
