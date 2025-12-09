using HotelManagement.API.DTOs;

namespace HotelManagement.API.Services
{
    public interface ICuartoService
    {
        Task<ApiResponse<List<CuartoResponseDTO>>> GetAllCuartosAsync();
        Task<ApiResponse<CuartoResponseDTO>> GetCuartoByIdAsync(int id);
        Task<ApiResponse<List<CuartoResponseDTO>>> GetCuartosDisponiblesAsync();
        Task<ApiResponse<CuartoResponseDTO>> CreateCuartoAsync(CuartoCreateDTO dto);
        Task<ApiResponse<CuartoResponseDTO>> UpdateCuartoAsync(int id, CuartoUpdateDTO dto);
        Task<ApiResponse<bool>> DeleteCuartoAsync(int id);
    }
}