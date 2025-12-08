using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagement.API.Models
{
    public enum EstadoReserva
    {
        Confirmada = 0,    
        EnCurso = 1,       
        Completada = 2,    
        Cancelada = 3     
    }

    public class Reserva
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int HuespedId { get; set; }

        [ForeignKey("HuespedId")]
        public virtual Huesped Huesped { get; set; }

        [Required]
        public int CuartoId { get; set; }

        [ForeignKey("CuartoId")]
        public virtual Cuarto Cuarto { get; set; }

        [Required]
        public DateTime FechaEntrada { get; set; }

        [Required]
        public DateTime FechaSalida { get; set; }

        [Required]
        [Range(1, 10)]
        public int NumeroPersonas { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MontoTotal { get; set; }

        [Required]
        public EstadoReserva Estado { get; set; }

        [StringLength(500)]
        public string Observaciones { get; set; }

        public DateTime FechaCreacion { get; set; }

        public Reserva()
        {
            FechaCreacion = DateTime.Now;
            Estado = EstadoReserva.Confirmada; 
        }
    }
}