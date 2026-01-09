using System.Globalization;
using CoreWCF;
using ServicioProductoSOA.Models;

namespace ServicioProductoSOA.Service;

[ServiceContract]
public interface ITipoProductoService
{
    [OperationContract]
    List<TipoProducto> ListarTipoProductos();

    [OperationContract]
    TipoProducto BuscarTipoProducto(int id);

    [OperationContract]
    void InsertarTipoProducto(TipoProducto tipoProducto);

    [OperationContract]
    void ActualizarProducto(TipoProducto tipoProducto);

    [OperationContract]
    void EliminarTipoProducto(int id);
}
