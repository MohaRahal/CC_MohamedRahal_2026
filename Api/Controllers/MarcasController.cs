using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MarcasController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public MarcasController(MySqlConnection connection)
    {
        _connection = connection;
    }

    [HttpGet]
    public async Task<ActionResult<List<MarcaReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var marcas = new List<MarcaReadDto>();
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = "SELECT codMarca, marca, criado_em, atualizado_em FROM marcas";
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            marcas.Add(new MarcaReadDto
            {
                codMarca = reader.GetInt32("codMarca"),
                marca = reader.GetString("marca"),
                criado_em = reader.GetDateTime("criado_em"),
                atualizado_em = reader.GetDateTime("atualizado_em")
            });
        }
        return Ok(marcas);
    }
    [HttpGet("{codMarca}")]
    public async Task<ActionResult<MarcaReadDto>> Obter(int codMarca, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = "SELECT codMarca, marca, criado_em, atualizado_em FROM marcas WHERE codMarca = @codMarca";
        command.Parameters.AddWithValue("@codMarca", codMarca);
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(new MarcaReadDto
            {
                codMarca = reader.GetInt32("codMarca"),
                marca = reader.GetString("marca"),
                criado_em = reader.GetDateTime("criado_em"),
                atualizado_em = reader.GetDateTime("atualizado_em")
            });
        }
        return NotFound();
    }

    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] MarcaCreateDto marcaDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = "INSERT INTO marcas (marca, codUsuario) VALUES (@marca, @codUsuario)";
        command.Parameters.AddWithValue("@marca", marcaDto.marca);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return Ok(new { codMarca = command.LastInsertedId, marca = marcaDto.marca });
        }
        return StatusCode(500, "Erro ao criar marca.");
    }
    [HttpDelete("{codMarca}")]
    public async Task<ActionResult> Excluir(int codMarca, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM marcas WHERE codMarca = @codMarca";
        command.Parameters.AddWithValue("@codMarca", codMarca);
        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return Ok();
        }
        return StatusCode(500, "Erro ao excluir marca.");
    }
    [HttpPatch("{codMarca}")]
    public async Task<ActionResult> Atualizar(int codMarca, [FromBody] MarcaUpdateDto marcaDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        try
        {
            await using var command = _connection.CreateCommand();
            command.CommandText = "UPDATE marcas SET marca = @marca WHERE codMarca = @codMarca";
            command.Parameters.AddWithValue("@marca", marcaDto.marca);
            command.Parameters.AddWithValue("@codMarca", codMarca);
            var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
            if (rowsAffected > 0)
            {
                return Ok();
            }
            return StatusCode(500, "Erro ao atualizar marca.");
        }
        finally
        {
            await _connection.CloseAsync();
        }
    }
}
