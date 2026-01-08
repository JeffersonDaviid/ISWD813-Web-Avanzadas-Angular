using Microsoft.EntityFrameworkCore;
using ServicioProductoSOA.Models;

namespace ServicioProductoSOA.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }
    public DbSet<Producto> Productos { get; set; }
    public DbSet<TipoProducto> TipoProductos { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Producto>().ToTable("productos");
        modelBuilder.Entity<Producto>().Property(c => c.Id).HasColumnName("id");
        modelBuilder.Entity<Producto>().Property(c => c.Id_tipo).HasColumnName("id_tipo");
        modelBuilder.Entity<Producto>().Property(c => c.Descripcion).HasColumnName("descripcion");
        modelBuilder.Entity<Producto>().Property(c => c.Valor).HasColumnName("valor");
        modelBuilder.Entity<Producto>().Property(c => c.Costo).HasColumnName("costo");

        modelBuilder.Entity<TipoProducto>().ToTable("tipoProducto");
        modelBuilder.Entity<TipoProducto>().Property(c => c.Id).HasColumnName("id");
        modelBuilder.Entity<TipoProducto>().Property(c => c.Tipo).HasColumnName("tipo");

        // 🔹 RELACIÓN
        modelBuilder.Entity<Producto>()
            .HasOne(p => p.TipoProducto)
            .WithMany(t => t.Productos)
            .HasForeignKey(p => p.Id_tipo)
            .OnDelete(DeleteBehavior.Restrict);
    }

}
