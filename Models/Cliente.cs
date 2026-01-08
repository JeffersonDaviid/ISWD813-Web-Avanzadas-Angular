using System.Runtime.Serialization;

namespace ServicioClientesSOA.Models
{
    [DataContract(Namespace = "http://schemas.datacontract.org/2004/07/ServicioClientesSOA.Models")]
    public class Cliente
    {
        [DataMember(Order = 1)]
        public int Id { get; set; }

        [DataMember(Order = 2)]
        public string Nombres { get; set; }

        [DataMember(Order = 3)]
        public string Apellidos { get; set; }

        [DataMember(Order = 4)]
        public string Email { get; set; }

        [DataMember(Order = 5)]
        public string Cedula { get; set; }
    }
}
