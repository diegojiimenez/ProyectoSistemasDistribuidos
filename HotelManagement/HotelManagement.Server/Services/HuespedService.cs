using HotelManagement.API.Models;
using HotelManagement.API.DTOs;
using HotelManagement.API.Repositories;

namespace HotelManagement.API.Services
{
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
                if (await _repository.ExistsDocumentoAsync(dto.DocumentoIdentidad))
                    return ApiResponse<HuespedResponseDTO>.Error("Ya existe un huésped con ese documento");

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
                    return ApiResponse<HuespedResponseDTO>.Error("Huésped no encontrado");

                if (!string.IsNullOrWhiteSpace(dto.Nombre))
                    huesped.Nombre = dto.Nombre;

                if (!string.IsNullOrWhiteSpace(dto.Apellido))
                    huesped.Apellido = dto.Apellido;

                if (!string.IsNullOrWhiteSpace(dto.CorreoElectronico))
                    huesped.Email = dto.CorreoElectronico;

                if (!string.IsNullOrWhiteSpace(dto.Telefono))
                    huesped.Telefono = dto.Telefono;

                if (!string.IsNullOrWhiteSpace(dto.DocumentoIdentidad))
                    huesped.DocumentoIdentidad = dto.DocumentoIdentidad;

                if (!string.IsNullOrWhiteSpace(dto.Direccion))
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
                CorreoElectronico = huesped.Email,
                Telefono = huesped.Telefono,
                DocumentoIdentidad = huesped.DocumentoIdentidad,
                Direccion = huesped.Direccion,
                FechaRegistro = huesped.FechaRegistro,
                NumeroReservas = huesped.Reservas?.Count ?? 0
            };
        }
    }
}