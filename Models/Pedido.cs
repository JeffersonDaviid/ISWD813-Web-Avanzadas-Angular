using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApiPedido.Models
{
    [Table("pedido")]
    public class Pedido
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Cliente { get; set; }

        public DateTime Fecha { get; set; }

        public decimal Total { get; set; }

        public string Estado { get; set; }
    }
}

