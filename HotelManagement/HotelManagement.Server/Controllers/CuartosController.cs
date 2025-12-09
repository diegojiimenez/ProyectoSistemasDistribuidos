using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HotelManagement.API.Services;
using HotelManagement.API.DTOs;

namespace HotelManagement.API.Controllers
{
    /// <summary>
    /// Controlador para gestionar cuartos/habitaciones
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CuartosController : ControllerBase
    {
        private readonly ICuartoService _service;

        public CuartosController(ICuartoService service)
        {
            _service = service;
        }

        /// <summary>
        /// Obtiene todos los cuartos
        /// </summary>
        /// <returns>Lista de cuartos</returns>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<CuartoResponseDTO>>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAll()
        {
            var response = await _service.GetAllCuartosAsync();
            return Ok(response);
        }

        /// <summary>
        /// Obtiene solo los cuartos disponibles
        /// </summary>
        /// <returns>Lista de cuartos disponibles</returns>
        [HttpGet("disponibles")]
        [ProducesResponseType(typeof(ApiResponse<List<CuartoResponseDTO>>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetDisponibles()
        {
            var response = await _service.GetCuartosDisponiblesAsync();
            return Ok(response);
        }

        /// <summary>
        /// Obtiene un cuarto por ID
        /// </summary>
        /// <param name="id">ID del cuarto</param>
        /// <returns>Datos del cuarto</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<CuartoResponseDTO>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _service.GetCuartoByIdAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }

        /// <summary>
        /// Crea un nuevo cuarto (Solo Administradores)
        /// </summary>
        /// <param name="dto">Datos del cuarto a crear</param>
        /// <returns>Cuarto creado</returns>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(ApiResponse<CuartoResponseDTO>), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> Create([FromBody] CuartoCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _service.CreateCuartoAsync(dto);
            
            if (!response.Exito)
                return BadRequest(response);

            return CreatedAtAction(nameof(GetById), new { id = response.Datos.Id }, response);
        }

        /// <summary>
        /// Actualiza un cuarto existente (Solo Administradores)
        /// </summary>
        /// <param name="id">ID del cuarto</param>
        /// <param name="dto">Datos a actualizar</param>
        /// <returns>Cuarto actualizado</returns>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(ApiResponse<CuartoResponseDTO>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> Update(int id, [FromBody] CuartoUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _service.UpdateCuartoAsync(id, dto);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }

        /// <summary>
        /// Elimina un cuarto (Solo Administradores)
        /// </summary>
        /// <param name="id">ID del cuarto</param>
        /// <returns>Resultado de la operación</returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _service.DeleteCuartoAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }
    }
}