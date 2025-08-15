using MyWebApi.DAL.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.BLL.Services.JwtToken
{
    public interface IJwtTokenService
    {
        string GenerateToken(AppUser user);
    }
}
