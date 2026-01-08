using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using Microsoft.EntityFrameworkCore;
using ServicioClientesSOA.Data;
using ServicioClientesSOA.Service;

var builder = WebApplication.CreateBuilder(args);

// =======================
// Entity Framework
// =======================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        "Host=localhost;Port=5432;Database=app_clientes;Username=client;Password=clientpass"
    ));

// =======================
// CoreWCF
// =======================
builder.Services.AddServiceModelServices();
builder.Services.AddServiceModelMetadata();
builder.Services.AddScoped<ClienteService>();

// =======================
// CORS (🔴 DEBE IR ANTES DE Build)
// =======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});

var app = builder.Build();

// =======================
// Middleware
// =======================
app.UseCors("AllowAngular");

// =======================
// CoreWCF endpoints
// =======================
app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder.AddService<ClienteService>();
    serviceBuilder.AddServiceEndpoint<ClienteService, IClienteService>(
        new BasicHttpBinding(),
        "/ClienteService.svc"
    );
});

// =======================
// Metadata (WSDL)
// =======================
var serviceMetadata = app.Services.GetRequiredService<ServiceMetadataBehavior>();
serviceMetadata.HttpGetEnabled = true;

app.Run();
