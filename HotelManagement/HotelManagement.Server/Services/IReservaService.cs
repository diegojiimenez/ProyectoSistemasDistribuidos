using HotelManagement.API.DTOs;

namespace HotelManagement.API.Services
{
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
}