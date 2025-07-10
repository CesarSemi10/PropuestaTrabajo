using System.ComponentModel.DataAnnotations;

namespace AppPropuesta.Models
{
    public class VentaCab
    {
        [Key]
        public int Id_VentaCab { get; set; }

        public DateTime FecRegistro { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Igv { get; set; }
        public decimal Total { get; set; }

        public ICollection<VentaDet> Detalles { get; set; }
    }
}
