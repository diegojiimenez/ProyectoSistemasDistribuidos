using System.ComponentModel.DataAnnotations;
using HotelManagement.API.Models;

namespace HotelManagement.API.DTOs
{
    // ============ DTOs para Huésped ============
    
    public class HuespedCreateDTO
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(100)]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "El apellido es obligatorio")]
        [StringLength(100)]
        public string Apellido { get; set; }

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "Email no válido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "El teléfono es obligatorio")]
        [Phone(ErrorMessage = "Teléfono no válido")]
        public string Telefono { get; set; }

        [Required(ErrorMessage = "El documento de identidad es obligatorio")]
        public string DocumentoIdentidad { get; set; }

        public string Direccion { get; set; }
    }

    public class HuespedUpdateDTO
    {
        [StringLength(100)]
        public string Nombre { get; set; }

        [StringLength(100)]
        public string Apellido { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Telefono { get; set; }

        public string Direccion { get; set; }
    }

    public class HuespedResponseDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string NombreCompleto => $"{Nombre} {Apellido}";
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string DocumentoIdentidad { get; set; }
        public string Direccion { get; set; }
        public DateTime FechaRegistro { get; set; }
        public int NumeroReservas { get; set; }
    }

    // ============ DTOs para Cuarto ============

    public class CuartoCreateDTO
    {
        [Required(ErrorMessage = "El número de cuarto es obligatorio")]
        public string Numero { get; set; }

        [Required(ErrorMessage = "El tipo de cuarto es obligatorio")]
        public TipoCuarto Tipo { get; set; }

        [Required]
        [Range(1, 10, ErrorMessage = "La capacidad debe estar entre 1 y 10 personas")]
        public int CapacidadPersonas { get; set; }

        [Required]
        [Range(0.01, 100000, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal PrecioPorNoche { get; set; }

        public string Descripcion { get; set; }
    }

    public class CuartoUpdateDTO
    {
        public TipoCuarto? Tipo { get; set; }
        
        [Range(1, 10)]
        public int? CapacidadPersonas { get; set; }
        
        [Range(0.01, 100000)]
        public decimal? PrecioPorNoche { get; set; }
        
        public EstadoCuarto? Estado { get; set; }
        
        public string Descripcion { get; set; }
    }

    public class CuartoResponseDTO
    {
        public int Id { get; set; }
        public string Numero { get; set; }
        public string Tipo { get; set; }
        public int CapacidadPersonas { get; set; }
        public decimal PrecioPorNoche { get; set; }
        public string Estado { get; set; }
        public string Descripcion { get; set; }
        public bool EstaDisponible => Estado == "Disponible";
    }

    // ============ DTOs para Reserva ============

    public class ReservaCreateDTO
    {
        [Required(ErrorMessage = "El ID del huésped es obligatorio")]
        public int HuespedId { get; set; }

        [Required(ErrorMessage = "El ID del cuarto es obligatorio")]
        public int CuartoId { get; set; }

        [Required(ErrorMessage = "La fecha de entrada es obligatoria")]
        public DateTime FechaEntrada { get; set; }

        [Required(ErrorMessage = "La fecha de salida es obligatoria")]
        public DateTime FechaSalida { get; set; }

        [Required]
        [Range(1, 20, ErrorMessage = "El número de personas debe estar entre 1 y 20")]
        public int NumeroPersonas { get; set; }

        public string Observaciones { get; set; }
    }

    public class ReservaUpdateDTO
    {
        public DateTime? FechaEntrada { get; set; }
        public DateTime? FechaSalida { get; set; }
        
        [Range(1, 20)]
        public int? NumeroPersonas { get; set; }
        
        public EstadoReserva? Estado { get; set; }
        public string Observaciones { get; set; }
    }

    public class ReservaResponseDTO
    {
        public int Id { get; set; }
        public int HuespedId { get; set; }
        public string NombreHuesped { get; set; }
        public int CuartoId { get; set; }
        public string NumeroCuarto { get; set; }
        public string TipoCuarto { get; set; }
        public DateTime FechaEntrada { get; set; }
        public DateTime FechaSalida { get; set; }
        public int NumeroNoches { get; set; }
        public int NumeroPersonas { get; set; }
        public string Estado { get; set; }
        public decimal MontoTotal { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string Observaciones { get; set; }
    }

    // ============ DTO de Respuesta Genérica ============

    public class ApiResponse<T>
    {
        public bool Exito { get; set; }
        public string Mensaje { get; set; }
        public T Datos { get; set; }
        public List<string> Errores { get; set; }

        public ApiResponse()
        {
            Errores = new List<string>();
        }

        public static ApiResponse<T> Success(T datos, string mensaje = "Operación exitosa")
        {
            return new ApiResponse<T>
            {
                Exito = true,
                Mensaje = mensaje,
                Datos = datos
            };
        }

        public static ApiResponse<T> Error(string mensaje, List<string> errores = null)
        {
            return new ApiResponse<T>
            {
                Exito = false,
                Mensaje = mensaje,
                Errores = errores ?? new List<string>()
            };
        }
    }
}