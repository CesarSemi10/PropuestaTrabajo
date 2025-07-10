using AppPropuesta.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppPropuesta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class KardexController : Controller
    {
        private readonly AppDbContext _context;

        public KardexController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> ListarKardex()
        {
            var kardex = await _context.MovimientoCab
                .Include(m => m.Detalles)
                .ThenInclude(d => d.Producto)
                .ToListAsync();
            return Ok(kardex);
        }

        [HttpGet("{idProducto}")]
        public async Task<IActionResult> ListarKardexPorProducto(int idProducto)
        {
            var movimientos = await _context.MovimientoDet
                .Include(d => d.MovimientoCab)
                .Where(d => d.Id_Producto == idProducto)
                .ToListAsync();
            return Ok(movimientos);
        }
    }
}
