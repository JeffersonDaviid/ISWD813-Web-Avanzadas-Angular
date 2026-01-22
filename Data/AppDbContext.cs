using Microsoft.EntityFrameworkCore;
using ApiPedido.Models;

namespace ApiPedido.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Pedido> Pedidos { get; set; }
    }
}
