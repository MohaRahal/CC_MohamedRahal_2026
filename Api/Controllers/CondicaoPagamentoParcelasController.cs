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
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<CondicaoPagamentoParcelasReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var parcelas = new List<CondicaoPagamentoParcelasReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codCondPagamento,
                numeroParcela,
                diasVencimento,
                codFormaPagamento,
                percentual,
                criado_em,
                atualizado_em
            FROM condicao_pagamento_parcelas
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            parcelas.Add(MapearParcela(reader));
        }
        return Ok(parcelas);
    }
////[Authorize]
    [HttpGet("{codCondPagamento:int}/{numeroParcela:int}")]
    public async Task<ActionResult<CondicaoPagamentoParcelasReadDto>> BuscarPorCodigo(int codCondPagamento, int numeroParcela, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codCondPagamento,
                numeroParcela,
                diasVencimento,
                codFormaPagamento,
                percentual,
                criado_em,
                atualizado_em
            FROM condicao_pagamento_parcelas
            WHERE codCondPagamento = @codCondPagamento AND numeroParcela = @numeroParcela
            """;
        command.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);
        command.Parameters.AddWithValue("@numeroParcela", numeroParcela);

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
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] CondicaoPagamentoParcelasCreateDto parcelaDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO condicao_pagamento_parcelas (codCondPagamento, numeroParcela, diasVencimento, codFormaPagamento, percentual)
            VALUES (@codCondPagamento, @numeroParcela, @diasVencimento, @codFormaPagamento, @percentual);
            """;
        command.Parameters.AddWithValue("@codCondPagamento", parcelaDto.codCondPagamento);
        command.Parameters.AddWithValue("@numeroParcela", parcelaDto.numeroParcela);
        command.Parameters.AddWithValue("@diasVencimento", parcelaDto.diasVencimento);
        command.Parameters.AddWithValue("@codFormaPagamento", parcelaDto.codFormaPagamento);
        command.Parameters.AddWithValue("@percentual", parcelaDto.percentual.HasValue ? parcelaDto.percentual.Value : 0m);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codCondPagamento = parcelaDto.codCondPagamento, numeroParcela = parcelaDto.numeroParcela }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar a parcela.");
        }
    }
////[Authorize]
    [HttpPatch("{codCondPagamento:int}/{numeroParcela:int}")]
    public async Task<ActionResult> Atualizar(int codCondPagamento, int numeroParcela, [FromBody] CondicaoPagamentoParcelasUpdateDto parcelaDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (parcelaDto.diasVencimento.HasValue) updates.Add("diasVencimento = @diasVencimento");
        if (parcelaDto.codFormaPagamento.HasValue) updates.Add("codFormaPagamento = @codFormaPagamento");
        if (parcelaDto.percentual.HasValue) updates.Add("percentual = @percentual");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE condicao_pagamento_parcelas SET {updateClause} WHERE codCondPagamento = @codCondPagamento AND numeroParcela = @numeroParcela";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);
        command.Parameters.AddWithValue("@numeroParcela", numeroParcela);
        if (parcelaDto.diasVencimento.HasValue) command.Parameters.AddWithValue("@diasVencimento", parcelaDto.diasVencimento.Value);
        if (parcelaDto.codFormaPagamento.HasValue) command.Parameters.AddWithValue("@codFormaPagamento", parcelaDto.codFormaPagamento.Value);
        if (parcelaDto.percentual.HasValue) command.Parameters.AddWithValue("@percentual", parcelaDto.percentual.Value);

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
    [HttpDelete("{codCondPagamento:int}/{numeroParcela:int}")]
    public async Task<ActionResult> Deletar(int codCondPagamento, int numeroParcela, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM condicao_pagamento_parcelas WHERE codCondPagamento = @codCondPagamento AND numeroParcela = @numeroParcela";
        command.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);
        command.Parameters.AddWithValue("@numeroParcela", numeroParcela);

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
            codCondPagamento = reader.GetInt32("codCondPagamento"),
            numeroParcela = reader.GetInt32("numeroParcela"),
            diasVencimento = reader.GetInt32("diasVencimento"),
            codFormaPagamento = reader.GetInt32("codFormaPagamento"),
            percentual = reader.GetDecimal("percentual"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };
    }
}
