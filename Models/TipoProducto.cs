using System.Runtime.Serialization;

namespace ServicioProductoSOA.Models
{
    [DataContract(Namespace = "http://schemas.datacontract.org/2004/07/ServicioProductoSOA.Models")]
    public class TipoProducto
    {
        [DataMember(Order = 1)]
        public int Id { get; set; }

        [DataMember(Order = 2)]
        public string Tipo { get; set; }

        public ICollection<Producto> Productos { get; set; }
    }
}
