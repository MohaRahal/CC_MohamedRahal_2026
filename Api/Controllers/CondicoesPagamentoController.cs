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
     [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<CondicoesPagamentoReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var condicoes = new List<CondicoesPagamentoReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codCondPagamento AS CodCondPagamento,
                descricao AS Descricao,
                qtdParcelas AS QtdParcelas,
                ativo AS Ativo,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM condicoes_pagamento
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            condicoes.Add(MapearCondicao(reader));
        }
        return Ok(condicoes);
    }
     [Authorize]
    [HttpGet("{codCondPagamento:int}")]
    public async Task<ActionResult<CondicoesPagamentoReadDto>> BuscarPorCodigo(int codCondPagamento, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codCondPagamento AS CodCondPagamento,
                descricao AS Descricao,
                qtdParcelas AS QtdParcelas,
                ativo AS Ativo,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM condicoes_pagamento
            WHERE codCondPagamento = @codCondPagamento
            """;
        command.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearCondicao(reader));
        }
        else
        {
            return NotFound();
        }
    }
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] CondicoesPagamentoCreateDto condicaoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO condicoes_pagamento (descricao, qtdParcelas, ativo)
            VALUES (@descricao, @qtdParcelas, @ativo);
            """;
        command.Parameters.AddWithValue("@descricao", condicaoDto.Descricao);
        command.Parameters.AddWithValue("@qtdParcelas", condicaoDto.QtdParcelas);
        command.Parameters.AddWithValue("@ativo", condicaoDto.Ativo.HasValue ? condicaoDto.Ativo.Value : true);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codCondPagamento = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar a condição de pagamento.");
        }
    }
     [Authorize]
    [HttpPatch("{codCondPagamento:int}")]
    public async Task<ActionResult> Atualizar(int codCondPagamento, [FromBody] CondicoesPagamentoUpdateDto condicaoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (condicaoDto.Descricao != null) updates.Add("descricao = @descricao");
        if (condicaoDto.QtdParcelas.HasValue) updates.Add("qtdParcelas = @qtdParcelas");
        if (condicaoDto.Ativo.HasValue) updates.Add("ativo = @ativo");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE condicoes_pagamento SET {updateClause} WHERE codCondPagamento = @codCondPagamento";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codCondPagamento", codCondPagamento);
        if (condicaoDto.Descricao != null) command.Parameters.AddWithValue("@descricao", condicaoDto.Descricao);
        if (condicaoDto.QtdParcelas.HasValue) command.Parameters.AddWithValue("@qtdParcelas", condicaoDto.QtdParcelas.Value);
        if (condicaoDto.Ativo.HasValue) command.Parameters.AddWithValue("@ativo", condicaoDto.Ativo.Value);

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

    private static CondicoesPagamentoReadDto MapearCondicao(MySqlDataReader reader)
    {
        return new CondicoesPagamentoReadDto
        {
            CodCondPagamento = reader.GetInt32("CodCondPagamento"),
            Descricao = reader.GetString("Descricao"),
            QtdParcelas = reader.GetInt32("QtdParcelas"),
            Ativo = reader.GetBoolean("Ativo"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }
}
