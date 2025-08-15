using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.BLL.Services.Email
{
    public interface IEmailService
    {
        Task SendMessageAsync(string to, string subject, string body, bool isHtml = false);
    }
}
