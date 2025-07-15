using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.DAL.Settings
{
    public static class RoleSettings
    {
        public const string AdminRoleName = "Admin";
        public const string UserRoleName = "User";
        public static readonly List<string> DefaultRoles = new()
        {
            AdminRoleName,
            UserRoleName,
        };
    }
}
