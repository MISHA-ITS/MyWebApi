using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyWebApi.BLL.DTOs.Account;
using MyWebApi.BLL.Services.Email;
using MyWebApi.BLL.Services.JwtToken;
using MyWebApi.DAL.Entities;
using MyWebApi.DAL.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.BLL.Services.Account
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly IJwtTokenService _jwtTokenService;

        public AccountService(UserManager<AppUser> userManager, IEmailService emailService, IJwtTokenService jwtTokenService)
        {
            _userManager = userManager;
            _emailService = emailService;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<ServiceResponse?> RegisterAsync(RegisterDTO dto)
        {
            if (!await IsUniqueEmailAsync(dto.Email))
            {
                return ServiceResponse.Error($"Адреса електронної пошти {dto.Email} вже існує");
            }

            if (!await IsUniqueNameAsync(dto.UserName))
            {
                return ServiceResponse.Error($"Ім'я {dto.UserName} вже існує");
            }

            var user = new AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (result.Succeeded)
            {
                await SendEmailConfirmMessageAsync(user);

                string jwtToken = _jwtTokenService.GenerateToken(user);

                return ServiceResponse.Success("Реєтрація успішна", jwtToken);
            }

            return ServiceResponse.Error(result.Errors.First().Description);
        }

        private async Task SendEmailConfirmMessageAsync(AppUser user)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            byte[] bytes = Encoding.UTF8.GetBytes(token);
            token = Convert.ToBase64String(bytes);

            string htmlPath = Path.Combine(Settings.RootPath ?? "/", "templates", "html", "confirm_emaill.html");
            string html = File.ReadAllText(htmlPath);
            string url = $"https://localhost:7239/api/account/confirmEmail?userId={user.Id}&token={token}";
            html = html.Replace("action_url", url);

            await _emailService.SendMessageAsync(user.Email, "Підтвердження електронної пошти", html);
        }

        public async Task<ServiceResponse> LoginAsync(LoginDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return ServiceResponse.Error($"Користувача {dto.Email} не знайдено!");
            }

            var result = await _userManager.CheckPasswordAsync(user, dto.Password);

            if (!result)
            {
                return ServiceResponse.Error($"Неправильний пароль!");
            }

            string jwtToken = _jwtTokenService.GenerateToken(user);

            return ServiceResponse.Success("Успішний вхід", jwtToken);
        }

        public async Task<ServiceResponse> GoogleLoginAsync(GoogleLoginDTO dto)
        {
            try
            {
                // Спочатку перевіряємо чи існує користувач з цим Google ID
                var user = await _userManager.FindByLoginAsync("Google", dto.GoogleId);
                
                if (user == null)
                {
                    // Якщо користувача з Google ID не знайдено, перевіряємо по email
                    user = await _userManager.FindByEmailAsync(dto.Email);
                    
                    if (user == null)
                    {
                        // Створюємо нового користувача
                        user = new AppUser
                        {
                            UserName = dto.Email,
                            Email = dto.Email,
                            FirstName = dto.FirstName,
                            LastName = dto.LastName,
                            Image = dto.Picture,
                            EmailConfirmed = true // Google користувачі вже підтверджені
                        };

                        var result = await _userManager.CreateAsync(user);
                        
                        if (!result.Succeeded)
                        {
                            return ServiceResponse.Error("Помилка створення користувача: " + result.Errors.First().Description);
                        }
                    }
                    
                    // Додаємо Google login до AspNetUserLogins
                    var addLoginResult = await _userManager.AddLoginAsync(user, new UserLoginInfo("Google", dto.GoogleId, "Google"));
                    
                    if (!addLoginResult.Succeeded)
                    {
                        return ServiceResponse.Error("Помилка додавання Google акаунту: " + addLoginResult.Errors.First().Description);
                    }
                }
                else
                {
                    // Оновлюємо інформацію користувача якщо потрібно
                    bool updated = false;
                    
                    if (string.IsNullOrEmpty(user.FirstName) && !string.IsNullOrEmpty(dto.FirstName))
                    {
                        user.FirstName = dto.FirstName;
                        updated = true;
                    }
                    
                    if (string.IsNullOrEmpty(user.LastName) && !string.IsNullOrEmpty(dto.LastName))
                    {
                        user.LastName = dto.LastName;
                        updated = true;
                    }
                    
                    if (string.IsNullOrEmpty(user.Image) && !string.IsNullOrEmpty(dto.Picture))
                    {
                        user.Image = dto.Picture;
                        updated = true;
                    }

                    if (updated)
                    {
                        await _userManager.UpdateAsync(user);
                    }
                }

                // Генеруємо JWT токен
                string jwtToken = _jwtTokenService.GenerateToken(user);

                return ServiceResponse.Success("Успішний вхід через Google", jwtToken);
            }
            catch (Exception ex)
            {
                return ServiceResponse.Error($"Помилка Google автентифікації: {ex.Message}");
            }
        }

        private async Task<bool> IsUniqueEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            return user == null;
        }

        private async Task<bool> IsUniqueNameAsync(string name)
        {
            var user = await _userManager.FindByNameAsync(name);
            return user == null;
        }

        public async Task<ServiceResponse> ConfirmEmailAsync(string userId, string token)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
            {
                return ServiceResponse.Error("Невірний запит на підтвердження.");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return ServiceResponse.Error("Користувача не знайдено.");
            }

            try
            {
                byte[] bytes = Convert.FromBase64String(token);
                token = Encoding.UTF8.GetString(bytes);
            }
            catch
            {
                return ServiceResponse.Error("Некоректний токен.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);

            if (!result.Succeeded)
            {
                return ServiceResponse.Error("Не вдалося підтвердити електронну пошту.");
            }

            return ServiceResponse.Success("Електронна пошта успішно підтверджена.");
        }

        public async Task<ServiceResponse> GetUserLoginsAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return ServiceResponse.Error("Користувача не знайдено.");
                }

                var logins = await _userManager.GetLoginsAsync(user);
                var loginInfo = logins.Select(login => new
                {
                    LoginProvider = login.LoginProvider,
                    ProviderKey = login.ProviderKey,
                    ProviderDisplayName = login.ProviderDisplayName
                }).ToList();

                return ServiceResponse.Success("Список зовнішніх акаунтів отримано", loginInfo);
            }
            catch (Exception ex)
            {
                return ServiceResponse.Error($"Помилка отримання зовнішніх акаунтів: {ex.Message}");
            }
        }

        public async Task<ServiceResponse> RemoveLoginAsync(string userId, string loginProvider, string providerKey)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return ServiceResponse.Error("Користувача не знайдено.");
                }

                var result = await _userManager.RemoveLoginAsync(user, loginProvider, providerKey);
                
                if (result.Succeeded)
                {
                    return ServiceResponse.Success("Зовнішній акаунт успішно видалено.");
                }
                else
                {
                    return ServiceResponse.Error("Помилка видалення зовнішнього акаунту: " + result.Errors.First().Description);
                }
            }
            catch (Exception ex)
            {
                return ServiceResponse.Error($"Помилка видалення зовнішнього акаунту: {ex.Message}");
            }
        }
    }
}
