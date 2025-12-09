using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HotelManagement.API.Services;
using HotelManagement.API.DTOs;

namespace HotelManagement.API.Controllers
{
    /// <summary>
    /// Controlador para gestionar reservas
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservasController : ControllerBase
    {
        private readonly IReservaService _service;

        public ReservasController(IReservaService service)
        {
            _service = service;
        }

        /// <summary>
        /// Obtiene todas las reservas (Solo Administradores)
        /// </summary>
        /// <returns>Lista de reservas</returns>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(ApiResponse<List<ReservaResponseDTO>>), 200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> GetAll()
        {
            var response = await _service.GetAllReservasAsync();
            return Ok(response);
        }

        /// <summary>
        /// Obtiene una reserva por ID
        /// </summary>
        /// <param name="id">ID de la reserva</param>
        /// <returns>Datos de la reserva</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<ReservaResponseDTO>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _service.GetReservaByIdAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }

        /// <summary>
        /// Obtiene todas las reservas de un huésped
        /// </summary>
        /// <param name="huespedId">ID del huésped</param>
        /// <returns>Lista de reservas del huésped</returns>
        [HttpGet("huesped/{huespedId}")]
        [ProducesResponseType(typeof(ApiResponse<List<ReservaResponseDTO>>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetByHuesped(int huespedId)
        {
            var response = await _service.GetReservasByHuespedAsync(huespedId);
            return Ok(response);
        }

        /// <summary>
        /// Crea una nueva reserva
        /// </summary>
        /// <param name="dto">Datos de la reserva a crear</param>
        /// <returns>Reserva creada</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<ReservaResponseDTO>), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Create([FromBody] ReservaCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _service.CreateReservaAsync(dto);
            
            if (!response.Exito)
                return BadRequest(response);

            return CreatedAtAction(nameof(GetById), new { id = response.Datos.Id }, response);
        }

        /// <summary>
        /// Actualiza una reserva existente
        /// </summary>
        /// <param name="id">ID de la reserva</param>
        /// <param name="dto">Datos a actualizar</param>
        /// <returns>Reserva actualizada</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse<ReservaResponseDTO>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Update(int id, [FromBody] ReservaUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _service.UpdateReservaAsync(id, dto);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }

        /// <summary>
        /// Cancela una reserva
        /// </summary>
        /// <param name="id">ID de la reserva</param>
        /// <returns>Resultado de la operación</returns>
        [HttpPatch("{id}/cancelar")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Cancelar(int id)
        {
            var response = await _service.CancelarReservaAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }

        /// <summary>
        /// Elimina una reserva (Solo Administradores)
        /// </summary>
        /// <param name="id">ID de la reserva</param>
        /// <returns>Resultado de la operación</returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _service.DeleteReservaAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }
    }
}