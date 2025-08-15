using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.DAL.Entities
{
    public class AuthResponseModel
    {
        public bool IsNewUser { get; set; }
        public string Email { get; set; } = "";
        public string UserId { get; set; } = "";
        public string? JwtToken { get; set; }
        public string? Image { get; set; }
    }
}
