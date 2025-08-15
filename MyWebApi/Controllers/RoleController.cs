using Microsoft.AspNetCore.Mvc;
using MyWebApi.BLL.DTOs.Role;
using MyWebApi.BLL.Services.Role;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/role")]
    public class RoleController : Controller
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateRoleDTO dto)
        {
            var response = await _roleService.CreateAsync(dto);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync(UpdateRoleDTO dto)
        {
            var response = await _roleService.UpdateAsync(dto);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAsync(string? id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("id is required!");
            }

            var response = await _roleService.DeleteAsync(id);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync(string? id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("id is required!");
            }

            var response = await _roleService.GetByIdAsync(id);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpGet("List")]
        public async Task<IActionResult> GetAllAsync()
        {
            var response = await _roleService.GetAllAsync();
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }
    }
}
