using AutoMapper;
using Backend;
using DTOS;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Controllers
{
    [Route("api/employees")]
    public class EmployeesController : Controller
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        int pageSize = 2;

        public EmployeesController(DataContext context, IMapper mapper, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _mapper = mapper;
            _env = webHostEnvironment;
        }

        [HttpGet]
        [Route("GetEmployees")]
        public JsonResult GetEmployees()
        {
            var employees = _context.Employees
                .Include(e => e.Addresses)
                //.Take(pageSize)
                .ToList();
            var lst = _mapper.Map<List<EmployeeDto>>(employees);
            
            return new JsonResult(lst);
        }

        [HttpGet]
        [Route("GetEmployees/{page}")]
        public JsonResult GetEmployees(int page)
        {
            var totalCount = _context.Employees.Count();
            var employees = _context.Employees
                .Include(e => e.Addresses)
                .Skip((page-1) * 2)
                .Take(pageSize)
                .ToList();
            var lst = _mapper.Map<List<EmployeeDto>>(employees);

            return new JsonResult(new { Employees = lst, TotalCount = totalCount });
        }

        [HttpPost]
        public JsonResult Post([FromBody] EmployeeDto employee)
        {
            var emp = _mapper.Map<EmployeeDto, Employee>(employee);

            var newAddresses = _mapper.Map<List<Address>>(employee.Addresses);
            emp.Addresses = newAddresses;

            _context.Employees.Add(emp);
            _context.SaveChanges();

            return new JsonResult("Added Successfully");
        }

        [HttpPut("{id}")]
        public JsonResult Update([FromBody] EmployeeDto updatedEmployee)
        {
            // Retrieve the employee from the database based on the provided ID
            var employee = _context.Employees.FirstOrDefault(e => e.Id == updatedEmployee.Id);
            if (employee == null)
            {
                return new JsonResult("employee not found.");
            }

            // Update the employee's properties based on the provided DTO
            employee.Name = updatedEmployee.Name;
            employee.Age = updatedEmployee.Age;

            // Update the addresses
            var oldAddresses = _context.Addresses.AsNoTracking().Where(a => a.EmployeeId == employee.Id).ToList();

            var newAddresses = _mapper.Map<List<Address>>(updatedEmployee.Addresses);
            employee.Addresses = newAddresses;

            for (int i = 0; i < oldAddresses.Count; i++)
            {
                var exist = newAddresses.FirstOrDefault(a => a.Id == oldAddresses[i].Id);
                if (exist == null)
                {
                    _context.Addresses.Remove(oldAddresses[i]);
                }
            }

            // Save the changes to the database
            _context.SaveChanges();

            return new JsonResult("employee updated successfully.");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            var existingEmployee = _context.Employees.Find(id);
            if (existingEmployee == null)
            {
                return new JsonResult("employee not found.");
            }

            _context.Employees.Remove(existingEmployee);
            _context.SaveChanges();

            return new JsonResult("Deleted.");
        }

        // additional method ;)
        [Route("uploadPhoto")]
        [HttpPost]
        public JsonResult UploadPhoto()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string fileName = postedFile.FileName;
                string physicalPath = _env.ContentRootPath + "/employeesPhotos/" + fileName;

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }
                return new JsonResult($"photo Uploaded : {fileName}");
            }
            catch (Exception)
            {
                return new JsonResult("default.png");
            }
        }
    }

}
