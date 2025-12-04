using System.ComponentModel.DataAnnotations;

namespace HotelManagement.API.Models
{
    /// <summary>
    /// Representa un huésped del hotel
    /// </summary>
    public class Huesped
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; }

        [Required]
        [StringLength(100)]
        public string Apellido { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; }

        [Required]
        [Phone]
        [StringLength(20)]
        public string Telefono { get; set; }

        [Required]
        [StringLength(20)]
        public string DocumentoIdentidad { get; set; }

        [StringLength(200)]
        public string Direccion { get; set; }

        public DateTime FechaRegistro { get; set; }

        // Relación con Reservas
        public virtual ICollection<Reserva> Reservas { get; set; }

        public Huesped()
        {
            FechaRegistro = DateTime.Now;
            Reservas = new List<Reserva>();
        }
    }
}