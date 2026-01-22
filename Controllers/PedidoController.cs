using Microsoft.AspNetCore.Mvc;
using ApiPedido.Data;
using ApiPedido.Models;
using Microsoft.AspNetCore.Authorization;


namespace ApiPedido.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/pedidos")]
    public class PedidoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Pedidos.ToList());
        }

        [HttpPost]
        public IActionResult Post(Pedido pedido)
        {
            //pedido.Fecha = DateTime.Now;
            _context.Pedidos.Add(pedido);
            _context.SaveChanges();
            return Ok(pedido);
        }
    }
}
