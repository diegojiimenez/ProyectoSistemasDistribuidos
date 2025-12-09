using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Data;
using HotelManagement.API.Models;

namespace HotelManagement.API.Repositories
{
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

        public async Task<bool> EstaDisponibleAsync(int cuartoId, DateTime fechaEntrada, DateTime fechaSalida, int? reservaIdExcluir = null)
        {
            var cuarto = await _context.Cuartos.FindAsync(cuartoId);
            if (cuarto == null)
                return false;

            var query = _context.Reservas
                .Where(r => r.CuartoId == cuartoId &&
                           r.Estado != EstadoReserva.Cancelada &&
                           r.Estado != EstadoReserva.Completada &&
                           ((fechaEntrada >= r.FechaEntrada && fechaEntrada < r.FechaSalida) ||
                            (fechaSalida > r.FechaEntrada && fechaSalida <= r.FechaSalida) ||
                            (fechaEntrada <= r.FechaEntrada && fechaSalida >= r.FechaSalida)));

            if (reservaIdExcluir.HasValue)
            {
                query = query.Where(r => r.Id != reservaIdExcluir.Value);
            }

            var reservasConflictivas = await query.AnyAsync();

            return !reservasConflictivas;
        }
    }
}