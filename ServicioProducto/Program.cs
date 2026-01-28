using Consul;

var builder = WebApplication.CreateBuilder(args);

// Configuración de Consul
builder.Services.AddSingleton<IConsulClient, ConsulClient>(p => new ConsulClient(consulConfig =>
{
    var address = builder.Configuration["ConsulConfig:Address"];
    consulConfig.Address = new Uri(address);
}));

// Configurar Kestrel para escuchar en todas las interfaces
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(8081); // Esto es correcto
});

var app = builder.Build();

// ========== 1. AGREGAR HEALTH CHECK ENDPOINT ==========
app.MapGet("/health", () =>
{
    var hostName = System.Net.Dns.GetHostName();
    var addresses = System.Net.Dns.GetHostAddresses(hostName);

    return Results.Ok(new
    {
        Status = "Healthy",
        Service = builder.Configuration["ConsulConfig:ServiceName"],
        ServiceHost = builder.Configuration["ConsulConfig:ServiceHost"],
        ContainerHostname = hostName,
        IPs = addresses.Select(a => a.ToString()).ToArray(),
        Timestamp = DateTime.UtcNow
    });
});

// ========== 2. ENDPOINT VEHICULO ==========
app.MapGet("/api/vehiculos", () =>
{
    var hostName = System.Net.Dns.GetHostName();
    return new
    {
        Message = "Vehiculos desde api/vehiculos",
        Container = hostName,
        Timestamp = DateTime.UtcNow,
        Products = new[]
        {
            new { Id = 1, Placa = "PAA1112", Provincia= "Pichincha" },
            new { Id = 2, Placa = "ABB2222", Provincia= "Azuay" }
        }
    };
});

// ========== 2. ENDPOINT CLIENTE ==========
app.MapGet("/api/cliente", () =>
{
    var hostName = System.Net.Dns.GetHostName();
    return new
    {
        Message = "Clientes desde api/cliente",
        Container = hostName,
        Timestamp = DateTime.UtcNow,
        Products = new[]
        {
            new { Id = 1, Cedula = "17527605551", Nombre= "David", Telefono= "0992758388" },
            new { Id = 2, Cedula = "17527605536", Nombre= "Tommy", Telefono= "0984784578"}
        }
    };
});

// ========== 3. REGISTRAR EN CONSUL ==========
var consulClient = app.Services.GetRequiredService<IConsulClient>();
var logger = app.Services.GetRequiredService<ILogger<Program>>();
var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();

// Datos del servicio
var serviceName = builder.Configuration["ConsulConfig:ServiceName"];
var serviceId = builder.Configuration["ConsulConfig:ServiceId"];
var serviceHost = builder.Configuration["ConsulConfig:ServiceHost"]; // "producto-service"
var servicePort = int.Parse(builder.Configuration["ConsulConfig:ServicePort"]);

// Obtener IP real del contenedor
var containerHostname = System.Net.Dns.GetHostName();
var ipAddresses = System.Net.Dns.GetHostAddresses(containerHostname);
var containerIp = ipAddresses.FirstOrDefault()?.ToString() ?? serviceHost;

logger.LogInformation($"🔧 Configurando registro en Consul:");
logger.LogInformation($"   • Service Name: {serviceName}");
logger.LogInformation($"   • Service ID: {serviceId}");
logger.LogInformation($"   • Service Host (config): {serviceHost}");
logger.LogInformation($"   • Service Port: {servicePort}");
logger.LogInformation($"   • Container Hostname: {containerHostname}");
logger.LogInformation($"   • Container IP: {containerIp}");

// IMPORTANTE: Aquí tienes dos opciones:

var registration = new AgentServiceRegistration()
{
    ID = serviceId,
    Name = serviceName,
    Address = containerIp, // ← Usar IP del contenedor
    Port = servicePort,

    Check = new AgentServiceCheck()
    {
        HTTP = $"http://{containerIp}:{servicePort}/health", // ← Health check por IP
        Interval = TimeSpan.FromSeconds(10),
        Timeout = TimeSpan.FromSeconds(5),
        DeregisterCriticalServiceAfter = TimeSpan.FromMinutes(1)
    },

    // Agregar tags para debugging
    Tags = new[] { "api", "productos", $"ip:{containerIp}", $"host:{containerHostname}" }
};



logger.LogInformation($"📝 Registrando en Consul...");
logger.LogInformation($"   • Address: {registration.Address}");
logger.LogInformation($"   • Health Check: {registration.Check.HTTP}");

try
{
    await consulClient.Agent.ServiceRegister(registration);
    logger.LogInformation($"✅ Registrado exitosamente en Consul");

    // Verificar que el registro fue exitoso
    var services = await consulClient.Agent.Services();
    var myService = services.Response.Values.FirstOrDefault(s => s.ID == serviceId);

    if (myService != null)
    {
        logger.LogInformation($"📋 Verificación: Servicio encontrado en Consul");
        logger.LogInformation($"   • Consul ID: {myService.ID}");
        logger.LogInformation($"   • Consul Address: {myService.Address}");
        logger.LogInformation($"   • Consul Port: {myService.Port}");
    }
}
catch (Exception ex)
{
    logger.LogError(ex, $"❌ Error registrando en Consul");
    throw;
}

// Des-registrar cuando la app se detenga
lifetime.ApplicationStopping.Register(() =>
{
    logger.LogInformation($"🗑️ Des-registrando de Consul: {serviceId}");
    try
    {
        consulClient.Agent.ServiceDeregister(serviceId).Wait();
        logger.LogInformation($"✅ Des-registrado exitosamente");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, $"❌ Error al des-registrar de Consul");
    }
});

app.Run();