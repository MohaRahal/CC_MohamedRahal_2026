using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GruposController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public GruposController(MySqlConnection connection)
    {
        _connection = connection;
    }

    [HttpGet]
    public async Task<ActionResult<List<GrupoReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var grupos = new List<GrupoReadDto>();
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = "SELECT codGrupo, grupo, criado_em, atualizado_em FROM grupos";
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            grupos.Add(new GrupoReadDto
            {
                codGrupo = reader.GetInt32("codGrupo"),
                grupo = reader.GetString("grupo"),
                criado_em = reader.GetDateTime("criado_em"),
                atualizado_em = reader.GetDateTime("atualizado_em")
            });
        }
        return Ok(grupos);
    }

    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] GrupoCreateDto grupoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = "INSERT INTO grupos (grupo, codUsuario) VALUES (@grupo, @codUsuario)";
        command.Parameters.AddWithValue("@grupo", grupoDto.grupo);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return Ok(new { codGrupo = command.LastInsertedId, grupo = grupoDto.grupo });
        }
        return StatusCode(500, "Erro ao criar grupo.");
    }
}
