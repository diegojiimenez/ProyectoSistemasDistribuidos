using HotelManagement.API.DTOs;

namespace HotelManagement.API.Services
{
    public interface IAuthService
    {
        Task<LoginResponse?> Login(LoginRequest request);
        Task<bool> Registro(RegistroRequest request);
        string GenerateJwtToken(string nombreUsuario, string rol);
    }
}