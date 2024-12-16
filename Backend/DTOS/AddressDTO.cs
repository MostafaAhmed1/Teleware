using System.ComponentModel.DataAnnotations;

namespace DTOS
{
    public class AddressDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; }
    }

}
