using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CondicaoPagamentoParcelasController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public CondicaoPagamentoParcelasController(MySqlConnection connection)
    {
        _connection = connection;
    }
     [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<CondicaoPagamentoParcelasReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var parcelas = new List<CondicaoPagamentoParcelasReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codParcela AS CodParcela,
                codCondPagamento AS CodCondPagamento,
                numeroParcela AS NumParcela,
                diasVencimento AS DiasVencimento,
                percentual AS Percentual,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM condicao_pagamento_parcelas
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            parcelas.Add(MapearParcela(reader));
        }
        return Ok(parcelas);
    }
     [Authorize]
    [HttpGet("{codParcela:int}")]
    public async Task<ActionResult<CondicaoPagamentoParcelasReadDto>> BuscarPorCodigo(int codParcela, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codParcela AS CodParcela,
                codCondPagamento AS CodCondPagamento,
                numeroParcela AS NumParcela,
                diasVencimento AS DiasVencimento,
                percentual AS Percentual,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM condicao_pagamento_parcelas
            WHERE codParcela = @codParcela
            """;
        command.Parameters.AddWithValue("@codParcela", codParcela);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearParcela(reader));
        }
        else
        {
            return NotFound();
        }
    }
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] CondicaoPagamentoParcelasCreateDto parcelaDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO condicao_pagamento_parcelas (codCondPagamento, numeroParcela, diasVencimento, percentual)
            VALUES (@codCondPagamento, @numeroParcela, @diasVencimento, @percentual);
            """;
        command.Parameters.AddWithValue("@codCondPagamento", parcelaDto.CodCondPagamento);
        command.Parameters.AddWithValue("@numeroParcela", parcelaDto.NumParcela);
        command.Parameters.AddWithValue("@diasVencimento", parcelaDto.DiasVencimento);
        command.Parameters.AddWithValue("@percentual", parcelaDto.Percentual.HasValue ? parcelaDto.Percentual.Value : DBNull.Value);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codParcela = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar a parcela.");
        }
    }
     [Authorize]
    [HttpPatch("{codParcela:int}")]
    public async Task<ActionResult> Atualizar(int codParcela, [FromBody] CondicaoPagamentoParcelasUpdateDto parcelaDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (parcelaDto.CodCondPagamento.HasValue) updates.Add("codCondPagamento = @codCondPagamento");
        if (parcelaDto.NumParcela.HasValue) updates.Add("numeroParcela = @numeroParcela");
        if (parcelaDto.DiasVencimento.HasValue) updates.Add("diasVencimento = @diasVencimento");
        if (parcelaDto.Percentual.HasValue) updates.Add("percentual = @percentual");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE condicao_pagamento_parcelas SET {updateClause} WHERE codParcela = @codParcela";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codParcela", codParcela);
        if (parcelaDto.CodCondPagamento.HasValue) command.Parameters.AddWithValue("@codCondPagamento", parcelaDto.CodCondPagamento.Value);
        if (parcelaDto.NumParcela.HasValue) command.Parameters.AddWithValue("@numeroParcela", parcelaDto.NumParcela.Value);
        if (parcelaDto.DiasVencimento.HasValue) command.Parameters.AddWithValue("@diasVencimento", parcelaDto.DiasVencimento.Value);
        if (parcelaDto.Percentual.HasValue) command.Parameters.AddWithValue("@percentual", parcelaDto.Percentual.Value);

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
    [HttpDelete("{codParcela:int}")]
    public async Task<ActionResult> Deletar(int codParcela, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM condicao_pagamento_parcelas WHERE codParcela = @codParcela";
        command.Parameters.AddWithValue("@codParcela", codParcela);

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

    private static CondicaoPagamentoParcelasReadDto MapearParcela(MySqlDataReader reader)
    {
        return new CondicaoPagamentoParcelasReadDto
        {
            CodParcela = reader.GetInt32("CodParcela"),
            CodCondPagamento = reader.GetInt32("CodCondPagamento"),
            NumParcela = reader.GetInt32("NumParcela"),
            DiasVencimento = reader.GetInt32("DiasVencimento"),
            Percentual = reader.IsDBNull(reader.GetOrdinal("Percentual")) ? 0m : reader.GetDecimal("Percentual"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }
}
