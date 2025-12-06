using Microsoft.AspNetCore.Mvc;
using HotelManagement.API.Services;
using HotelManagement.API.DTOs;

namespace HotelManagement.API.Controllers
{
    /// <summary>
    /// Controlador para gestionar huéspedes
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
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
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _service.GetHuespedByIdAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }

        /// <summary>
        /// Crea un nuevo huésped
        /// </summary>
        /// <param name="dto">Datos del huésped a crear</param>
        /// <returns>Huésped creado</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<HuespedResponseDTO>), 201)]
        [ProducesResponseType(400)]
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
        /// Actualiza un huésped existente
        /// </summary>
        /// <param name="id">ID del huésped</param>
        /// <param name="dto">Datos a actualizar</param>
        /// <returns>Huésped actualizado</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse<HuespedResponseDTO>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
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
        /// Elimina un huésped
        /// </summary>
        /// <param name="id">ID del huésped</param>
        /// <returns>Resultado de la operación</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _service.DeleteHuespedAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }
    }

    /// <summary>
    /// Controlador para gestionar cuartos/habitaciones
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
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
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _service.GetCuartoByIdAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }

        /// <summary>
        /// Crea un nuevo cuarto
        /// </summary>
        /// <param name="dto">Datos del cuarto a crear</param>
        /// <returns>Cuarto creado</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<CuartoResponseDTO>), 201)]
        [ProducesResponseType(400)]
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
        /// Actualiza un cuarto existente
        /// </summary>
        /// <param name="id">ID del cuarto</param>
        /// <param name="dto">Datos a actualizar</param>
        /// <returns>Cuarto actualizado</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse<CuartoResponseDTO>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
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
        /// Elimina un cuarto
        /// </summary>
        /// <param name="id">ID del cuarto</param>
        /// <returns>Resultado de la operación</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _service.DeleteCuartoAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }
    }

    /// <summary>
    /// Controlador para gestionar reservas
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ReservasController : ControllerBase
    {
        private readonly IReservaService _service;

        public ReservasController(IReservaService service)
        {
            _service = service;
        }

        /// <summary>
        /// Obtiene todas las reservas
        /// </summary>
        /// <returns>Lista de reservas</returns>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<ReservaResponseDTO>>), 200)]
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
        public async Task<IActionResult> Cancelar(int id)
        {
            var response = await _service.CancelarReservaAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }

        /// <summary>
        /// Elimina una reserva
        /// </summary>
        /// <param name="id">ID de la reserva</param>
        /// <returns>Resultado de la operación</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _service.DeleteReservaAsync(id);
            
            if (!response.Exito)
                return NotFound(response);

            return Ok(response);
        }
    }
}