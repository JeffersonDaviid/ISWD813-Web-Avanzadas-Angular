using Microsoft.EntityFrameworkCore;
using ServicioClientesSOA.Models;

namespace ServicioClientesSOA.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }
    public DbSet<Cliente> Clientes { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>().ToTable("clientes");
        modelBuilder.Entity<Cliente>().Property(c => c.Id).HasColumnName("id");
        modelBuilder.Entity<Cliente>().Property(c => c.Cedula).HasColumnName("cedula");
        modelBuilder.Entity<Cliente>().Property(c => c.Nombres).HasColumnName("nombres");
        modelBuilder.Entity<Cliente>().Property(c => c.Apellidos).HasColumnName("apellidos");
        modelBuilder.Entity<Cliente>().Property(c => c.Email).HasColumnName("email");
    }
}
