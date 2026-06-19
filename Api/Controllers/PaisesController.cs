using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaisesController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public PaisesController(MySqlConnection connection)
    {
        _connection = connection;
    }
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<PaisesReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var paises = new List<PaisesReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codPais,
                pais,
                sigla,
                ddi,
                moeda,
                codUsuario,
                criado_em,
                atualizado_em
            FROM paises
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            paises.Add(MapearPais(reader));
        }
        return Ok(paises);
    }
////[Authorize]
    [HttpGet("{codPais:int}")]
    public async Task<ActionResult<PaisesReadDto>> BuscarPorCodigo(int codPais, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codPais,
                pais,
                sigla,
                ddi,
                moeda,
                codUsuario,
                criado_em,
                atualizado_em
            FROM paises
            WHERE codPais = @codPais
            """;
        command.Parameters.AddWithValue("@codPais", codPais);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearPais(reader));
        }
        else
        {
            return NotFound();
        }
    }
    [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] PaisesCreateDto paisDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO paises (pais, sigla, ddi, moeda, codUsuario)
            VALUES (@pais, @sigla, @ddi, @moeda, @codUsuario);
            """;
        command.Parameters.AddWithValue("@pais", paisDto.pais);
        command.Parameters.AddWithValue("@sigla", paisDto.sigla);
        command.Parameters.AddWithValue("@ddi", paisDto.ddi);
        command.Parameters.AddWithValue("@moeda", paisDto.moeda);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codPais = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o país.");
        }
    }
////[Authorize]
    [HttpPatch("{codPais:int}")]
    public async Task<ActionResult> Atualizar(int codPais, [FromBody] PaisesUpdateDto paisDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (paisDto.pais != null) updates.Add("pais = @pais");
        if (paisDto.sigla != null) updates.Add("sigla = @sigla");
        if (paisDto.ddi != null) updates.Add("ddi = @ddi");
        if (paisDto.moeda != null) updates.Add("moeda = @moeda");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE paises SET {updateClause} WHERE codPais = @codPais";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codPais", codPais);
        if (paisDto.pais != null) command.Parameters.AddWithValue("@pais", paisDto.pais);
        if (paisDto.sigla != null) command.Parameters.AddWithValue("@sigla", paisDto.sigla);
        if (paisDto.ddi != null) command.Parameters.AddWithValue("@ddi", paisDto.ddi);
        if (paisDto.moeda != null) command.Parameters.AddWithValue("@moeda", paisDto.moeda);

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
    [HttpDelete("{codPais:int}")]
    public async Task<ActionResult> Deletar(int codPais, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM paises WHERE codPais = @codPais";
        command.Parameters.AddWithValue("@codPais", codPais);

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

    private static PaisesReadDto MapearPais(MySqlDataReader reader)
    {
        return new PaisesReadDto
        {
            codPais = reader.GetInt32("codPais"),
            pais = reader.IsDBNull(reader.GetOrdinal("pais")) ? string.Empty : reader.GetString("pais"),
            sigla = reader.IsDBNull(reader.GetOrdinal("sigla")) ? string.Empty : reader.GetString("sigla"),
            ddi = reader.IsDBNull(reader.GetOrdinal("ddi")) ? string.Empty : reader.GetString("ddi"),
            moeda = reader.IsDBNull(reader.GetOrdinal("moeda")) ? string.Empty : reader.GetString("moeda"),
            codUsuario = reader.GetInt32("codUsuario"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };
    }
}
