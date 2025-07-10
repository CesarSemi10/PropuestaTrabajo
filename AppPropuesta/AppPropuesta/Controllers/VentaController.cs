using AppPropuesta.Data;
using AppPropuesta.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppPropuesta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VentaController : Controller
    {
        private readonly AppDbContext _context;

        public VentaController(AppDbContext context)
        {
            _context = context;
        }

        // Registrar Venta
        [HttpPost]
        public async Task<IActionResult> RegistrarVenta([FromBody] VentaCab model)
        {
            model.FecRegistro = DateTime.Now;
            _context.VentasCab.Add(model);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Venta registrada con éxito" });
        }

        // Listar Ventas
        [HttpGet]
        public async Task<IActionResult> ListarVentas()
        {
            var ventas = await _context.VentasCab
                .Include(v => v.Detalles)
                .ToListAsync();
            return Ok(ventas);
        }
    }
}
