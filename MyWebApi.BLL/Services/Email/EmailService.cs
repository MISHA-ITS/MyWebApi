using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using MyWebApi.BLL.Configuration;

namespace MyWebApi.BLL.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly SmtpClient _smtpClient;
        private EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> options)
        {
            _emailSettings = options.Value;

            _smtpClient = new SmtpClient(_emailSettings.Host, _emailSettings.Port);
            _smtpClient.EnableSsl = true;
            _smtpClient.Credentials = new NetworkCredential(_emailSettings.Email, _emailSettings.Password);
        }

        public async Task SendMessageAsync(string to, string subject, string body, bool isHtml = false)
        {
            var message = new MailMessage(_emailSettings.Email ?? "", to, subject, body);
            message.IsBodyHtml = isHtml;
            await _smtpClient.SendMailAsync(message);
        }
    }
}
