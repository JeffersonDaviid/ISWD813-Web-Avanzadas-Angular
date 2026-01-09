using System.Globalization;
using CoreWCF;
using ServicioProductoSOA.Models;

namespace ServicioProductoSOA.Service;

[ServiceContract]
public interface IProductoService
{
    [OperationContract]
    List<Producto> ListarProductos();

    [OperationContract]
    Producto BuscarProducto(int id);

    [OperationContract]
    void InsertarProducto(Producto producto);

    [OperationContract]
    void ActualizarProducto(Producto producto);

    [OperationContract]
    void EliminarProducto(int id);
}
