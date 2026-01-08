using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ServicioClientesSOA.Data;
using ServicioClientesSOA.Models;

namespace ServicioClientesSOA.Service;

public class ClienteService : IClienteService
{
    private readonly AppDbContext _context;
    public ClienteService(AppDbContext context)
    {
        _context = context;
    }
    public List<Cliente> ListarClientes()
    {
        return _context.Clientes.ToList();
    }

    public Cliente BuscarCliente(string cedula)
    {
        var cliente = _context.Clientes.FirstOrDefault(c => c.Cedula == cedula)
            ?? throw new KeyNotFoundException($"Cliente with cedula {cedula} not found.");
        return cliente;
    }

    public void InsertarCliente(Cliente cliente)
    {
        _context.Clientes.Add(cliente);
        _context.SaveChanges();
    }

    public void ActualizarCliente(Cliente cliente)
    {
        var clienteExistente = _context.Clientes.Find(cliente.Id)
            ?? throw new KeyNotFoundException($"Cliente with id {cliente.Id} not found.");

        clienteExistente.Nombres = cliente.Nombres;
        clienteExistente.Apellidos = cliente.Apellidos;
        clienteExistente.Email = cliente.Email;
        // Actualiza otros campos excepto Id y Cedula

        _context.SaveChanges();
    }

    public void EliminarCliente(string cedula)
    {
        var cliente = _context.Clientes.First(c => c.Cedula == cedula);
        if (cliente != null)
        {
            _context.Clientes.Remove(cliente);
            _context.SaveChanges();
        }
    }

}
