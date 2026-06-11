using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FormasPagamentoController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public FormasPagamentoController(MySqlConnection connection)
    {
        _connection = connection;
    }
     [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<FormasPagamentoReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var formasPagamento = new List<FormasPagamentoReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codFormaPagamento AS CodFormaPagamento,
                descricao,
                ativo,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM formas_pagamento
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            formasPagamento.Add(MapearFormaPagamento(reader));
        }
        return Ok(formasPagamento);
    }
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Cadastrar(FormasPagamentoCreateDto dto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO formas_pagamento (descricao, ativo)
            VALUES (@descricao, @ativo)
            """;
        command.Parameters.AddWithValue("@descricao", dto.Descricao);
        command.Parameters.AddWithValue("@ativo", dto.Ativo);
        await command.ExecuteNonQueryAsync(cancellationToken);

        return CreatedAtAction(nameof(Listar), null);
    }
    private static FormasPagamentoReadDto MapearFormaPagamento(MySqlDataReader reader)
    {
        return new FormasPagamentoReadDto
        {
            CodFormaPagamento = reader.GetInt32("CodFormaPagamento"),
            Descricao = reader.GetString("Descricao"),
            Ativo = reader.GetBoolean("Ativo"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }

}
