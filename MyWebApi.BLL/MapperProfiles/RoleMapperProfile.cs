using AutoMapper;
using Microsoft.AspNetCore.Identity;
using MyWebApi.BLL.DTOs.Role;

namespace MyWebApi.BLL.MapperProfiles
{
    public class RoleMapperProfile : Profile
    {
        public RoleMapperProfile()
        {
            //CreateRoleDTO -> RoleEntity
            CreateMap<CreateRoleDTO, IdentityRole>();

            //UpdateRoleDTO -> RoleEntity
            CreateMap<UpdateRoleDTO, IdentityRole>();

            //RoleEntity -> RoleDTO
            CreateMap<IdentityRole, RoleDTO>();
        }
    }
}
