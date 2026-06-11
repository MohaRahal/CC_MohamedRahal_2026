using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransportadoresController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public TransportadoresController(MySqlConnection connection)
    {
        _connection = connection;
    }
     [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<TransportadoresReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var transportadores = new List<TransportadoresReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codTransp AS CodTransp,
                cpf_cnpjTransp AS CpfCnpjTransp,
                endTransp AS EndTransp,
                codCidade AS CodCidade,
                razaoSocTransp AS RazaoSocTransp,
                inscEstTransp AS InscEstTransp,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM transportadores
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            transportadores.Add(MapearTransportador(reader));
        }
        return Ok(transportadores);
    }
     [Authorize]
    [HttpGet("{codTransp:int}")]
    public async Task<ActionResult<TransportadoresReadDto>> BuscarPorCodigo(int codTransp, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codTransp AS CodTransp,
                cpf_cnpjTransp AS CpfCnpjTransp,
                endTransp AS EndTransp,
                codCidade AS CodCidade,
                razaoSocTransp AS RazaoSocTransp,
                inscEstTransp AS InscEstTransp,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM transportadores
            WHERE codTransp = @codTransp
            """;
        command.Parameters.AddWithValue("@codTransp", codTransp);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearTransportador(reader));
        }
        else
        {
            return NotFound();
        }
    }
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] TransportadoresCreateDto transpDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO transportadores (cpf_cnpjTransp, endTransp, codCidade, razaoSocTransp, inscEstTransp)
            VALUES (@cpf_cnpjTransp, @endTransp, @codCidade, @razaoSocTransp, @inscEstTransp);
            """;
        command.Parameters.AddWithValue("@cpf_cnpjTransp", transpDto.CpfCnpjTransp);
        command.Parameters.AddWithValue("@endTransp", transpDto.EndTransp);
        command.Parameters.AddWithValue("@codCidade", transpDto.CodCidade.HasValue ? transpDto.CodCidade.Value : DBNull.Value);
        command.Parameters.AddWithValue("@razaoSocTransp", transpDto.RazaoSocTransp);
        command.Parameters.AddWithValue("@inscEstTransp", transpDto.InscEstTransp);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codTransp = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o transportador.");
        }
    }
     [Authorize]
    [HttpPatch("{codTransp:int}")]
    public async Task<ActionResult> Atualizar(int codTransp, [FromBody] TransportadoresUpdateDto transpDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (transpDto.CpfCnpjTransp != null) updates.Add("cpf_cnpjTransp = @cpf_cnpjTransp");
        if (transpDto.EndTransp != null) updates.Add("endTransp = @endTransp");
        if (transpDto.CodCidade.HasValue) updates.Add("codCidade = @codCidade");
        if (transpDto.RazaoSocTransp != null) updates.Add("razaoSocTransp = @razaoSocTransp");
        if (transpDto.InscEstTransp != null) updates.Add("inscEstTransp = @inscEstTransp");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE transportadores SET {updateClause} WHERE codTransp = @codTransp";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codTransp", codTransp);
        if (transpDto.CpfCnpjTransp != null) command.Parameters.AddWithValue("@cpf_cnpjTransp", transpDto.CpfCnpjTransp);
        if (transpDto.EndTransp != null) command.Parameters.AddWithValue("@endTransp", transpDto.EndTransp);
        if (transpDto.CodCidade.HasValue) command.Parameters.AddWithValue("@codCidade", transpDto.CodCidade.Value);
        if (transpDto.RazaoSocTransp != null) command.Parameters.AddWithValue("@razaoSocTransp", transpDto.RazaoSocTransp);
        if (transpDto.InscEstTransp != null) command.Parameters.AddWithValue("@inscEstTransp", transpDto.InscEstTransp);

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
     [Authorize]
    [HttpDelete("{codTransp:int}")]
    public async Task<ActionResult> Deletar(int codTransp, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM transportadores WHERE codTransp = @codTransp";
        command.Parameters.AddWithValue("@codTransp", codTransp);

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

    private static TransportadoresReadDto MapearTransportador(MySqlDataReader reader)
    {
        return new TransportadoresReadDto
        {
            CodTransp = reader.GetInt32("CodTransp"),
            CpfCnpjTransp = reader.IsDBNull(reader.GetOrdinal("CpfCnpjTransp")) ? string.Empty : reader.GetString("CpfCnpjTransp"),
            EndTransp = reader.IsDBNull(reader.GetOrdinal("EndTransp")) ? string.Empty : reader.GetString("EndTransp"),
            CodCidade = reader.IsDBNull(reader.GetOrdinal("CodCidade")) ? null : reader.GetInt32("CodCidade"),
            RazaoSocTransp = reader.IsDBNull(reader.GetOrdinal("RazaoSocTransp")) ? string.Empty : reader.GetString("RazaoSocTransp"),
            InscEstTransp = reader.IsDBNull(reader.GetOrdinal("InscEstTransp")) ? string.Empty : reader.GetString("InscEstTransp"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }
}
