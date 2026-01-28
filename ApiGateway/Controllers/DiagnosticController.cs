using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api-gw/diagnostic")]
public class DiagnosticController : ControllerBase
{
    private readonly ILogger<DiagnosticController> _logger;
    private readonly IConfiguration _configuration;

    public DiagnosticController(ILogger<DiagnosticController> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    [HttpGet("consul-info")]
    public IActionResult GetConsulInfo()
    {
        try
        {
            var consulAddress = _configuration["ConsulConfig:Address"];
            var serviceName = _configuration["ConsulConfig:ServiceName"];

            return Ok(new
            {
                ConsulAddress = consulAddress,
                ServiceName = serviceName,
                GatewayPort = _configuration["ConsulConfig:ServicePort"],
                Time = DateTime.UtcNow,
                Message = "Información de Consul desde Gateway"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error obteniendo info de Consul");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}