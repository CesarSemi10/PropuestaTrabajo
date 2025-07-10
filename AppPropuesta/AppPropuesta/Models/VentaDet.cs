using System.ComponentModel.DataAnnotations;

namespace AppPropuesta.Models
{
    public class VentaDet
    {
        [Key]
        public int Id_VentaDet { get; set; }

        [Required]
        public int Id_VentaCab { get; set; }
        public VentaCab? VentaCab { get; set; } 

        [Required]
        public int Id_Producto { get; set; }
        public Producto? Producto { get; set; }

        public decimal Cantidad { get; set; }
        public decimal Precio { get; set; }
        public decimal Sub_Total { get; set; }
        public decimal Igv { get; set; }
        public decimal Total { get; set; }
    }
}
