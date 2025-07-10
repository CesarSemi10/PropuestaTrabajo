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
    public class CompraController : Controller
    {
        private readonly AppDbContext _context;

        public CompraController(AppDbContext context)
        {
            _context = context;
        }

        // Registrar Compra
        [HttpPost]
        public async Task<IActionResult> RegistrarCompra([FromBody] CompraCab model)
        {
            model.FecRegistro = DateTime.Now;
            _context.ComprasCab.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        // Listar Compras
        [HttpGet]
        public async Task<IActionResult> ListarCompras()
        {
            var compras = await _context.ComprasCab
                .Include(c => c.Detalles)
                .ToListAsync();
            return Ok(compras);
        }
    }
}
