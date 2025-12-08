using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Data;
using HotelManagement.API.Models;

namespace HotelManagement.API.Repositories
{
    public class ReservaRepository : IReservaRepository
    {
        private readonly HotelDbContext _context;

        public ReservaRepository(HotelDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Reserva>> GetAllAsync()
        {
            return await _context.Reservas
                .Include(r => r.Huesped)
                .Include(r => r.Cuarto)
                .OrderByDescending(r => r.FechaCreacion)
                .ToListAsync();
        }

        public async Task<Reserva> GetByIdAsync(int id)
        {
            return await _context.Reservas
                .Include(r => r.Huesped)
                .Include(r => r.Cuarto)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Reserva>> GetByHuespedAsync(int huespedId)
        {
            return await _context.Reservas
                .Include(r => r.Cuarto)
                .Where(r => r.HuespedId == huespedId)
                .OrderByDescending(r => r.FechaCreacion)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reserva>> GetByCuartoAsync(int cuartoId)
        {
            return await _context.Reservas
                .Include(r => r.Huesped)
                .Where(r => r.CuartoId == cuartoId)
                .OrderByDescending(r => r.FechaEntrada)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reserva>> GetByFechasAsync(DateTime fechaInicio, DateTime fechaFin)
        {
            return await _context.Reservas
                .Include(r => r.Huesped)
                .Include(r => r.Cuarto)
                .Where(r => r.FechaEntrada >= fechaInicio && r.FechaSalida <= fechaFin)
                .OrderBy(r => r.FechaEntrada)
                .ToListAsync();
        }

        public async Task<Reserva> CreateAsync(Reserva reserva)
        {
            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();
            return await GetByIdAsync(reserva.Id);
        }

        public async Task<Reserva> UpdateAsync(Reserva reserva)
        {
            _context.Entry(reserva).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return await GetByIdAsync(reserva.Id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null) return false;

            _context.Reservas.Remove(reserva);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Reservas.AnyAsync(r => r.Id == id);
        }
    }
}