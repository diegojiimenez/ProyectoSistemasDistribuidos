using HotelManagement.API.Models;
using HotelManagement.API.DTOs;
using HotelManagement.API.Repositories;

namespace HotelManagement.API.Services
{
    public class ReservaService : IReservaService
    {
        private readonly IReservaRepository _reservaRepository;
        private readonly IHuespedRepository _huespedRepository;
        private readonly ICuartoRepository _cuartoRepository;

        public ReservaService(
            IReservaRepository reservaRepository,
            IHuespedRepository huespedRepository,
            ICuartoRepository cuartoRepository)
        {
            _reservaRepository = reservaRepository;
            _huespedRepository = huespedRepository;
            _cuartoRepository = cuartoRepository;
        }

        public async Task<ApiResponse<List<ReservaResponseDTO>>> GetAllReservasAsync()
        {
            try
            {
                var reservas = await _reservaRepository.GetAllAsync();
                var dtos = reservas.Select(r => MapToResponseDTO(r)).ToList();
                return ApiResponse<List<ReservaResponseDTO>>.Success(dtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<ReservaResponseDTO>>.Error(
                    "Error al obtener las reservas",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<ReservaResponseDTO>> GetReservaByIdAsync(int id)
        {
            try
            {
                var reserva = await _reservaRepository.GetByIdAsync(id);
                if (reserva == null)
                    return ApiResponse<ReservaResponseDTO>.Error("Reserva no encontrada");

                return ApiResponse<ReservaResponseDTO>.Success(MapToResponseDTO(reserva));
            }
            catch (Exception ex)
            {
                return ApiResponse<ReservaResponseDTO>.Error(
                    "Error al obtener la reserva",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<List<ReservaResponseDTO>>> GetReservasByHuespedAsync(int huespedId)
        {
            try
            {
                var reservas = await _reservaRepository.GetByHuespedAsync(huespedId);
                var dtos = reservas.Select(r => MapToResponseDTO(r)).ToList();
                return ApiResponse<List<ReservaResponseDTO>>.Success(dtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<ReservaResponseDTO>>.Error(
                    "Error al obtener las reservas del huésped",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<ReservaResponseDTO>> CreateReservaAsync(ReservaCreateDTO dto)
        {
            try
            {
                // Validar huésped
                if (!await _huespedRepository.ExistsAsync(dto.HuespedId))
                    return ApiResponse<ReservaResponseDTO>.Error("El huésped no existe");

                // Validar cuarto
                if (!await _cuartoRepository.ExistsAsync(dto.CuartoId))
                    return ApiResponse<ReservaResponseDTO>.Error("El cuarto no existe");

                // Validar fechas
                if (dto.FechaEntrada >= dto.FechaSalida)
                    return ApiResponse<ReservaResponseDTO>.Error("La fecha de salida debe ser posterior a la fecha de entrada");

                if (dto.FechaEntrada < DateTime.Today)
                    return ApiResponse<ReservaResponseDTO>.Error("La fecha de entrada no puede ser anterior a hoy");

                // Validar disponibilidad
                if (!await _cuartoRepository.EstaDisponibleAsync(dto.CuartoId, dto.FechaEntrada, dto.FechaSalida))
                    return ApiResponse<ReservaResponseDTO>.Error("El cuarto no está disponible para las fechas seleccionadas");

                var cuarto = await _cuartoRepository.GetByIdAsync(dto.CuartoId);

                // Validar capacidad del cuarto según su tipo
                int capacidadMaxima = cuarto.CapacidadPersonas;
                if (dto.NumeroPersonas > capacidadMaxima)
                    return ApiResponse<ReservaResponseDTO>.Error(
                        $"El cuarto tipo {cuarto.Tipo} tiene capacidad máxima para {capacidadMaxima} persona(s). " +
                        $"No se pueden reservar {dto.NumeroPersonas} personas.");

                // Calcular monto
                var dias = (dto.FechaSalida - dto.FechaEntrada).Days;
                var montoTotal = dias * cuarto.PrecioPorNoche;

                // Determinar el estado inicial de la reserva
                var estadoReserva = EstadoReserva.Confirmada;
                if (dto.FechaEntrada <= DateTime.Today)
                {
                    estadoReserva = EstadoReserva.EnCurso; 
                }

                var reserva = new Reserva
                {
                    HuespedId = dto.HuespedId,
                    CuartoId = dto.CuartoId,
                    FechaEntrada = dto.FechaEntrada,
                    FechaSalida = dto.FechaSalida,
                    NumeroPersonas = dto.NumeroPersonas,
                    MontoTotal = montoTotal,
                    Estado = estadoReserva, 
                    Observaciones = dto.Observaciones,
                    FechaCreacion = DateTime.Now
                };

                var created = await _reservaRepository.CreateAsync(reserva);

                // Cambiar estado del cuarto a Ocupado SOLO si la reserva empieza hoy o antes
                if (dto.FechaEntrada <= DateTime.Today)
                {
                    cuarto.Estado = EstadoCuarto.Ocupado;
                    await _cuartoRepository.UpdateAsync(cuarto);
                }

                return ApiResponse<ReservaResponseDTO>.Success(
                    MapToResponseDTO(created),
                    "Reserva creada exitosamente"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<ReservaResponseDTO>.Error(
                    "Error al crear la reserva",
                    new List<string> { ex.Message }
                );
            }
        }
        public async Task<ApiResponse<ReservaResponseDTO>> UpdateReservaAsync(int id, ReservaUpdateDTO dto)
        {
            try
            {
                var reserva = await _reservaRepository.GetByIdAsync(id);
                if (reserva == null)
                    return ApiResponse<ReservaResponseDTO>.Error("Reserva no encontrada");

                if (reserva.Estado == EstadoReserva.Cancelada)
                    return ApiResponse<ReservaResponseDTO>.Error("No se puede modificar una reserva cancelada");

                if (reserva.Estado == EstadoReserva.Completada)
                    return ApiResponse<ReservaResponseDTO>.Error("No se puede modificar una reserva completada");

                // Usar las fechas actuales si no se proporcionan nuevas
                var nuevaFechaEntrada = dto.FechaEntrada ?? reserva.FechaEntrada;
                var nuevaFechaSalida = dto.FechaSalida ?? reserva.FechaSalida;

                // Validar fechas
                if (nuevaFechaEntrada >= nuevaFechaSalida)
                    return ApiResponse<ReservaResponseDTO>.Error("La fecha de salida debe ser posterior a la fecha de entrada");

                // Si cambian las fechas, validar disponibilidad EXCLUYENDO esta reserva
                if (dto.FechaEntrada.HasValue || dto.FechaSalida.HasValue)
                {
                    if (!await _cuartoRepository.EstaDisponibleAsync(
                        reserva.CuartoId,
                        nuevaFechaEntrada,
                        nuevaFechaSalida,
                        id))
                    {
                        return ApiResponse<ReservaResponseDTO>.Error("El cuarto no está disponible para las nuevas fechas seleccionadas");
                    }
                }

                var cuarto = await _cuartoRepository.GetByIdAsync(reserva.CuartoId);

                // Validar capacidad si se cambia el número de personas
                if (dto.NumeroPersonas.HasValue)
                {
                    if (dto.NumeroPersonas.Value > cuarto.CapacidadPersonas)
                        return ApiResponse<ReservaResponseDTO>.Error(
                            $"El cuarto tipo {cuarto.Tipo} tiene capacidad máxima para {cuarto.CapacidadPersonas} persona(s).");
                }

                // Actualizar solo campos proporcionados
                if (dto.FechaEntrada.HasValue)
                    reserva.FechaEntrada = dto.FechaEntrada.Value;

                if (dto.FechaSalida.HasValue)
                    reserva.FechaSalida = dto.FechaSalida.Value;

                if (dto.NumeroPersonas.HasValue)
                    reserva.NumeroPersonas = dto.NumeroPersonas.Value;

                if (!string.IsNullOrWhiteSpace(dto.Observaciones))
                    reserva.Observaciones = dto.Observaciones;

                var fechaActual = DateTime.Today;
                if (reserva.FechaEntrada <= fechaActual && reserva.FechaSalida > fechaActual)
                {
                    reserva.Estado = EstadoReserva.EnCurso;
                }
                else if (reserva.FechaSalida <= fechaActual)
                {
                    reserva.Estado = EstadoReserva.Completada;
                }
                else
                {
                    reserva.Estado = EstadoReserva.Confirmada;
                }

                // Permitir override manual del estado si se proporciona
                if (dto.Estado.HasValue)
                    reserva.Estado = dto.Estado.Value;

                // Recalcular monto si cambiaron las fechas
                if (dto.FechaEntrada.HasValue || dto.FechaSalida.HasValue)
                {
                    var dias = (reserva.FechaSalida - reserva.FechaEntrada).Days;
                    reserva.MontoTotal = dias * cuarto.PrecioPorNoche;
                }

                var updated = await _reservaRepository.UpdateAsync(reserva);

                if (reserva.Estado == EstadoReserva.EnCurso &&
                    cuarto.Estado != EstadoCuarto.Mantenimiento &&
                    cuarto.Estado != EstadoCuarto.Limpieza)
                {
                    cuarto.Estado = EstadoCuarto.Ocupado;
                    await _cuartoRepository.UpdateAsync(cuarto);
                }

                return ApiResponse<ReservaResponseDTO>.Success(
                    MapToResponseDTO(updated),
                    "Reserva actualizada exitosamente"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<ReservaResponseDTO>.Error(
                    "Error al actualizar la reserva",
                    new List<string> { ex.Message }
                );
            }
        }
        public async Task<ApiResponse<bool>> CancelarReservaAsync(int id)
        {
            try
            {
                var reserva = await _reservaRepository.GetByIdAsync(id);
                if (reserva == null)
                    return ApiResponse<bool>.Error("Reserva no encontrada");

                if (reserva.Estado == EstadoReserva.Cancelada)
                    return ApiResponse<bool>.Error("La reserva ya está cancelada");

                if (reserva.Estado == EstadoReserva.Completada)
                    return ApiResponse<bool>.Error("No se puede cancelar una reserva completada");

                reserva.Estado = EstadoReserva.Cancelada;
                await _reservaRepository.UpdateAsync(reserva);

                var cuarto = await _cuartoRepository.GetByIdAsync(reserva.CuartoId);

                // Verificar si hay otras reservas activas PARA HOY
                var fechaActual = DateTime.Today;
                var tieneReservasActivasHoy = cuarto.Reservas.Any(r =>
                    r.Id != id &&
                    (r.Estado == EstadoReserva.Confirmada || r.Estado == EstadoReserva.EnCurso) &&
                    r.FechaEntrada <= fechaActual &&
                    r.FechaSalida > fechaActual);

                if (!tieneReservasActivasHoy &&
                    cuarto.Estado != EstadoCuarto.Mantenimiento &&
                    cuarto.Estado != EstadoCuarto.Limpieza)
                {
                    cuarto.Estado = EstadoCuarto.Disponible;
                    await _cuartoRepository.UpdateAsync(cuarto);
                }

                return ApiResponse<bool>.Success(true, "Reserva cancelada exitosamente");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.Error(
                    "Error al cancelar la reserva",
                    new List<string> { ex.Message }
                );
            }
        }
        public async Task<ApiResponse<bool>> DeleteReservaAsync(int id)
        {
            try
            {
                var reserva = await _reservaRepository.GetByIdAsync(id);
                if (reserva == null)
                    return ApiResponse<bool>.Error("Reserva no encontrada");

                var deleted = await _reservaRepository.DeleteAsync(id);
                return ApiResponse<bool>.Success(deleted, "Reserva eliminada exitosamente");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.Error(
                    "Error al eliminar la reserva",
                    new List<string> { ex.Message }
                );
            }
        }

        private ReservaResponseDTO MapToResponseDTO(Reserva reserva)
        {
            return new ReservaResponseDTO
            {
                Id = reserva.Id,
                HuespedId = reserva.HuespedId,
                HuespedNombre = $"{reserva.Huesped?.Nombre} {reserva.Huesped?.Apellido}".Trim(),
                CuartoId = reserva.CuartoId,
                CuartoNumero = reserva.Cuarto?.Numero,
                FechaEntrada = reserva.FechaEntrada,
                FechaSalida = reserva.FechaSalida,
                NumeroPersonas = reserva.NumeroPersonas,
                PrecioTotal = reserva.MontoTotal, 
                Estado = reserva.Estado,
                Observaciones = reserva.Observaciones,
                FechaCreacion = reserva.FechaCreacion
            };
        }
    }
}