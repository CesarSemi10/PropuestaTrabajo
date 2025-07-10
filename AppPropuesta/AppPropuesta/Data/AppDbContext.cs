using AppPropuesta.Models;
using Microsoft.EntityFrameworkCore;

namespace AppPropuesta.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<CompraCab> ComprasCab { get; set; }
        public DbSet<CompraDet> ComprasDet { get; set; }
        public DbSet<VentaCab> VentasCab { get; set; }
        public DbSet<VentaDet> VentasDet { get; set; }
        public DbSet<MovimientoCab> MovimientoCab { get; set; }
        public DbSet<MovimientoDet> MovimientoDet { get; set; }

    }
}
