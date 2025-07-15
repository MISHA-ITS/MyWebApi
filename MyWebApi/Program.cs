using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyWebApi.DAL;
using MyWebApi.DAL.Entities.Identity;
using MyWebApi.BLL.Services.User;
using MyWebApi.DAL.Initializer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

// Register the DbContext with dependency injection
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql("name=PostgresLocal");
});

// Register Identity services
builder.Services.AddIdentity<AppUser, AppRole>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequiredUniqueChars = 0;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = false;
    options.Password.RequireUppercase = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Seed();

app.Run();
