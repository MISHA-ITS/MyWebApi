using MyWebApi.BLL.DTOs.Role;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.BLL.Services.Role
{
    public interface IRoleService
    {
        Task<ServiceResponse> CreateAsync(CreateRoleDTO dto);
        Task<ServiceResponse> UpdateAsync(UpdateRoleDTO dto);
        Task<ServiceResponse> DeleteAsync(string id);
        Task<ServiceResponse> GetByIdAsync(string id);
        Task<ServiceResponse> GetAllAsync();
    }
}
