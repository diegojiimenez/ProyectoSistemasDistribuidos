using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Data;
using HotelManagement.API.Models;

namespace HotelManagement.API.Repositories
{
    // ============ Interfaces ============

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
        Task<bool> EstaDisponibleAsync(int cuartoId, DateTime fechaEntrada, DateTime fechaSalida);
    }

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

    // ============ Implementaciones ============

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

    public class CuartoRepository : ICuartoRepository
    {
        private readonly HotelDbContext _context;

        public CuartoRepository(HotelDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cuarto>> GetAllAsync()
        {
            return await _context.Cuartos
                .OrderBy(c => c.Numero)
                .ToListAsync();
        }

        public async Task<Cuarto> GetByIdAsync(int id)
        {
            return await _context.Cuartos
                .Include(c => c.Reservas)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Cuarto>> GetDisponiblesAsync()
        {
            return await _context.Cuartos
                .Where(c => c.Estado == EstadoCuarto.Disponible)
                .OrderBy(c => c.Numero)
                .ToListAsync();
        }

        public async Task<IEnumerable<Cuarto>> GetByTipoAsync(TipoCuarto tipo)
        {
            return await _context.Cuartos
                .Where(c => c.Tipo == tipo)
                .OrderBy(c => c.Numero)
                .ToListAsync();
        }

        public async Task<Cuarto> CreateAsync(Cuarto cuarto)
        {
            _context.Cuartos.Add(cuarto);
            await _context.SaveChangesAsync();
            return cuarto;
        }

        public async Task<Cuarto> UpdateAsync(Cuarto cuarto)
        {
            _context.Entry(cuarto).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return cuarto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var cuarto = await _context.Cuartos.FindAsync(id);
            if (cuarto == null) return false;

            _context.Cuartos.Remove(cuarto);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Cuartos.AnyAsync(c => c.Id == id);
        }

        public async Task<bool> ExistsNumeroAsync(string numero)
        {
            return await _context.Cuartos.AnyAsync(c => c.Numero == numero);
        }

        public async Task<bool> EstaDisponibleAsync(int cuartoId, DateTime fechaEntrada, DateTime fechaSalida)
        {
            var cuarto = await _context.Cuartos.FindAsync(cuartoId);
            if (cuarto == null || cuarto.Estado != EstadoCuarto.Disponible)
                return false;

            var reservasConflictivas = await _context.Reservas
                .Where(r => r.CuartoId == cuartoId &&
                           r.Estado != EstadoReserva.Cancelada &&
                           r.Estado != EstadoReserva.Completada &&
                           ((fechaEntrada >= r.FechaEntrada && fechaEntrada < r.FechaSalida) ||
                            (fechaSalida > r.FechaEntrada && fechaSalida <= r.FechaSalida) ||
                            (fechaEntrada <= r.FechaEntrada && fechaSalida >= r.FechaSalida)))
                .AnyAsync();

            return !reservasConflictivas;
        }
    }

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