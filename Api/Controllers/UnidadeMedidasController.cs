using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnidadeMedidasController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public UnidadeMedidasController(MySqlConnection connection)
    {
        _connection = connection;
    }
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<UnidadeMedidaReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var unidades = new List<UnidadeMedidaReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codUnidade,
                unidade,
                criado_em,
                atualizado_em
            FROM unidade_medidas
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            unidades.Add(MapearUnidade(reader));
        }
        return Ok(unidades);
    }
////[Authorize]
    [HttpGet("{codUnidade:int}")]
    public async Task<ActionResult<UnidadeMedidaReadDto>> BuscarPorCodigo(int codUnidade, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codUnidade,
                unidade,
                criado_em,
                atualizado_em
            FROM unidade_medidas
            WHERE codUnidade = @codUnidade
            """;
        command.Parameters.AddWithValue("@codUnidade", codUnidade);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearUnidade(reader));
        }
        else
        {
            return NotFound();
        }
    }
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] UnidadeMedidaCreateDto unidadeDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO unidade_medidas (unidade, codUsuario)
            VALUES (@unidade, @codUsuario);
            """;
        command.Parameters.AddWithValue("@unidade", unidadeDto.unidade);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codUnidade = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar a unidade de medida.");
        }
    }
////[Authorize]
    [HttpPatch("{codUnidade:int}")]
    public async Task<ActionResult> Atualizar(int codUnidade, [FromBody] UnidadeMedidaUpdateDto unidadeDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (unidadeDto.unidade != null) updates.Add("unidade = @unidade");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE unidade_medidas SET {updateClause} WHERE codUnidade = @codUnidade";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codUnidade", codUnidade);
        if (unidadeDto.unidade != null) command.Parameters.AddWithValue("@unidade", unidadeDto.unidade);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return NoContent();
        }
        else
        {
            return NotFound();
        }
    }
////[Authorize]
    [HttpDelete("{codUnidade:int}")]
    public async Task<ActionResult> Deletar(int codUnidade, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM unidade_medidas WHERE codUnidade = @codUnidade";
        command.Parameters.AddWithValue("@codUnidade", codUnidade);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return NoContent();
        }
        else
        {
            return NotFound();
        }
    }

    private static UnidadeMedidaReadDto MapearUnidade(MySqlDataReader reader)
    {
        return new UnidadeMedidaReadDto
        {
            codUnidade = reader.GetInt32("codUnidade"),
            unidade = reader.IsDBNull(reader.GetOrdinal("unidade")) ? string.Empty : reader.GetString("unidade"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };
    }
}
