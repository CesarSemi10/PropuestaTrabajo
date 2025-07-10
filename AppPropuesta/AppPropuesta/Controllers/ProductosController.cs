using AppPropuesta.Data;
using AppPropuesta.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace AppPropuesta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarProducto([FromBody] Producto model)
        {
            model.Fec_Registro = DateTime.Now;
            _context.Productos.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarProducto(int id, [FromBody] Producto model)
        {
            var prod = await _context.Productos.FindAsync(id);
            if (prod == null) return NotFound();

            prod.Nombre_Producto = model.Nombre_Producto;
            prod.NroLote = model.NroLote;
            prod.Costo = model.Costo;
            prod.PrecioVenta = model.PrecioVenta;
            // prod.Fec_Registro = model.Fec_Registro; // Mantiene la fecha original

            await _context.SaveChangesAsync();
            return Ok(prod);
        }

        //[HttpGet]
        //public async Task<IActionResult> ListarProductos()
        //{
        //    var productos = await _context.Productos.ToListAsync();
        //    return Ok(productos);
        //}
        [HttpGet]
        public async Task<IActionResult> ListarProductos()
        {
            try
            {
                // 1. Obtén la lista de productos básicos primero
                var productos = await _context.Productos
                    .Select(p => new {
                        p.Id_Producto,
                        p.Nombre_Producto,
                        p.PrecioVenta,
                        p.Costo
                    })
                    .ToListAsync();

                // 2. Calcula el stock para cada producto
                var resultado = new List<object>();
                foreach (var p in productos)
                {
                    var movimientos = await _context.MovimientoDet
                    .Where(m => m.Id_Producto == p.Id_Producto)
                    .Join(
                        _context.MovimientoCab,
                        det => det.Id_MovimientoCab,
                        cab => cab.Id_MovimientoCab,
                        (det, cab) => new { det.Cantidad, cab.Id_TipoMovimiento }
                    )
                    .ToListAsync();


                    var stock = movimientos.Sum(x => x.Id_TipoMovimiento == 1 ? x.Cantidad : -x.Cantidad);

                    resultado.Add(new
                    {
                        p.Id_Producto,
                        p.Nombre_Producto,
                        p.PrecioVenta,
                        p.Costo,
                        Stock = stock
                    });
                }
                // 3. Retorna el resultado
                return Ok(resultado);

            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, new { message = "Error interno del servidor", detail = ex.Message });
            }
        }

        [HttpGet("{id}/movimientos")]
        public async Task<IActionResult> MovimientosPorProducto(int id)
        {
            var movimientos = await _context.MovimientoDet
                .Where(d => d.Id_Producto == id)
                .Join(_context.MovimientoCab,
                      det => det.Id_MovimientoCab,
                      cab => cab.Id_MovimientoCab,
                      (det, cab) => new {
                          cab.Fec_registro,
                          cab.Id_TipoMovimiento,
                          det.Cantidad
                      })
                .OrderBy(m => m.Fec_registro)
                .ToListAsync();

            return Ok(movimientos.Select(m => new {
                fec_registro = m.Fec_registro, // nombre en minúsculas
                id_TipoMovimiento = m.Id_TipoMovimiento,
                cantidad = m.Cantidad
            }));
        }
    }
}
