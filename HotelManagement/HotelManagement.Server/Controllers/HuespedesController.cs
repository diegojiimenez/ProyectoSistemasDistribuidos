using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HotelManagement.API.Services;
using HotelManagement.API.DTOs;

namespace HotelManagement.API.Controllers
{
    /// <summary>
    /// Controlador para gestionar huéspedes
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HuespedesController : ControllerBase
    {
        private readonly IHuespedService _service;

        public HuespedesController(IHuespedService service)
        {
            _service = service;
        }

        /// <summary>
        /// Obtiene todos los huéspedes
        /// </summary>
        /// <returns>Lista de huéspedes</returns>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<HuespedResponseDTO>>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAll()
        {
            var response = await _service.GetAllHuespedesAsync();
            return Ok(response);
        }

        /// <summary>
        /// Obtiene un huésped por ID
        /// </summary>
        /// <param name="id">ID del huésped</param>
        /// <returns>Datos del huésped</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<HuespedResponseDTO>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _service.GetHuespedByIdAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }

        /// <summary>
        /// Crea un nuevo huésped (Solo Administradores)
        /// </summary>
        /// <param name="dto">Datos del huésped a crear</param>
        /// <returns>Huésped creado</returns>
        [HttpPost]
        [Authorize(Roles = "Admin,Administrador")]
        [ProducesResponseType(typeof(ApiResponse<HuespedResponseDTO>), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> Create([FromBody] HuespedCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _service.CreateHuespedAsync(dto);
            
            if (!response.Exito)
                return BadRequest(response);

            return CreatedAtAction(nameof(GetById), new { id = response.Datos.Id }, response);
        }

        /// <summary>
        /// Actualiza un huésped existente (Solo Administradores)
        /// </summary>
        /// <param name="id">ID del huésped</param>
        /// <param name="dto">Datos a actualizar</param>
        /// <returns>Huésped actualizado</returns>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Administrador")]
        [ProducesResponseType(typeof(ApiResponse<HuespedResponseDTO>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> Update(int id, [FromBody] HuespedUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _service.UpdateHuespedAsync(id, dto);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }

        /// <summary>
        /// Elimina un huésped (Solo Administradores)
        /// </summary>
        /// <param name="id">ID del huésped</param>
        /// <returns>Resultado de la operación</returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Administrador")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _service.DeleteHuespedAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }
    }
}