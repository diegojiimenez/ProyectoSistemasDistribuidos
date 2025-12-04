using System.ComponentModel.DataAnnotations;

namespace HotelManagement.API.Models
{
    /// <summary>
    /// Representa un cuarto/habitación del hotel
    /// </summary>
    public class Cuarto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(10)]
        public string Numero { get; set; }

        [Required]
        public TipoCuarto Tipo { get; set; }

        [Required]
        [Range(1, 10)]
        public int CapacidadPersonas { get; set; }

        [Required]
        [Range(0, 100000)]
        public decimal PrecioPorNoche { get; set; }

        [Required]
        public EstadoCuarto Estado { get; set; }

        [StringLength(500)]
        public string Descripcion { get; set; }

        // Relación con Reservas
        public virtual ICollection<Reserva> Reservas { get; set; }

        public Cuarto()
        {
            Estado = EstadoCuarto.Disponible;
            Reservas = new List<Reserva>();
        }
    }

    /// <summary>
    /// Tipos de cuarto disponibles
    /// </summary>
    public enum TipoCuarto
    {
        Individual = 1,
        Doble = 2,
        Suite = 3,
        Familiar = 4,
        Presidencial = 5
    }

    /// <summary>
    /// Estados posibles de un cuarto
    /// </summary>
    public enum EstadoCuarto
    {
        Disponible = 1,
        Ocupado = 2,
        Mantenimiento = 3,
        Limpieza = 4
    }
}