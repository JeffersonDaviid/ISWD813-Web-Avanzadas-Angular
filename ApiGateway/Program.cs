using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Ocelot.Provider.Consul;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Cargar configuración de Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Agregar logging para ver más detalles
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

// Inyectar Ocelot + Consul
builder.Services.AddOcelot().AddConsul(); // ¡Importante el .AddConsul()!

// Configurar logging para Ocelot
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
    logging.SetMinimumLevel(LogLevel.Debug);
});


// JWT
var jwtKey = "CLAVE_SUPER_SECRETA_ACADEMICA_12345";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

// Middleware para capturar y mostrar errores
app.Use(async (context, next) =>
{
    try
    {
        await next.Invoke();
    }
    catch (Exception ex)
    {
        // Capturar todos los errores no manejados
        Console.WriteLine($"═══════════════════════════════════════════════════");
        Console.WriteLine($"ERROR NO MANEJADO: {DateTime.UtcNow}");
        Console.WriteLine($"Ruta: {context.Request.Path}");
        Console.WriteLine($"Método: {context.Request.Method}");
        Console.WriteLine($"Excepción: {ex.GetType().Name}");
        Console.WriteLine($"Mensaje: {ex.Message}");

        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
            Console.WriteLine($"Stack Trace (Inner): {ex.InnerException.StackTrace}");
        }

        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        Console.WriteLine($"═══════════════════════════════════════════════════");

        throw;
    }
});

app.UseAuthentication();
app.UseAuthorization();

// 👉 Controllers del Gateway (login)
app.MapControllers();

// Middleware específico para logs de Ocelot
app.Use(async (context, next) =>
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();

    // Log de solicitud entrante
    logger.LogInformation($"➡️ Solicitud entrante: {context.Request.Method} {context.Request.Path}");

    await next.Invoke();

    // Log de respuesta
    logger.LogInformation($"⬅️ Respuesta: {context.Response.StatusCode}");
});

// 👉 Ocelot SOLO para rutas que NO empiecen con /api-gw
app.MapWhen(
    context => !context.Request.Path.StartsWithSegments("/api-gw"),
    async appBuilder =>
    {
        try
        {
            await appBuilder.UseOcelot();
        }
        catch (Exception ex)
        {
            var logger = app.Services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "❌ Error en Ocelot middleware");

            // También imprimir en consola
            Console.WriteLine($"🚨 ERROR OCELOT: {ex.Message}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"🚨 INNER: {ex.InnerException.Message}");
            }

            throw;
        }
    });


// Configurar logging más detallado
var loggerFactory = LoggerFactory.Create(builder =>
{
    builder.AddConsole();
    builder.AddFilter("Ocelot", LogLevel.Debug);
    builder.AddFilter("Microsoft", LogLevel.Warning);
    builder.AddFilter("System", LogLevel.Warning);
});

app.Run();