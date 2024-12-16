using Microsoft.EntityFrameworkCore;
using Models;

namespace Backend
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>()
                .HasKey(e => e.Id);

            modelBuilder.Entity<Address>()
                .HasKey(e => e.Id);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.Addresses).WithOne(p => p.Employee);

            modelBuilder.Entity<Address>()
                .HasOne(e => e.Employee).WithMany(p => p.Addresses);
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Address> Addresses { get; set; }

    }
}