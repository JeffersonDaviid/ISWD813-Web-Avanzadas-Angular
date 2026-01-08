using System.Globalization;
using CoreWCF;
using ServicioClientesSOA.Models;

namespace ServicioClientesSOA.Service;

[ServiceContract]
public interface IClienteService
{
    [OperationContract]
    List<Cliente> ListarClientes();

    [OperationContract]
    Cliente BuscarCliente(string cedula);

    [OperationContract]
    void InsertarCliente(Cliente cliente);

    [OperationContract]
    void ActualizarCliente(Cliente cliente);

    [OperationContract]
    void EliminarCliente(string cedula);
}
