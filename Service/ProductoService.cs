using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ServicioProductoSOA.Data;
using ServicioProductoSOA.Models;

namespace ServicioProductoSOA.Service;

public class ProductoService : IProductoService
{



    private readonly AppDbContext _context;
    public ProductoService(AppDbContext context)
    {
        _context = context;
    }
    public List<Producto> ListarProductos()
    {
        return _context.Productos.ToList();
    }

    public Producto BuscarProducto(int id)
    {
        var producto = _context.Productos.FirstOrDefault(c => c.Id == id)
            ?? throw new KeyNotFoundException($"Cliente with cedula {id} not found.");
        return producto;
    }

    public void InsertarProducto(Producto producto)
    {
        _context.Productos.Add(producto);
        _context.SaveChanges();
    }

    public void ActualizarProducto(Producto producto)
    {
        var productoExistente = _context.Productos.Find(producto.Id)
            ?? throw new KeyNotFoundException($"Producto with id {producto.Id} not found.");

        productoExistente.Id_tipo = producto.Id_tipo;
        productoExistente.Descripcion = producto.Descripcion;
        productoExistente.Valor = producto.Valor;
        productoExistente.Costo = producto.Costo;
        _context.SaveChanges();
    }

    public void EliminarProducto(int id)
    {
        var producto = _context.Productos.First(c => c.Id == id);
        if (producto != null)
        {
            _context.Productos.Remove(producto);
            _context.SaveChanges();
        }
    }



}
