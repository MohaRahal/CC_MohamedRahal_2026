using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CondicoesPagamentoController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public CondicoesPagamentoController(MySqlConnection connection)
    {
        _connection = connection;
    }
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<CondicoesPagamentoReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var condicoes = new List<CondicoesPagamentoReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codCondPagamento,
                condPagamento,
                qtdParcelas,
                ativo,
                juros,
                multa,
                desconto,
                codUsuario,
                criado_em,
                atualizado_em
            FROM condicoes_pagamento
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            condicoes.Add(MapearCondicaoPagamento(reader));
        }
        return Ok(condicoes);
    }
////[Authorize]
    [HttpGet("{codCondPagamento:int}")]
    public async Task<ActionResult<CondicoesPagamentoReadDto>> BuscarPorCodigo(int codCondPagamento, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codCondPagamento,
                condPagamento,
                qtdParcelas,
                ativo,
                juros,
                multa,
                desconto,
                codUsuario,
                criado_em,
                atualizado_em
            FROM condicoes_pagamento
            WHERE codCondPagamento = @codCondPagamento
            """;
        command.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearCondicaoPagamento(reader));
        }
        else
        {
            return NotFound();
        }
    }
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] CondicoesPagamentoCreateDto condicaoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var transaction = await _connection.BeginTransactionAsync(cancellationToken);

        try
        {
            await using var command = _connection.CreateCommand();
            command.Transaction = transaction;
            command.CommandText = """
                INSERT INTO condicoes_pagamento (condPagamento, qtdParcelas, ativo, juros, multa, desconto, codUsuario)
                VALUES (@condPagamento, @qtdParcelas, @ativo, @juros, @multa, @desconto, @codUsuario);
                """;
            command.Parameters.AddWithValue("@condPagamento", condicaoDto.condPagamento);
            command.Parameters.AddWithValue("@qtdParcelas", condicaoDto.qtdParcelas);
            command.Parameters.AddWithValue("@ativo", condicaoDto.ativo ?? true);
            command.Parameters.AddWithValue("@juros", condicaoDto.juros);
            command.Parameters.AddWithValue("@multa", condicaoDto.multa);
            command.Parameters.AddWithValue("@desconto", condicaoDto.desconto);
            command.Parameters.AddWithValue("@codUsuario", idUserLogado);

            await command.ExecuteNonQueryAsync(cancellationToken);
            var codCondPagamento = command.LastInsertedId;

            if (condicaoDto.parcelas != null && condicaoDto.parcelas.Count > 0)
            {
                for (int i = 0; i < condicaoDto.parcelas.Count; i++)
                {
                    var p = condicaoDto.parcelas[i];
                    await using var parcelaCommand = _connection.CreateCommand();
                    parcelaCommand.Transaction = transaction;
                    // Certificando de usar o nome correto da tabela conforme o CondicaoPagamentoParcelasController
                    parcelaCommand.CommandText = """
                        INSERT INTO condicoes_pagamentos_parcelas 
                        (codCondPagamento, numeroParcela, diasVencimento, codFormaPagamento, percentual, codUsuario)
                        VALUES (@codCondPagamento, @numeroParcela, @diasVencimento, @codFormaPagamento, @percentual, @codUsuario);
                        """;
                    parcelaCommand.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);
                    parcelaCommand.Parameters.AddWithValue("@numeroParcela", i + 1);
                    parcelaCommand.Parameters.AddWithValue("@diasVencimento", p.diasVencimento);
                    parcelaCommand.Parameters.AddWithValue("@codFormaPagamento", p.codFormaPagamento);
                    parcelaCommand.Parameters.AddWithValue("@percentual", p.percentual ?? 0);
                    parcelaCommand.Parameters.AddWithValue("@codUsuario", idUserLogado);

                    await parcelaCommand.ExecuteNonQueryAsync(cancellationToken);
                }
            }

            await transaction.CommitAsync(cancellationToken);
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codCondPagamento = codCondPagamento }, null);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            return StatusCode(500, "Ocorreu um erro ao criar a condicao de pagamento: " + ex.Message);
        }
    }
////[Authorize]
    [HttpPatch("{codCondPagamento:int}")]
    public async Task<ActionResult> Atualizar(int codCondPagamento, [FromBody] CondicoesPagamentoUpdateDto condicaoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (condicaoDto.condPagamento != null) updates.Add("condPagamento = @condPagamento");
        if (condicaoDto.qtdParcelas.HasValue) updates.Add("qtdParcelas = @qtdParcelas");
        if (condicaoDto.ativo.HasValue) updates.Add("ativo = @ativo");
        if (condicaoDto.juros.HasValue) updates.Add("juros = @juros");
        if (condicaoDto.multa.HasValue) updates.Add("multa = @multa");
        if (condicaoDto.desconto.HasValue) updates.Add("desconto = @desconto");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE condicoes_pagamento SET {updateClause} WHERE codCondPagamento = @codCondPagamento";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);
        if (condicaoDto.condPagamento != null) command.Parameters.AddWithValue("@condPagamento", condicaoDto.condPagamento);
        if (condicaoDto.qtdParcelas.HasValue) command.Parameters.AddWithValue("@qtdParcelas", condicaoDto.qtdParcelas.Value);
        if (condicaoDto.ativo.HasValue) command.Parameters.AddWithValue("@ativo", condicaoDto.ativo.Value);
        if (condicaoDto.juros.HasValue) command.Parameters.AddWithValue("@juros", condicaoDto.juros.Value);
        if (condicaoDto.multa.HasValue) command.Parameters.AddWithValue("@multa", condicaoDto.multa.Value);
        if (condicaoDto.desconto.HasValue) command.Parameters.AddWithValue("@desconto", condicaoDto.desconto.Value);

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
    [HttpDelete("{codCondPagamento:int}")]
    public async Task<ActionResult> Deletar(int codCondPagamento, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM condicoes_pagamento WHERE codCondPagamento = @codCondPagamento";
        command.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);

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

    private static CondicoesPagamentoReadDto MapearCondicaoPagamento(MySqlDataReader reader)
    {
        return new CondicoesPagamentoReadDto
        {
            codCondPagamento = reader.GetInt32("codCondPagamento"),
            condPagamento = reader.GetString("condPagamento"),
            qtdParcelas = reader.GetInt32("qtdParcelas"),
            ativo = reader.GetBoolean("ativo"),
            juros = reader.GetDecimal("juros"),
            multa = reader.GetDecimal("multa"),
            desconto = reader.GetDecimal("desconto"),
            codUsuario = reader.IsDBNull(reader.GetOrdinal("codUsuario")) ? 0 : reader.GetInt32("codUsuario"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };
    }
}
