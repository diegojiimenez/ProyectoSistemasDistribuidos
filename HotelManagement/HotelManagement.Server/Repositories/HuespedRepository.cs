using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Data;
using HotelManagement.API.Models;

namespace HotelManagement.API.Repositories
{
    public class HuespedRepository : IHuespedRepository
    {
        private readonly HotelDbContext _context;

        public HuespedRepository(HotelDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Huesped>> GetAllAsync()
        {
            return await _context.Huespedes
                .Include(h => h.Reservas)
                .OrderByDescending(h => h.FechaRegistro)
                .ToListAsync();
        }

        public async Task<Huesped> GetByIdAsync(int id)
        {
            return await _context.Huespedes
                .Include(h => h.Reservas)
                .FirstOrDefaultAsync(h => h.Id == id);
        }

        public async Task<Huesped> GetByDocumentoAsync(string documento)
        {
            return await _context.Huespedes
                .FirstOrDefaultAsync(h => h.DocumentoIdentidad == documento);
        }

        public async Task<Huesped> CreateAsync(Huesped huesped)
        {
            _context.Huespedes.Add(huesped);
            await _context.SaveChangesAsync();
            return huesped;
        }

        public async Task<Huesped> UpdateAsync(Huesped huesped)
        {
            _context.Entry(huesped).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return huesped;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var huesped = await _context.Huespedes.FindAsync(id);
            if (huesped == null) return false;

            _context.Huespedes.Remove(huesped);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Huespedes.AnyAsync(h => h.Id == id);
        }

        public async Task<bool> ExistsEmailAsync(string email)
        {
            return await _context.Huespedes.AnyAsync(h => h.Email == email);
        }

        public async Task<bool> ExistsDocumentoAsync(string documento)
        {
            return await _context.Huespedes.AnyAsync(h => h.DocumentoIdentidad == documento);
        }
    }
}