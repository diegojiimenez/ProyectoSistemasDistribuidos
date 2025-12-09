using HotelManagement.API.Models;

namespace HotelManagement.API.Repositories
{
    public interface IReservaRepository
    {
        Task<IEnumerable<Reserva>> GetAllAsync();
        Task<Reserva> GetByIdAsync(int id);
        Task<IEnumerable<Reserva>> GetByHuespedAsync(int huespedId);
        Task<IEnumerable<Reserva>> GetByCuartoAsync(int cuartoId);
        Task<IEnumerable<Reserva>> GetByFechasAsync(DateTime fechaInicio, DateTime fechaFin);
        Task<Reserva> CreateAsync(Reserva reserva);
        Task<Reserva> UpdateAsync(Reserva reserva);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}