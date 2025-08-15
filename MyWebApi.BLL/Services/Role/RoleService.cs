using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyWebApi.BLL.DTOs.Role;
using MyWebApi.BLL.Services.Image;
using MyWebApi.DAL.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.BLL.Services.Role
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;

        public RoleService(RoleManager<AppRole> roleManager, IMapper mapper, IImageService imageService)
        {
            _roleManager = roleManager;
            _mapper = mapper;
            _imageService = imageService;
        }

        public async Task<ServiceResponse> CreateAsync(CreateRoleDTO dto)
        {
            if (!await IsUniqueNameAsync(dto.Name))
            {
                return ServiceResponse.Error($"Роль з іменем {dto.Name} вже існує");
            }

            var entity = _mapper.Map<AppRole>(dto);

            var result = await _roleManager.CreateAsync(entity);
            entity.NormalizedName = dto.Name.ToUpper();

            if (result.Succeeded)
            {
                return ServiceResponse.Success($"Роль {entity.Name} успішно додано", dto);
            }
            return ServiceResponse.Error($"Не вдалося створити роль");
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateRoleDTO dto)
        {
            var entity = _mapper.Map<AppRole>(dto);

            var result = await _roleManager.UpdateAsync(entity);

            if (result.Succeeded)
            {
                return ServiceResponse.Success($"Роль {entity.Name} успішно оновлено", dto);
            }
            return ServiceResponse.Error($"Не вдалося оновити роль");
        }

        public async Task<ServiceResponse> DeleteAsync(string id)
        {
            var entity = await _roleManager.FindByIdAsync(id);

            if (entity == null)
            {
                return ServiceResponse.Error($"Роль з id {id} не знайдено");
            }

            var result = await _roleManager.DeleteAsync(entity);

            if (result.Succeeded)
            {
                return ServiceResponse.Success($"Роль {entity.Name} успішно видалено");
            }

            return ServiceResponse.Error($"Не вдалося видалити роль");
        }

        public async Task<ServiceResponse> GetAllAsync()
        {
            var entities = await _roleManager.Roles
                .ToListAsync();

            var dtos = _mapper.Map<List<RoleDTO>>(entities);

            return ServiceResponse.Success("Ролі отримано", dtos);
        }

        public async Task<ServiceResponse> GetByIdAsync(string id)
        {
            var entity = await _roleManager.FindByIdAsync(id);

            if (entity == null)
            {
                return ServiceResponse.Error($"Роль з id {id} не знайдено");
            }

            var dto = _mapper.Map<RoleDTO>(entity);

            return ServiceResponse.Success($"Роль з id {id} отримано", dto);
        }

        public async Task<bool> IsUniqueNameAsync(string name)
        {
            return !await _roleManager.Roles
                .AnyAsync(c => c.NormalizedName == name.ToUpper());
        }
    }
}
