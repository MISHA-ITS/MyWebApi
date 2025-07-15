using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.DAL.Entities.Identity
{
    public class AppRoleClaim : IdentityRoleClaim<string>
    {
        public virtual AppRole? Role { get; set; }
    }
}
