using AutoMapper;
using MyWebApi.BLL.DTOs.User;
using MyWebApi.DAL.Entities.Identity;
namespace MyWebApi.BLL.MapperProfiles
{
    public class UserMapperProfile : Profile
    {
        public UserMapperProfile()
        {
            //CreateUserDTO -> AppUser
            CreateMap<CreateUserDTO, AppUser>()
                .ForMember(dest => dest.Image, opt => opt.Ignore());

            //UpdateUserDTO -> AppUser
            CreateMap<UpdateUserDTO, AppUser>()
                .ForMember(dest => dest.Image, opt => opt.Ignore());

            //UserEntity -> UserDTO
            CreateMap<AppUser, UserDTO>();
        }
    }
}
