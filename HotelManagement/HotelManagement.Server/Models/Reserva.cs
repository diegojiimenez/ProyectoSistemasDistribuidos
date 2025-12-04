using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagement.API.Models
{
    /// <summary>
    /// Representa una reserva de hotel
    /// </summary>
    public class Reserva
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int HuespedId { get; set; }

        [Required]
        public int CuartoId { get; set; }

        [Required]
        public DateTime FechaEntrada { get; set; }

        [Required]
        public DateTime FechaSalida { get; set; }

        [Required]
        [Range(1, 20)]
        public int NumeroPersonas { get; set; }

        [Required]
        public EstadoReserva Estado { get; set; }

        [Required]
        [Range(0, 1000000)]
        public decimal MontoTotal { get; set; }

        public DateTime FechaCreacion { get; set; }

        [StringLength(500)]
        public string Observaciones { get; set; }

        // Relaciones
        [ForeignKey("HuespedId")]
        public virtual Huesped Huesped { get; set; }

        [ForeignKey("CuartoId")]
        public virtual Cuarto Cuarto { get; set; }

        public Reserva()
        {
            FechaCreacion = DateTime.Now;
            Estado = EstadoReserva.Pendiente;
        }

        /// <summary>
        /// Calcula el número de noches de la reserva
        /// </summary>
        public int ObtenerNumeroNoches()
        {
            return (FechaSalida - FechaEntrada).Days;
        }

        /// <summary>
        /// Calcula el monto total basado en el precio del cuarto
        /// </summary>
        public void CalcularMontoTotal(decimal precioPorNoche)
        {
            MontoTotal = ObtenerNumeroNoches() * precioPorNoche;
        }
    }

    /// <summary>
    /// Estados posibles de una reserva
    /// </summary>
    public enum EstadoReserva
    {
        Pendiente = 1,
        Confirmada = 2,
        EnCurso = 3,
        Completada = 4,
        Cancelada = 5
    }
}