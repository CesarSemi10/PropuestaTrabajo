using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AppPropuesta.Models
{
    public class CompraDet
    {
        [Key]
        public int Id_CompraDet { get; set; }

        [Required]
        public int Id_CompraCab { get; set; }

        [JsonIgnore]
        public CompraCab? CompraCab { get; set; }   

        [Required]
        public int Id_Producto { get; set; }

        [JsonIgnore]
        public Producto? Producto { get; set; }  

        public decimal Cantidad { get; set; }
        public decimal Precio { get; set; }
        public decimal Sub_Total { get; set; }
        public decimal Igv { get; set; }
        public decimal Total { get; set; }
    }
}
