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
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<VeiculosReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var veiculos = new List<VeiculosReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codVeiculo,
                placaVeiculo,
                placaMercosul,
                chassi,
                codModelo,
                codTransportador,
                codEstado,
                codANTT,
                criado_em,
                atualizado_em
            FROM veiculos
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            veiculos.Add(MapearVeiculo(reader));
        }
        return Ok(veiculos);
    }
////[Authorize]
    [HttpGet("{codVeiculo:int}")]
    public async Task<ActionResult<VeiculosReadDto>> BuscarPorCodigo(int codVeiculo, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codVeiculo,
                placaVeiculo,
                placaMercosul,
                chassi,
                codModelo,
                codTransportador,
                codEstado,
                codANTT,
                criado_em,
                atualizado_em
            FROM veiculos
            WHERE codVeiculo = @codVeiculo
            """;
        command.Parameters.AddWithValue("@codVeiculo", codVeiculo);

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
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] VeiculosCreateDto veiculoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO veiculos (placaVeiculo, placaMercosul, chassi, codModelo, codTransportador, codEstado, codANTT, codUsuario)
            VALUES (@placaVeiculo, @placaMercosul, @chassi, @codModelo, @codTransportador, @codEstado, @codANTT, @codUsuario);
            """;
        command.Parameters.AddWithValue("@placaVeiculo", string.IsNullOrEmpty(veiculoDto.placaVeiculo) ? (object)DBNull.Value : veiculoDto.placaVeiculo);
        command.Parameters.AddWithValue("@placaMercosul", string.IsNullOrEmpty(veiculoDto.placaMercosul) ? (object)DBNull.Value : veiculoDto.placaMercosul);
        command.Parameters.AddWithValue("@chassi", string.IsNullOrEmpty(veiculoDto.chassi) ? (object)DBNull.Value : veiculoDto.chassi);
        command.Parameters.AddWithValue("@codModelo", veiculoDto.codModelo);
        command.Parameters.AddWithValue("@codTransportador", veiculoDto.codTransportador);
        command.Parameters.AddWithValue("@codEstado", veiculoDto.codEstado.HasValue ? veiculoDto.codEstado.Value : DBNull.Value);
        command.Parameters.AddWithValue("@codANTT", string.IsNullOrEmpty(veiculoDto.codANTT) ? (object)DBNull.Value : veiculoDto.codANTT);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codVeiculo = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o veículo.");
        }
    }
////[Authorize]
    [HttpPatch("{codVeiculo:int}")]
    public async Task<ActionResult> Atualizar(int codVeiculo, [FromBody] VeiculosUpdateDto veiculoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (veiculoDto.placaVeiculo != null) updates.Add("placaVeiculo = @placaVeiculo");
        if (veiculoDto.placaMercosul != null) updates.Add("placaMercosul = @placaMercosul");
        if (veiculoDto.chassi != null) updates.Add("chassi = @chassi");
        if (veiculoDto.codModelo.HasValue) updates.Add("codModelo = @codModelo");
        if (veiculoDto.codTransportador.HasValue) updates.Add("codTransportador = @codTransportador");
        if (veiculoDto.codEstado.HasValue) updates.Add("codEstado = @codEstado");
        if (veiculoDto.codANTT != null) updates.Add("codANTT = @codANTT");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE veiculos SET {updateClause} WHERE codVeiculo = @codVeiculo";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codVeiculo", codVeiculo);
        
        if (veiculoDto.placaVeiculo != null) command.Parameters.AddWithValue("@placaVeiculo", veiculoDto.placaVeiculo);
        if (veiculoDto.placaMercosul != null) command.Parameters.AddWithValue("@placaMercosul", veiculoDto.placaMercosul);
        if (veiculoDto.chassi != null) command.Parameters.AddWithValue("@chassi", veiculoDto.chassi);
        if (veiculoDto.codModelo.HasValue) command.Parameters.AddWithValue("@codModelo", veiculoDto.codModelo.Value);
        if (veiculoDto.codTransportador.HasValue) command.Parameters.AddWithValue("@codTransportador", veiculoDto.codTransportador.Value);
        if (veiculoDto.codEstado.HasValue) command.Parameters.AddWithValue("@codEstado", veiculoDto.codEstado.Value);
        if (veiculoDto.codANTT != null) command.Parameters.AddWithValue("@codANTT", veiculoDto.codANTT);

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
    [HttpDelete("{codVeiculo:int}")]
    public async Task<ActionResult> Deletar(int codVeiculo, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM veiculos WHERE codVeiculo = @codVeiculo";
        command.Parameters.AddWithValue("@codVeiculo", codVeiculo);

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
            codVeiculo = reader.GetInt32("codVeiculo"),
            placaVeiculo = reader.IsDBNull(reader.GetOrdinal("placaVeiculo")) ? string.Empty : reader.GetString("placaVeiculo"),
            placaMercosul = reader.IsDBNull(reader.GetOrdinal("placaMercosul")) ? string.Empty : reader.GetString("placaMercosul"),
            chassi = reader.IsDBNull(reader.GetOrdinal("chassi")) ? string.Empty : reader.GetString("chassi"),
            codModelo = reader.GetInt32("codModelo"),
            codTransportador = reader.GetInt32("codTransportador"),
            codEstado = reader.IsDBNull(reader.GetOrdinal("codEstado")) ? null : reader.GetInt32("codEstado"),
            codANTT = reader.IsDBNull(reader.GetOrdinal("codANTT")) ? string.Empty : reader.GetString("codANTT"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };
    }
}
