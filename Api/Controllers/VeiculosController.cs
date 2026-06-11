using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VeiculosController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public VeiculosController(MySqlConnection connection)
    {
        _connection = connection;
    }
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<VeiculosReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var veiculos = new List<VeiculosReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codVeic AS CodVeic,
                placaVeic AS PlacaVeic,
                codEstado AS CodEstado,
                codANTT AS CodAntt,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM veiculo
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            veiculos.Add(MapearVeiculo(reader));
        }
        return Ok(veiculos);
    }
     [Authorize]
    [HttpGet("{codVeic:int}")]
    public async Task<ActionResult<VeiculosReadDto>> BuscarPorCodigo(int codVeic, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codVeic AS CodVeic,
                placaVeic AS PlacaVeic,
                codEstado AS CodEstado,
                codANTT AS CodAntt,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM veiculo
            WHERE codVeic = @codVeic
            """;
        command.Parameters.AddWithValue("@codVeic", codVeic);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearVeiculo(reader));
        }
        else
        {
            return NotFound();
        }
    }
    [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] VeiculosCreateDto veiculoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO veiculo (placaVeic, codEstado, codANTT)
            VALUES (@placaVeic, @codEstado, @codANTT);
            """;
        command.Parameters.AddWithValue("@placaVeic", veiculoDto.PlacaVeic);
        command.Parameters.AddWithValue("@codEstado", veiculoDto.CodEstado.HasValue ? veiculoDto.CodEstado.Value : DBNull.Value);
        command.Parameters.AddWithValue("@codANTT", veiculoDto.CodAntt);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codVeic = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o veículo.");
        }
    }
     [Authorize]
    [HttpPatch("{codVeic:int}")]
    public async Task<ActionResult> Atualizar(int codVeic, [FromBody] VeiculosUpdateDto veiculoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (veiculoDto.PlacaVeic != null) updates.Add("placaVeic = @placaVeic");
        if (veiculoDto.CodEstado.HasValue) updates.Add("codEstado = @codEstado");
        if (veiculoDto.CodAntt != null) updates.Add("codANTT = @codANTT");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE veiculo SET {updateClause} WHERE codVeic = @codVeic";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codVeic", codVeic);
        if (veiculoDto.PlacaVeic != null) command.Parameters.AddWithValue("@placaVeic", veiculoDto.PlacaVeic);
        if (veiculoDto.CodEstado.HasValue) command.Parameters.AddWithValue("@codEstado", veiculoDto.CodEstado.Value);
        if (veiculoDto.CodAntt != null) command.Parameters.AddWithValue("@codANTT", veiculoDto.CodAntt);

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
    [HttpDelete("{codVeic:int}")]
    public async Task<ActionResult> Deletar(int codVeic, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM veiculo WHERE codVeic = @codVeic";
        command.Parameters.AddWithValue("@codVeic", codVeic);

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

    private static VeiculosReadDto MapearVeiculo(MySqlDataReader reader)
    {
        return new VeiculosReadDto
        {
            CodVeic = reader.GetInt32("CodVeic"),
            PlacaVeic = reader.IsDBNull(reader.GetOrdinal("PlacaVeic")) ? string.Empty : reader.GetString("PlacaVeic"),
            CodEstado = reader.IsDBNull(reader.GetOrdinal("CodEstado")) ? null : reader.GetInt32("CodEstado"),
            CodAntt = reader.IsDBNull(reader.GetOrdinal("CodAntt")) ? string.Empty : reader.GetString("CodAntt"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }
}
