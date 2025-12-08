using HotelManagement.API.Models;
using HotelManagement.API.DTOs;
using HotelManagement.API.Repositories;

namespace HotelManagement.API.Services
{
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

        public async Task<ApiResponse<List<CuartoResponseDTO>>> GetCuartosDisponiblesAsync()
        {
            try
            {
                var cuartos = await _repository.GetDisponiblesAsync();
                var dtos = cuartos.Select(c => MapToResponseDTO(c)).ToList();
                return ApiResponse<List<CuartoResponseDTO>>.Success(
                    dtos,
                    "Cuartos disponibles obtenidos exitosamente"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<List<CuartoResponseDTO>>.Error(
                    "Error al obtener cuartos disponibles",
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
                    Descripcion = dto.Descripcion,
                    PrecioPorNoche = dto.PrecioPorNoche,
                    CapacidadPersonas = dto.Capacidad, 
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

                if (!string.IsNullOrWhiteSpace(dto.Numero))
                    cuarto.Numero = dto.Numero;

                if (dto.Tipo.HasValue)
                    cuarto.Tipo = dto.Tipo.Value;

                if (!string.IsNullOrWhiteSpace(dto.Descripcion))
                    cuarto.Descripcion = dto.Descripcion;

                if (dto.PrecioPorNoche.HasValue)
                    cuarto.PrecioPorNoche = dto.PrecioPorNoche.Value;

                if (dto.Capacidad.HasValue)
                    cuarto.CapacidadPersonas = dto.Capacidad.Value;

                if (dto.Estado.HasValue)
                    cuarto.Estado = dto.Estado.Value;

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
                Tipo = cuarto.Tipo,
                Descripcion = cuarto.Descripcion,
                PrecioPorNoche = cuarto.PrecioPorNoche,
                Capacidad = cuarto.CapacidadPersonas, // ← CAMBIAR aquí
                Estado = cuarto.Estado
            };
        }
    }
}