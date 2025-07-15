using MyWebApi.BLL.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.BLL.Services.User
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetAllAsync();
    }
}
