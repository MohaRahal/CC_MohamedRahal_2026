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

        CondicoesPagamentoReadDto? condicaoDto = null;

        await using (var reader = await command.ExecuteReaderAsync(cancellationToken))
        {
            if (await reader.ReadAsync(cancellationToken))
            {
                condicaoDto = MapearCondicaoPagamento(reader);
            }
        }

        if (condicaoDto != null)
        {
            var parcelas = new List<CondicaoPagamentoParcelasReadDto>();
            await using (var parcelasCommand = _connection.CreateCommand())
            {
                parcelasCommand.CommandText = """
                    SELECT
                        codCondPagamento,
                        numeroParcela,
                        diasVencimento,
                        codFormaPagamento,
                        percentual,
                        criado_em,
                        atualizado_em
                    FROM condicoes_pagamentos_parcelas
                    WHERE codCondPagamento = @codCondPagamento
                    ORDER BY numeroParcela
                    """;
                parcelasCommand.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);

                await using (var pReader = await parcelasCommand.ExecuteReaderAsync(cancellationToken))
                {
                    while (await pReader.ReadAsync(cancellationToken))
                    {
                        parcelas.Add(new CondicaoPagamentoParcelasReadDto
                        {
                            codCondPagamento = pReader.GetInt32("codCondPagamento"),
                            numeroParcela = pReader.GetInt32("numeroParcela"),
                            diasVencimento = pReader.GetInt32("diasVencimento"),
                            codFormaPagamento = pReader.GetInt32("codFormaPagamento"),
                            percentual = pReader.GetDecimal("percentual"),
                            criado_em = pReader.GetDateTime("criado_em"),
                            atualizado_em = pReader.GetDateTime("atualizado_em")
                        });
                    }
                }
            }
            condicaoDto.parcelas = parcelas;
            return Ok(condicaoDto);
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

        if (updates.Count == 0 && condicaoDto.parcelas == null)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var transaction = await _connection.BeginTransactionAsync(cancellationToken);
        try
        {
            if (updates.Count > 0)
            {
                var updateClause = string.Join(", ", updates);
                var commandText = $"UPDATE condicoes_pagamento SET {updateClause} WHERE codCondPagamento = @codCondPagamento";

                await using var command = _connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = commandText;
                command.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);
                if (condicaoDto.condPagamento != null) command.Parameters.AddWithValue("@condPagamento", condicaoDto.condPagamento);
                if (condicaoDto.qtdParcelas.HasValue) command.Parameters.AddWithValue("@qtdParcelas", condicaoDto.qtdParcelas.Value);
                if (condicaoDto.ativo.HasValue) command.Parameters.AddWithValue("@ativo", condicaoDto.ativo.Value);
                if (condicaoDto.juros.HasValue) command.Parameters.AddWithValue("@juros", condicaoDto.juros.Value);
                if (condicaoDto.multa.HasValue) command.Parameters.AddWithValue("@multa", condicaoDto.multa.Value);
                if (condicaoDto.desconto.HasValue) command.Parameters.AddWithValue("@desconto", condicaoDto.desconto.Value);

                await command.ExecuteNonQueryAsync(cancellationToken);
            }

            if (condicaoDto.parcelas != null)
            {
                // Exclui primeiro as parcelas antigas
                await using (var deleteCmd = _connection.CreateCommand())
                {
                    deleteCmd.Transaction = transaction;
                    deleteCmd.CommandText = "DELETE FROM condicoes_pagamentos_parcelas WHERE codCondPagamento = @codCondPagamento";
                    deleteCmd.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);
                    await deleteCmd.ExecuteNonQueryAsync(cancellationToken);
                }

                // Insere as novas parcelas
                for (int i = 0; i < condicaoDto.parcelas.Count; i++)
                {
                    var p = condicaoDto.parcelas[i];
                    await using var parcelaCommand = _connection.CreateCommand();
                    parcelaCommand.Transaction = transaction;
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
            return NoContent();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            return StatusCode(500, "Ocorreu um erro ao atualizar a condicao de pagamento: " + ex.Message);
        }
    }
////[Authorize]
    [HttpDelete("{codCondPagamento:int}")]
    public async Task<ActionResult> Deletar(int codCondPagamento, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var transaction = await _connection.BeginTransactionAsync(cancellationToken);

        try
        {
            // Exclui primeiro as parcelas
            await using (var command = _connection.CreateCommand())
            {
                command.Transaction = transaction;
                command.CommandText = @"
                    DELETE FROM condicoes_pagamentos_parcelas
                    WHERE codCondPagamento = @codCondPagamento";

                command.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);

                await command.ExecuteNonQueryAsync(cancellationToken);
            }

            // Depois exclui a condição de pagamento
            await using (var command = _connection.CreateCommand())
            {
                command.Transaction = transaction;
                command.CommandText = @"
                    DELETE FROM condicoes_pagamento
                    WHERE codCondPagamento = @codCondPagamento";

                command.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);

                var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                if (rowsAffected > 0)
                    return NoContent();

                return NotFound();
            }
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
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
