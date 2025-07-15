using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyWebApi.BLL.DTOs.User;
using MyWebApi.DAL.Entities.Identity;

namespace MyWebApi.BLL.Services.User
{
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser> _userManager;

        public UserService(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IEnumerable<UserDTO>> GetAllAsync()
        {
            var users = await _userManager.Users.Select(user => new UserDTO
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
            }).ToListAsync();

            return users;
        }
    }
}
