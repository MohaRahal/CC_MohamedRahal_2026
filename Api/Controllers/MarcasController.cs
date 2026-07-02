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
}
