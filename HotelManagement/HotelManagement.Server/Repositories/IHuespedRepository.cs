using HotelManagement.API.Models;

namespace HotelManagement.API.Repositories
{
    public interface IHuespedRepository
    {
        Task<IEnumerable<Huesped>> GetAllAsync();
        Task<Huesped> GetByIdAsync(int id);
        Task<Huesped> GetByDocumentoAsync(string documento);
        Task<Huesped> CreateAsync(Huesped huesped);
        Task<Huesped> UpdateAsync(Huesped huesped);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsEmailAsync(string email);
        Task<bool> ExistsDocumentoAsync(string documento);
    }
}