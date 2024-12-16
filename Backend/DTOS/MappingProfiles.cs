using AutoMapper;
using Models;

namespace DTOS
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Employee, EmployeeDto>();
            CreateMap<Address, AddressDto>();
            CreateMap<AddressDto, Address>()
                .ForMember(m => m.Employee, opt => opt.Ignore());
            
            CreateMap<EmployeeDto, Employee>()
                .ForMember(dest => dest.Addresses, opt => opt.MapFrom(src => src.Addresses));

        }
    }

}
