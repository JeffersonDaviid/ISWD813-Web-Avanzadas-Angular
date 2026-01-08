using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ServicioProductoSOA.Data;
using ServicioProductoSOA.Models;

namespace ServicioProductoSOA.Service;

public class TipoProductoService : ITipoProductoService
{
    private readonly AppDbContext _context;
    public TipoProductoService(AppDbContext context)
    {
        _context = context;
    }
    public List<TipoProducto> ListarTipoProductos()
    {
        return _context.TipoProductos.ToList();
    }

    public TipoProducto BuscarTipoProducto(int id)
    {
        var tipoProducto = _context.TipoProductos.FirstOrDefault(t => t.Id == id)
            ?? throw new KeyNotFoundException($"Cliente with cedula {id} not found.");
        return tipoProducto;
    }

    public void InsertarTipoProducto(TipoProducto tipoProducto)
    {
        _context.TipoProductos.Add(tipoProducto);
        _context.SaveChanges();
    }

    public void ActualizarProducto(TipoProducto tipoProducto)
    {
        var tipoProductoExistente = _context.TipoProductos.Find(tipoProducto.Id)
            ?? throw new KeyNotFoundException($"Tipo Producto with id {tipoProducto.Id} not found.");

        tipoProductoExistente.Id = tipoProducto.Id;
        tipoProductoExistente.Tipo = tipoProducto.Tipo;
        _context.SaveChanges();
    }

    public void EliminarProdcuto(int id)
    {
        var tipoProducto = _context.TipoProductos.First(c => c.Id == id);
        if (tipoProducto != null)
        {
            _context.TipoProductos.Remove(tipoProducto);
            _context.SaveChanges();
        }
    }



}
