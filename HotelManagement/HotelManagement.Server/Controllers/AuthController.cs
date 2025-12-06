using Microsoft.AspNetCore.Mvc;
using HotelManagement.API.DTOs;
using HotelManagement.API.Services;

namespace HotelManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.Login(request);
            
            if (response == null)
                return Unauthorized(new { message = "Usuario o contraseña incorrectos" });

            return Ok(response);
        }

        [HttpPost("registro")]
        public async Task<ActionResult> Registro([FromBody] RegistroRequest request)
        {
            var resultado = await _authService.Registro(request);
            
            if (!resultado)
                return BadRequest(new { message = "El usuario ya existe" });

            return Ok(new { message = "Usuario registrado exitosamente" });
        }
    }
}