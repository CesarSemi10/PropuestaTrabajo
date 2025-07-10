using System.ComponentModel.DataAnnotations;

namespace AppPropuesta.Models
{
    public class MovimientoDet
    {
        [Key]
        public int Id_MovimientoDet { get; set; }

        [Required]
        public int Id_MovimientoCab { get; set; }
        public MovimientoCab MovimientoCab { get; set; }

        [Required]
        public int Id_Producto { get; set; }
        public Producto Producto { get; set; }

        public decimal Cantidad { get; set; }
    }
}
