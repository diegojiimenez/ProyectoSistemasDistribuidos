using System.ComponentModel.DataAnnotations;
using HotelManagement.API.Models;

namespace HotelManagement.API.DTOs
{
    // ============ DTOs para Huésped ============

    public class HuespedCreateDTO
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "El apellido es obligatorio")]
        [StringLength(100, ErrorMessage = "El apellido no puede exceder los 100 caracteres")]
        public string Apellido { get; set; }

        [Required(ErrorMessage = "El correo electrónico es obligatorio")]
        [EmailAddress(ErrorMessage = "El formato del correo no es válido")]
        [StringLength(150, ErrorMessage = "El correo no puede exceder los 150 caracteres")]
        public string CorreoElectronico { get; set; }

        [Required(ErrorMessage = "El teléfono es obligatorio")]
        [Phone(ErrorMessage = "El formato del teléfono no es válido")]
        [StringLength(20, ErrorMessage = "El teléfono no puede exceder los 20 caracteres")]
        public string Telefono { get; set; }

        [Required(ErrorMessage = "El documento de identidad es obligatorio")]
        [StringLength(20, ErrorMessage = "El documento no puede exceder los 20 caracteres")]
        public string DocumentoIdentidad { get; set; }

        [StringLength(200, ErrorMessage = "La dirección no puede exceder los 200 caracteres")]
        public string Direccion { get; set; }
    }

    public class HuespedUpdateDTO
    {
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres")]
        public string? Nombre { get; set; }

        [StringLength(100, ErrorMessage = "El apellido no puede exceder los 100 caracteres")]
        public string? Apellido { get; set; }

        [EmailAddress(ErrorMessage = "El formato del correo no es válido")]
        [StringLength(150, ErrorMessage = "El correo no puede exceder los 150 caracteres")]
        public string? CorreoElectronico { get; set; }

        [Phone(ErrorMessage = "El formato del teléfono no es válido")]
        [StringLength(20, ErrorMessage = "El teléfono no puede exceder los 20 caracteres")]
        public string? Telefono { get; set; }

        [StringLength(20, ErrorMessage = "El documento no puede exceder los 20 caracteres")]
        public string? DocumentoIdentidad { get; set; }

        [StringLength(200, ErrorMessage = "La dirección no puede exceder los 200 caracteres")]
        public string? Direccion { get; set; }
    }

    public class HuespedResponseDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string CorreoElectronico { get; set; }
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
        [StringLength(10, ErrorMessage = "El número no puede exceder los 10 caracteres")]
        public string Numero { get; set; }

        [Required(ErrorMessage = "El tipo de cuarto es obligatorio")]
        public TipoCuarto Tipo { get; set; }

        [StringLength(500, ErrorMessage = "La descripción no puede exceder los 500 caracteres")]
        public string Descripcion { get; set; }

        [Required(ErrorMessage = "El precio por noche es obligatorio")]
        [Range(0.01, 10000, ErrorMessage = "El precio debe estar entre 0.01 y 10000")]
        public decimal PrecioPorNoche { get; set; }

        [Required(ErrorMessage = "La capacidad es obligatoria")]
        [Range(1, 10, ErrorMessage = "La capacidad debe estar entre 1 y 10 personas")]
        public int Capacidad { get; set; }
    }

    public class CuartoUpdateDTO
    {
        [StringLength(10, ErrorMessage = "El número no puede exceder los 10 caracteres")]
        public string? Numero { get; set; }

        public TipoCuarto? Tipo { get; set; }

        [StringLength(500, ErrorMessage = "La descripción no puede exceder los 500 caracteres")]
        public string? Descripcion { get; set; }

        [Range(0.01, 10000, ErrorMessage = "El precio debe estar entre 0.01 y 10000")]
        public decimal? PrecioPorNoche { get; set; }

        [Range(1, 10, ErrorMessage = "La capacidad debe estar entre 1 y 10 personas")]
        public int? Capacidad { get; set; }

        public EstadoCuarto? Estado { get; set; }
    }

    public class CuartoResponseDTO
    {
        public int Id { get; set; }
        public string Numero { get; set; }
        public TipoCuarto Tipo { get; set; }
        public string Descripcion { get; set; }
        public decimal PrecioPorNoche { get; set; }
        public int Capacidad { get; set; }
        public EstadoCuarto Estado { get; set; }
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

        [Required(ErrorMessage = "El número de personas es obligatorio")]
        [Range(1, 10, ErrorMessage = "El número de personas debe estar entre 1 y 10")]
        public int NumeroPersonas { get; set; }

        [StringLength(500, ErrorMessage = "Las observaciones no pueden exceder los 500 caracteres")]
        public string Observaciones { get; set; }
    }

    public class ReservaUpdateDTO
    {
        public DateTime? FechaEntrada { get; set; }

        public DateTime? FechaSalida { get; set; }

        [Range(1, 10, ErrorMessage = "El número de personas debe estar entre 1 y 10")]
        public int? NumeroPersonas { get; set; }

        [StringLength(500, ErrorMessage = "Las observaciones no pueden exceder los 500 caracteres")]
        public string? Observaciones { get; set; }

        public EstadoReserva? Estado { get; set; }
    }

    public class ReservaResponseDTO
    {
        public int Id { get; set; }
        public int HuespedId { get; set; }
        public string HuespedNombre { get; set; }
        public int CuartoId { get; set; }
        public string CuartoNumero { get; set; }
        public DateTime FechaEntrada { get; set; }
        public DateTime FechaSalida { get; set; }
        public int NumeroPersonas { get; set; }
        public decimal PrecioTotal { get; set; }
        public EstadoReserva Estado { get; set; }
        public string Observaciones { get; set; }
        public DateTime FechaCreacion { get; set; }
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