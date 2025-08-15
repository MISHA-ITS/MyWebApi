using MyWebApi.BLL.DTOs.User;

namespace MyWebApi.BLL.Services.User
{
    public interface IUserService
    {
        Task<ServiceResponse> CreateAsync(CreateUserDTO dto);
        Task<ServiceResponse> UpdateAsync(UpdateUserDTO dto);
        Task<ServiceResponse> DeleteAsync(string id);
        Task<ServiceResponse?> GetByIdAsync(string id);
        Task<ServiceResponse> GetAllAsync();
    }
}
