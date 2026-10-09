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

    [HttpGet("{codGrupo:int}")]
    public async Task<ActionResult<GrupoReadDto>> Obter(int codGrupo, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = "SELECT codGrupo, grupo, criado_em, atualizado_em FROM grupos WHERE codGrupo = @codGrupo";
        command.Parameters.AddWithValue("@codGrupo", codGrupo);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (!await reader.ReadAsync(cancellationToken)) return NotFound("Grupo não encontrado.");

        return Ok(new GrupoReadDto
        {
            codGrupo = reader.GetInt32("codGrupo"),
            grupo = reader.GetString("grupo"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        });
    }

    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] GrupoCreateDto grupoDto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(grupoDto.grupo)) return BadRequest("O nome do grupo é obrigatório.");
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = "INSERT INTO grupos (grupo, codUsuario) VALUES (@grupo, @codUsuario)";
        command.Parameters.AddWithValue("@grupo", grupoDto.grupo.Trim());
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(Obter), new { codGrupo = command.LastInsertedId },
                new { codGrupo = command.LastInsertedId, grupo = grupoDto.grupo.Trim() });
        }
        return StatusCode(500, "Erro ao criar grupo.");
    }

    [HttpPatch("{codGrupo:int}")]
    public async Task<ActionResult> Atualizar(int codGrupo, [FromBody] GrupoUpdateDto grupoDto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(grupoDto.grupo)) return BadRequest("O nome do grupo é obrigatório.");
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = "UPDATE grupos SET grupo = @grupo WHERE codGrupo = @codGrupo";
        command.Parameters.AddWithValue("@grupo", grupoDto.grupo.Trim());
        command.Parameters.AddWithValue("@codGrupo", codGrupo);
        return await command.ExecuteNonQueryAsync(cancellationToken) > 0 ? NoContent() : NotFound("Grupo não encontrado.");
    }

    [HttpDelete("{codGrupo:int}")]
    public async Task<ActionResult> Excluir(int codGrupo, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        try
        {
            await using (var vinculos = _connection.CreateCommand())
            {
                vinculos.CommandText = "SELECT COUNT(*) FROM produtos WHERE codGrupo = @codGrupo";
                vinculos.Parameters.AddWithValue("@codGrupo", codGrupo);
                var totalVinculos = Convert.ToInt64(await vinculos.ExecuteScalarAsync(cancellationToken));
                if (totalVinculos > 0)
                {
                    return Conflict("Este grupo está sendo usado em produtos e não pode ser excluído.");
                }
            }

            await using var command = _connection.CreateCommand();
            command.CommandText = "DELETE FROM grupos WHERE codGrupo = @codGrupo";
            command.Parameters.AddWithValue("@codGrupo", codGrupo);
            return await command.ExecuteNonQueryAsync(cancellationToken) > 0
                ? NoContent()
                : NotFound("Grupo não encontrado.");
        }
        catch (MySqlException ex) when (
            ex.Number == 1451 || ex.SqlState == "23000" ||
            ex.Message.Contains("foreign key constraint", StringComparison.OrdinalIgnoreCase))
        {
            return Conflict("Este grupo está sendo usado por outro cadastro e não pode ser excluído.");
        }
    }
}
