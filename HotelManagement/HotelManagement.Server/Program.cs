using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Data;
using HotelManagement.API.Repositories;
using HotelManagement.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Configurar CORS para permitir el frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // Puertos comunes de React/Vite
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configurar DbContext con base de datos en memoria
builder.Services.AddDbContext<HotelDbContext>(options =>
    options.UseInMemoryDatabase("HotelDB"));

// Registrar Repositorios
builder.Services.AddScoped<IHuespedRepository, HuespedRepository>();
builder.Services.AddScoped<ICuartoRepository, CuartoRepository>();
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();

// Registrar Servicios
builder.Services.AddScoped<IHuespedService, HuespedService>();
builder.Services.AddScoped<ICuartoService, CuartoService>();
builder.Services.AddScoped<IReservaService, ReservaService>();

// Agregar controladores
builder.Services.AddControllers();

// Configurar Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Hotel Management API",
        Version = "v1",
        Description = "API REST para la gestión de un sistema hotelero - Huéspedes, Cuartos y Reservas",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Sistema de Gestión Hotelera",
            Email = "info@hotelapi.com"
        }
    });

    // Habilitar comentarios XML para documentación en Swagger
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// Inicializar la base de datos con datos semilla
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<HotelDbContext>();
    context.Database.EnsureCreated();
}

// Configurar el pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hotel Management API v1");
        c.RoutePrefix = string.Empty; // Swagger en la raíz (http://localhost:5000)
    });
}

// Habilitar CORS
app.UseCors("AllowReact");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Endpoint de prueba
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "OK",
    message = "API funcionando correctamente",
    timestamp = DateTime.Now
}))
.WithName("HealthCheck")
.WithTags("Health");

app.Run();