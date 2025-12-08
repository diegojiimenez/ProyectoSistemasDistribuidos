using HotelManagement.API.Models;

namespace HotelManagement.API.Repositories
{
    public interface ICuartoRepository
    {
        Task<IEnumerable<Cuarto>> GetAllAsync();
        Task<Cuarto> GetByIdAsync(int id);
        Task<IEnumerable<Cuarto>> GetDisponiblesAsync();
        Task<IEnumerable<Cuarto>> GetByTipoAsync(TipoCuarto tipo);
        Task<Cuarto> CreateAsync(Cuarto cuarto);
        Task<Cuarto> UpdateAsync(Cuarto cuarto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsNumeroAsync(string numero);
        Task<bool> EstaDisponibleAsync(int cuartoId, DateTime fechaEntrada, DateTime fechaSalida, int? reservaIdExcluir = null); 
    }
}