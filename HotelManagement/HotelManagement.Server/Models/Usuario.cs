namespace HotelManagement.API.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Rol { get; set; } = "Usuario"; // "Admin" o "Usuario"
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}