using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyWebApi.BLL.DTOs.User;
using MyWebApi.BLL.Services.Image;
using MyWebApi.DAL.Entities.Identity;

namespace MyWebApi.BLL.Services.User
{
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;

        public UserService(UserManager<AppUser> userManager, IMapper mapper, IImageService imageService)
        {
            _userManager = userManager;
            _mapper = mapper;
            _imageService = imageService;
        }

        public async Task<ServiceResponse> CreateAsync(CreateUserDTO dto)
        {
            if (await _userManager.FindByEmailAsync(dto.Email) != null)
            {
                return ServiceResponse.Error($"Користувач з електронною адресою {dto.Email} вже існує");
            }

            var user = _mapper.Map<AppUser>(dto);
            user.UserName = user.Email?.Split('@')[0] ?? "unknown";

            if (dto.Image != null)
            {
                string? imageName = await _imageService.SaveImageAsync(dto.Image, Settings.UsersDir);

                if (!string.IsNullOrEmpty(imageName))
                {
                    user.Image = Settings.UsersDir + "/" + imageName;
                }
            }

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (result.Succeeded)
            {
                return ServiceResponse.Success($"Користувача {user.UserName} успішно додано", dto);
            }

            return ServiceResponse.Error($"Не вдалося створити користувача");
        }

        public async Task<ServiceResponse> DeleteAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return ServiceResponse.Error($"Користувача з Id {id} не знайдено");
            }

            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return ServiceResponse.Success($"Користувача {user.UserName} успішно видалено");
            }

            return ServiceResponse.Error($"Не вдалося видалити користувача");
        }

        public async Task<ServiceResponse> GetAllAsync()
        {
            var users = await _userManager.Users.ToListAsync();

            var dtos = _mapper.Map<List<UserDTO>>(users);

            return ServiceResponse.Success("Користувачів отримано", dtos);
        }

        public async Task<ServiceResponse?> GetByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user != null)
            {
                var dto = _mapper.Map<UserDTO>(user);
                return ServiceResponse.Success($"Користувача з Id {id} отримано", dto);
            }

            return ServiceResponse.Error($"Користувача з Id {id} не знайдено");
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateUserDTO dto)
        {
            var user = await _userManager.FindByIdAsync(dto.Id);

            if (user == null)
            {
                return ServiceResponse.Error($"Користувача з Id {dto.Id} не знайдено");
            }

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);

            if (existingUser != null && existingUser.Id != dto.Id)
            {
                return ServiceResponse.Error($"Користувач з електронною адресою {dto.Email} вже існує");
            }

            user = _mapper.Map(dto, user);

            if (dto.Image != null)
            {
                string? imageName = await _imageService.SaveImageAsync(dto.Image, Settings.UsersDir);

                if (!string.IsNullOrEmpty(imageName))
                {
                    user.Image = Settings.UsersDir + "/" + imageName;
                }
            }

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return ServiceResponse.Success($"Користувача {user.UserName} успішно оновлено", dto);
            }

            return ServiceResponse.Error($"Не вдалося оновити користувача", dto);
        }
    }
}
