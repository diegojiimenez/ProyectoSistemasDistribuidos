using HotelManagement.API.DTOs;

namespace HotelManagement.API.Services
{
    public interface IHuespedService
    {
        Task<ApiResponse<List<HuespedResponseDTO>>> GetAllHuespedesAsync();
        Task<ApiResponse<HuespedResponseDTO>> GetHuespedByIdAsync(int id);
        Task<ApiResponse<HuespedResponseDTO>> CreateHuespedAsync(HuespedCreateDTO dto);
        Task<ApiResponse<HuespedResponseDTO>> UpdateHuespedAsync(int id, HuespedUpdateDTO dto);
        Task<ApiResponse<bool>> DeleteHuespedAsync(int id);
    }
}