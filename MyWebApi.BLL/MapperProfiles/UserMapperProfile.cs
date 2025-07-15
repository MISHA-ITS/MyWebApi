using AutoMapper;
using MyWebApi.BLL.DTOs.User;
using MyWebApi.DAL.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebApi.BLL.MapperProfiles
{
    class UserMapperProfile : Profile
    {
        public UserMapperProfile()
        {
            //UserEntity -> UserDTO
            CreateMap<AppUser, UserDTO>();
        }
    }
}
