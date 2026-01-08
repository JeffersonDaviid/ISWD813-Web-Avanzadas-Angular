using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using Microsoft.EntityFrameworkCore;
using ServicioProductoSOA.Data;
using ServicioProductoSOA.Models;
using ServicioProductoSOA.Service;

var builder = WebApplication.CreateBuilder(args);

// =======================
// Entity Framework
// =======================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        "Host=localhost;Port=5433;Database=productos;Username=user;Password=userpass"
    ));

// =======================
// CoreWCF
// =======================
builder.Services.AddServiceModelServices();
builder.Services.AddServiceModelMetadata();
builder.Services.AddScoped<ProductoService>();
builder.Services.AddScoped<TipoProductoService>();

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
    serviceBuilder.AddService<ProductoService>();
    serviceBuilder.AddServiceEndpoint<ProductoService, IProductoService>(
        new BasicHttpBinding(),
        "/ProductoService.svc"
    );


    serviceBuilder.AddService<TipoProductoService>();
    serviceBuilder.AddServiceEndpoint<TipoProductoService, ITipoProductoService>(
        new BasicHttpBinding(),
        "/TipoProductoService.svc"
    );
});

// =======================
// Metadata (WSDL)
// =======================
var serviceMetadata = app.Services.GetRequiredService<ServiceMetadataBehavior>();
serviceMetadata.HttpGetEnabled = true;

app.Run();
