using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MyWebApi.DAL.Entities.Identity;
using MyWebApi.DAL.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.DAL.Initializer
{
    public static class Seeder
    {
        public static async void Seed(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<AppRole>>();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            await context.Database.MigrateAsync();

            //roles seeding
            if (!await roleManager.RoleExistsAsync(RoleSettings.AdminRoleName))
            {
                var adminRole = new AppRole { Name = RoleSettings.AdminRoleName };
                await roleManager.CreateAsync(adminRole);
            }

            if (!await roleManager.RoleExistsAsync(RoleSettings.UserRoleName))
            {
                var userRole = new AppRole { Name = RoleSettings.UserRoleName };
                await roleManager.CreateAsync(userRole);
            }

            //users seeding
            if (await userManager.FindByNameAsync("admin") == null)
            {
                var admin = new AppUser
                {
                    Email = "admin@mail.com",
                    UserName = "admin",
                    FirstName = "Admin",
                    LastName = "Adminenko",
                    EmailConfirmed = true,
                };

                await userManager.CreateAsync(admin, "qwerty");

                await userManager.AddToRoleAsync(admin, RoleSettings.AdminRoleName);
            }

            if (await userManager.FindByNameAsync("user") == null)
            {
                var user = new AppUser
                {
                    Email = "user@mail.com",
                    UserName = "user",
                    FirstName = "User",
                    LastName = "Userenjuk",
                    EmailConfirmed = true,
                };

                await userManager.CreateAsync(user, "qwerty");

                await userManager.AddToRoleAsync(user, RoleSettings.UserRoleName);
            }
        }
    }
}
