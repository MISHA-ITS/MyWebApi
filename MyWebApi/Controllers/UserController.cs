using Microsoft.AspNetCore.Mvc;
using MyWebApi.BLL.DTOs.User;
using MyWebApi.BLL.Services.User;
using AutoMapper;
using AutoMapper.Configuration;

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

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromForm] CreateUserDTO dto)
        {
            var response = await _userService.CreateAsync(dto);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync(UpdateUserDTO dto)
        {
            var response = await _userService.UpdateAsync(dto);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAsync(string? id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("id is required!");
            }

            var response = await _userService.DeleteAsync(id);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync(string? id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("id is required!");
            }

            var response = await _userService.GetByIdAsync(id);
            return response?.IsSuccess == true ? Ok(response) : BadRequest(response);
        }

        [HttpGet("List")]
        public async Task<IActionResult> GetAllAsync()
        {
            var response = await _userService.GetAllAsync();
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }
    }
}
