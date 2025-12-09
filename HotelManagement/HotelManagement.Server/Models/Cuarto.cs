using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagement.API.Models
{
    public enum TipoCuarto
    {
        Individual = 0,
        Doble = 1,
        Suite = 2,
        Familiar = 3
    }

    public enum EstadoCuarto
    {
        Disponible = 0,
        Ocupado = 1,
        Mantenimiento = 2,
        Limpieza = 3
    }

    public class Cuarto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(10)]
        public string Numero { get; set; }

        [Required]
        public TipoCuarto Tipo { get; set; }

        [StringLength(500)]
        public string Descripcion { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioPorNoche { get; set; }

        [Required]
        public int CapacidadPersonas { get; set; } 
        [Required]
        public EstadoCuarto Estado { get; set; }

        // Relación con Reservas
        public virtual ICollection<Reserva> Reservas { get; set; }

        public Cuarto()
        {
            Reservas = new HashSet<Reserva>();
            Estado = EstadoCuarto.Disponible;
        }
    }
}