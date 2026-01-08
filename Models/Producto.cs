using System.Runtime.Serialization;

namespace ServicioProductoSOA.Models
{
    [DataContract(Namespace = "http://schemas.datacontract.org/2004/07/ServicioProductoSOA.Models")]
    public class Producto
    {
        [DataMember(Order = 1)]
        public int Id { get; set; }

        [DataMember(Order = 2)]
        public int Id_tipo { get; set; }

        [DataMember(Order = 3)]
        public string Descripcion { get; set; }

        [DataMember(Order = 4)]
        public double Valor { get; set; }

        [DataMember(Order = 5)]
        public double Costo { get; set; }

        public TipoProducto TipoProducto { get; set; }

    }
}
