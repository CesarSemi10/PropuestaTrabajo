using System.ComponentModel.DataAnnotations;

namespace AppPropuesta.Models
{
    public class Producto
    {
        [Key]
        public int Id_Producto { get; set; }

        [Required]
        public string Nombre_Producto { get; set; } = string.Empty;

        [Required]
        public string NroLote { get; set; } = string.Empty;

        public DateTime Fec_Registro { get; set; }

        public decimal Costo { get; set; }

        public decimal PrecioVenta { get; set; }
    }
}
