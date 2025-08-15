using MyWebApi.BLL.DTOs.Account;
using MyWebApi.DAL.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.BLL.Services.Account
{
    public interface IAccountService
    {
        Task<ServiceResponse> LoginAsync(LoginDTO dto);
        Task<ServiceResponse?> RegisterAsync(RegisterDTO dto);
        Task<ServiceResponse> ConfirmEmailAsync(string userId, string token);
        Task<ServiceResponse> GoogleLoginAsync(GoogleLoginDTO dto);
        Task<ServiceResponse> GetUserLoginsAsync(string userId);
        Task<ServiceResponse> RemoveLoginAsync(string userId, string loginProvider, string providerKey);
    }
}
