using HotelManagement.API.Models;
using HotelManagement.API.DTOs;
using HotelManagement.API.Repositories;

namespace HotelManagement.API.Services
{
    // ============ Interfaces de Servicios ============

    public interface IHuespedService
    {
        Task<ApiResponse<List<HuespedResponseDTO>>> GetAllHuespedesAsync();
        Task<ApiResponse<HuespedResponseDTO>> GetHuespedByIdAsync(int id);
        Task<ApiResponse<HuespedResponseDTO>> CreateHuespedAsync(HuespedCreateDTO dto);
        Task<ApiResponse<HuespedResponseDTO>> UpdateHuespedAsync(int id, HuespedUpdateDTO dto);
        Task<ApiResponse<bool>> DeleteHuespedAsync(int id);
    }

    public interface ICuartoService
    {
        Task<ApiResponse<List<CuartoResponseDTO>>> GetAllCuartosAsync();
        Task<ApiResponse<List<CuartoResponseDTO>>> GetCuartosDisponiblesAsync();
        Task<ApiResponse<CuartoResponseDTO>> GetCuartoByIdAsync(int id);
        Task<ApiResponse<CuartoResponseDTO>> CreateCuartoAsync(CuartoCreateDTO dto);
        Task<ApiResponse<CuartoResponseDTO>> UpdateCuartoAsync(int id, CuartoUpdateDTO dto);
        Task<ApiResponse<bool>> DeleteCuartoAsync(int id);
    }

    public interface IReservaService
    {
        Task<ApiResponse<List<ReservaResponseDTO>>> GetAllReservasAsync();
        Task<ApiResponse<ReservaResponseDTO>> GetReservaByIdAsync(int id);
        Task<ApiResponse<List<ReservaResponseDTO>>> GetReservasByHuespedAsync(int huespedId);
        Task<ApiResponse<ReservaResponseDTO>> CreateReservaAsync(ReservaCreateDTO dto);
        Task<ApiResponse<ReservaResponseDTO>> UpdateReservaAsync(int id, ReservaUpdateDTO dto);
        Task<ApiResponse<bool>> CancelarReservaAsync(int id);
        Task<ApiResponse<bool>> DeleteReservaAsync(int id);
    }

    // ============ Implementación de Servicios ============

    public class HuespedService : IHuespedService
    {
        private readonly IHuespedRepository _repository;

        public HuespedService(IHuespedRepository repository)
        {
            _repository = repository;
        }

        public async Task<ApiResponse<List<HuespedResponseDTO>>> GetAllHuespedesAsync()
        {
            try
            {
                var huespedes = await _repository.GetAllAsync();
                var dtos = huespedes.Select(h => MapToResponseDTO(h)).ToList();
                return ApiResponse<List<HuespedResponseDTO>>.Success(dtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<HuespedResponseDTO>>.Error(
                    "Error al obtener los huéspedes",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<HuespedResponseDTO>> GetHuespedByIdAsync(int id)
        {
            try
            {
                var huesped = await _repository.GetByIdAsync(id);
                if (huesped == null)
                    return ApiResponse<HuespedResponseDTO>.Error("Huésped no encontrado");

                return ApiResponse<HuespedResponseDTO>.Success(MapToResponseDTO(huesped));
            }
            catch (Exception ex)
            {
                return ApiResponse<HuespedResponseDTO>.Error(
                    "Error al obtener el huésped",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<HuespedResponseDTO>> CreateHuespedAsync(HuespedCreateDTO dto)
        {
            try
            {
                // Validar que no exista el documento
                if (await _repository.ExistsDocumentoAsync(dto.DocumentoIdentidad))
                    return ApiResponse<HuespedResponseDTO>.Error("Ya existe un huésped con ese documento");

                // Validar que no exista el email
                if (await _repository.ExistsEmailAsync(dto.CorreoElectronico))
                    return ApiResponse<HuespedResponseDTO>.Error("Ya existe un huésped con ese email");

                var huesped = new Huesped
                {
                    Nombre = dto.Nombre,
                    Apellido = dto.Apellido,
                    Email = dto.CorreoElectronico,
                    Telefono = dto.Telefono,
                    DocumentoIdentidad = dto.DocumentoIdentidad,
                    Direccion = dto.Direccion,
                    FechaRegistro = DateTime.Now
                };

                var created = await _repository.CreateAsync(huesped);
                return ApiResponse<HuespedResponseDTO>.Success(
                    MapToResponseDTO(created),
                    "Huésped creado exitosamente"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<HuespedResponseDTO>.Error(
                    "Error al crear el huésped",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<HuespedResponseDTO>> UpdateHuespedAsync(int id, HuespedUpdateDTO dto)
        {
            try
            {
                var huesped = await _repository.GetByIdAsync(id);

                if (huesped == null)
                {
                    return ApiResponse<HuespedResponseDTO>.Error("Huésped no encontrado");
                }

                huesped.Nombre = dto.Nombre;
                huesped.Apellido = dto.Apellido;
                huesped.Email = dto.CorreoElectronico;
                huesped.Telefono = dto.Telefono;
                huesped.DocumentoIdentidad = dto.DocumentoIdentidad;
                huesped.Direccion = dto.Direccion;

                var updated = await _repository.UpdateAsync(huesped);

                return ApiResponse<HuespedResponseDTO>.Success(
                    MapToResponseDTO(updated),
                    "Huésped actualizado exitosamente"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<HuespedResponseDTO>.Error(
                    "Error al actualizar el huésped",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<bool>> DeleteHuespedAsync(int id)
        {
            try
            {
                var huesped = await _repository.GetByIdAsync(id);
                if (huesped == null)
                    return ApiResponse<bool>.Error("Huésped no encontrado");

                // Verificar que no tenga reservas activas
                if (huesped.Reservas.Any(r => r.Estado == EstadoReserva.Confirmada || r.Estado == EstadoReserva.EnCurso))
                    return ApiResponse<bool>.Error("No se puede eliminar un huésped con reservas activas");

                var deleted = await _repository.DeleteAsync(id);
                return ApiResponse<bool>.Success(deleted, "Huésped eliminado exitosamente");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.Error(
                    "Error al eliminar el huésped",
                    new List<string> { ex.Message }
                );
            }
        }

        private HuespedResponseDTO MapToResponseDTO(Huesped huesped)
        {
            return new HuespedResponseDTO
            {
                Id = huesped.Id,
                Nombre = huesped.Nombre,
                Apellido = huesped.Apellido,
                CorreoElectronico = huesped.Email, // También llenar CorreoElectronico
                Telefono = huesped.Telefono,
                DocumentoIdentidad = huesped.DocumentoIdentidad,
                Direccion = huesped.Direccion,
                FechaRegistro = huesped.FechaRegistro,
                NumeroReservas = huesped.Reservas?.Count ?? 0
            };
        }
    }

    public class CuartoService : ICuartoService
    {
        private readonly ICuartoRepository _repository;

        public CuartoService(ICuartoRepository repository)
        {
            _repository = repository;
        }

        public async Task<ApiResponse<List<CuartoResponseDTO>>> GetAllCuartosAsync()
        {
            try
            {
                var cuartos = await _repository.GetAllAsync();
                var dtos = cuartos.Select(c => MapToResponseDTO(c)).ToList();
                return ApiResponse<List<CuartoResponseDTO>>.Success(dtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<CuartoResponseDTO>>.Error(
                    "Error al obtener los cuartos",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<List<CuartoResponseDTO>>> GetCuartosDisponiblesAsync()
        {
            try
            {
                var cuartos = await _repository.GetDisponiblesAsync();
                var dtos = cuartos.Select(c => MapToResponseDTO(c)).ToList();
                return ApiResponse<List<CuartoResponseDTO>>.Success(dtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<CuartoResponseDTO>>.Error(
                    "Error al obtener los cuartos disponibles",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<CuartoResponseDTO>> GetCuartoByIdAsync(int id)
        {
            try
            {
                var cuarto = await _repository.GetByIdAsync(id);
                if (cuarto == null)
                    return ApiResponse<CuartoResponseDTO>.Error("Cuarto no encontrado");

                return ApiResponse<CuartoResponseDTO>.Success(MapToResponseDTO(cuarto));
            }
            catch (Exception ex)
            {
                return ApiResponse<CuartoResponseDTO>.Error(
                    "Error al obtener el cuarto",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<CuartoResponseDTO>> CreateCuartoAsync(CuartoCreateDTO dto)
        {
            try
            {
                if (await _repository.ExistsNumeroAsync(dto.Numero))
                    return ApiResponse<CuartoResponseDTO>.Error("Ya existe un cuarto con ese número");

                var cuarto = new Cuarto
                {
                    Numero = dto.Numero,
                    Tipo = dto.Tipo,
                    CapacidadPersonas = dto.CapacidadPersonas,
                    PrecioPorNoche = dto.PrecioPorNoche,
                    Descripcion = dto.Descripcion,
                    Estado = EstadoCuarto.Disponible
                };

                var created = await _repository.CreateAsync(cuarto);
                return ApiResponse<CuartoResponseDTO>.Success(
                    MapToResponseDTO(created),
                    "Cuarto creado exitosamente"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<CuartoResponseDTO>.Error(
                    "Error al crear el cuarto",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<CuartoResponseDTO>> UpdateCuartoAsync(int id, CuartoUpdateDTO dto)
        {
            try
            {
                var cuarto = await _repository.GetByIdAsync(id);
                if (cuarto == null)
                    return ApiResponse<CuartoResponseDTO>.Error("Cuarto no encontrado");

                if (dto.Tipo.HasValue)
                    cuarto.Tipo = dto.Tipo.Value;
                if (dto.CapacidadPersonas.HasValue)
                    cuarto.CapacidadPersonas = dto.CapacidadPersonas.Value;
                if (dto.PrecioPorNoche.HasValue)
                    cuarto.PrecioPorNoche = dto.PrecioPorNoche.Value;
                if (dto.Estado.HasValue)
                    cuarto.Estado = dto.Estado.Value;
                if (!string.IsNullOrWhiteSpace(dto.Descripcion))
                    cuarto.Descripcion = dto.Descripcion;

                var updated = await _repository.UpdateAsync(cuarto);
                return ApiResponse<CuartoResponseDTO>.Success(
                    MapToResponseDTO(updated),
                    "Cuarto actualizado exitosamente"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<CuartoResponseDTO>.Error(
                    "Error al actualizar el cuarto",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<bool>> DeleteCuartoAsync(int id)
        {
            try
            {
                var cuarto = await _repository.GetByIdAsync(id);
                if (cuarto == null)
                    return ApiResponse<bool>.Error("Cuarto no encontrado");

                if (cuarto.Reservas.Any(r => r.Estado == EstadoReserva.Confirmada || r.Estado == EstadoReserva.EnCurso))
                    return ApiResponse<bool>.Error("No se puede eliminar un cuarto con reservas activas");

                var deleted = await _repository.DeleteAsync(id);
                return ApiResponse<bool>.Success(deleted, "Cuarto eliminado exitosamente");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.Error(
                    "Error al eliminar el cuarto",
                    new List<string> { ex.Message }
                );
            }
        }

        private CuartoResponseDTO MapToResponseDTO(Cuarto cuarto)
        {
            return new CuartoResponseDTO
            {
                Id = cuarto.Id,
                Numero = cuarto.Numero,
                Tipo = cuarto.Tipo.ToString(),
                CapacidadPersonas = cuarto.CapacidadPersonas,
                PrecioPorNoche = cuarto.PrecioPorNoche,
                Estado = cuarto.Estado.ToString(),
                Descripcion = cuarto.Descripcion
            };
        }
    }

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
                // Validaciones
                var errores = new List<string>();

                if (dto.FechaSalida <= dto.FechaEntrada)
                    errores.Add("La fecha de salida debe ser posterior a la fecha de entrada");

                if (dto.FechaEntrada < DateTime.Now.Date)
                    errores.Add("La fecha de entrada no puede ser anterior a hoy");

                if (!await _huespedRepository.ExistsAsync(dto.HuespedId))
                    errores.Add("El huésped especificado no existe");

                if (!await _cuartoRepository.ExistsAsync(dto.CuartoId))
                    errores.Add("El cuarto especificado no existe");

                if (errores.Any())
                    return ApiResponse<ReservaResponseDTO>.Error("Errores de validación", errores);

                // Verificar disponibilidad
                var disponible = await _cuartoRepository.EstaDisponibleAsync(
                    dto.CuartoId,
                    dto.FechaEntrada,
                    dto.FechaSalida
                );

                if (!disponible)
                    return ApiResponse<ReservaResponseDTO>.Error("El cuarto no está disponible para las fechas seleccionadas");

                // Obtener el cuarto para calcular el monto
                var cuarto = await _cuartoRepository.GetByIdAsync(dto.CuartoId);

                // Verificar capacidad
                if (dto.NumeroPersonas > cuarto.CapacidadPersonas)
                    return ApiResponse<ReservaResponseDTO>.Error($"El cuarto solo tiene capacidad para {cuarto.CapacidadPersonas} personas");

                var reserva = new Reserva
                {
                    HuespedId = dto.HuespedId,
                    CuartoId = dto.CuartoId,
                    FechaEntrada = dto.FechaEntrada,
                    FechaSalida = dto.FechaSalida,
                    NumeroPersonas = dto.NumeroPersonas,
                    Estado = EstadoReserva.Pendiente,
                    Observaciones = dto.Observaciones
                };

                reserva.CalcularMontoTotal(cuarto.PrecioPorNoche);

                var created = await _reservaRepository.CreateAsync(reserva);
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

                if (reserva.Estado == EstadoReserva.Completada || reserva.Estado == EstadoReserva.Cancelada)
                    return ApiResponse<ReservaResponseDTO>.Error("No se puede modificar una reserva completada o cancelada");

                if (dto.FechaEntrada.HasValue)
                    reserva.FechaEntrada = dto.FechaEntrada.Value;
                if (dto.FechaSalida.HasValue)
                    reserva.FechaSalida = dto.FechaSalida.Value;
                if (dto.NumeroPersonas.HasValue)
                    reserva.NumeroPersonas = dto.NumeroPersonas.Value;
                if (dto.Estado.HasValue)
                    reserva.Estado = dto.Estado.Value;
                if (!string.IsNullOrWhiteSpace(dto.Observaciones))
                    reserva.Observaciones = dto.Observaciones;

                // Recalcular monto si cambiaron las fechas
                if (dto.FechaEntrada.HasValue || dto.FechaSalida.HasValue)
                    reserva.CalcularMontoTotal(reserva.Cuarto.PrecioPorNoche);

                var updated = await _reservaRepository.UpdateAsync(reserva);
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

                if (reserva.Estado == EstadoReserva.Completada)
                    return ApiResponse<bool>.Error("No se puede cancelar una reserva completada");

                if (reserva.Estado == EstadoReserva.Cancelada)
                    return ApiResponse<bool>.Error("La reserva ya está cancelada");

                reserva.Estado = EstadoReserva.Cancelada;
                await _reservaRepository.UpdateAsync(reserva);

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
                var deleted = await _reservaRepository.DeleteAsync(id);
                if (!deleted)
                    return ApiResponse<bool>.Error("Reserva no encontrada");

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
                NombreHuesped = $"{reserva.Huesped?.Nombre} {reserva.Huesped?.Apellido}",
                CuartoId = reserva.CuartoId,
                NumeroCuarto = reserva.Cuarto?.Numero,
                TipoCuarto = reserva.Cuarto?.Tipo.ToString(),
                FechaEntrada = reserva.FechaEntrada,
                FechaSalida = reserva.FechaSalida,
                NumeroNoches = reserva.ObtenerNumeroNoches(),
                NumeroPersonas = reserva.NumeroPersonas,
                Estado = reserva.Estado.ToString(),
                MontoTotal = reserva.MontoTotal,
                FechaCreacion = reserva.FechaCreacion,
                Observaciones = reserva.Observaciones
            };
        }
    }
}