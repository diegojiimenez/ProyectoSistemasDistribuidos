using HotelManagement.API.Data;
using HotelManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.API.BackgroundServices
{
    public class CuartoEstadoBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<CuartoEstadoBackgroundService> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(5); // Ejecutar cada 5 minutos

        public CuartoEstadoBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<CuartoEstadoBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Servicio de actualización de estados de cuartos iniciado");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ActualizarEstadosCuartos();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al actualizar estados de cuartos");
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }

        private async Task ActualizarEstadosCuartos()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<HotelDbContext>();

            var fechaActual = DateTime.Today;

            // Obtener todos los cuartos con sus reservas
            var cuartos = await context.Cuartos
                .Include(c => c.Reservas)
                .ToListAsync();

            foreach (var cuarto in cuartos)
            {
                // Solo actualizar si el cuarto está en estado Disponible u Ocupado
                // No tocar cuartos en Mantenimiento o Limpieza
                if (cuarto.Estado != EstadoCuarto.Mantenimiento && 
                    cuarto.Estado != EstadoCuarto.Limpieza)
                {
                    // Buscar si hay una reserva activa HOY
                    var reservaActiva = cuarto.Reservas.FirstOrDefault(r =>
                        (r.Estado == EstadoReserva.Confirmada || r.Estado == EstadoReserva.EnCurso) &&
                        r.FechaEntrada <= fechaActual &&
                        r.FechaSalida > fechaActual);

                    if (reservaActiva != null)
                    {
                        // Hay una reserva activa: marcar como Ocupado
                        if (cuarto.Estado != EstadoCuarto.Ocupado)
                        {
                            cuarto.Estado = EstadoCuarto.Ocupado;
                            _logger.LogInformation($"Cuarto {cuarto.Numero} marcado como Ocupado");
                        }

                        // Si la reserva está confirmada y hoy es la fecha de entrada, cambiarla a EnCurso
                        if (reservaActiva.Estado == EstadoReserva.Confirmada && 
                            reservaActiva.FechaEntrada <= fechaActual)
                        {
                            reservaActiva.Estado = EstadoReserva.EnCurso;
                            _logger.LogInformation($"Reserva {reservaActiva.Id} marcada como EnCurso");
                        }
                    }
                    else
                    {
                        // No hay reserva activa: marcar como Disponible
                        if (cuarto.Estado != EstadoCuarto.Disponible)
                        {
                            cuarto.Estado = EstadoCuarto.Disponible;
                            _logger.LogInformation($"Cuarto {cuarto.Numero} marcado como Disponible");
                        }

                        // Completar reservas que ya pasaron
                        var reservasPasadas = cuarto.Reservas.Where(r =>
                            (r.Estado == EstadoReserva.Confirmada || r.Estado == EstadoReserva.EnCurso) &&
                            r.FechaSalida <= fechaActual);

                        foreach (var reservaPasada in reservasPasadas)
                        {
                            reservaPasada.Estado = EstadoReserva.Completada;
                            _logger.LogInformation($"Reserva {reservaPasada.Id} marcada como Completada");
                        }
                    }
                }
            }

            await context.SaveChangesAsync();
            _logger.LogInformation($"Estados de cuartos actualizados: {DateTime.Now}");
        }
    }
}