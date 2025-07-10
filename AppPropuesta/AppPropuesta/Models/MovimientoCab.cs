using System.ComponentModel.DataAnnotations;

namespace AppPropuesta.Models
{
    public class MovimientoCab
    {
        [Key]
        public int Id_MovimientoCab { get; set; }

        public DateTime Fec_registro { get; set; }

        // 1 = Entrada, 2 = Salida
        public int Id_TipoMovimiento { get; set; }

        // Puede ser CompraCab o VentaCab según el tipo de movimiento
        public int Id_DocumentoOrigen { get; set; }

        public ICollection<MovimientoDet> Detalles { get; set; }
    }
}
