﻿using System.ComponentModel.DataAnnotations;

namespace DTOS
{
    public class EmployeeDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [RegularExpression(@"^\S*$", ErrorMessage = "Name should not contain spaces")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Age is required")]
        [Range(21, int.MaxValue, ErrorMessage = "Age should be greater than 20")]
        public int Age { get; set; }

        [Required(ErrorMessage = "Addresses list is required")]
        [MinLength(1, ErrorMessage = "Addresses list should not be empty")]
        public IEnumerable<AddressDto> Addresses { get; set; }
    }
}