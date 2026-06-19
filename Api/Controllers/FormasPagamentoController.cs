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
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<FormasPagamentoReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var formas = new List<FormasPagamentoReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codFormaPagamento,
                formaPagamento,
                ativo,
                criado_em,
                atualizado_em
            FROM formas_pagamento
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            formas.Add(MapearFormaPagamento(reader));
        }
        return Ok(formas);
    }
////[Authorize]
    [HttpGet("{codFormaPagamento:int}")]
    public async Task<ActionResult<FormasPagamentoReadDto>> BuscarPorCodigo(int codFormaPagamento, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codFormaPagamento,
                formaPagamento,
                ativo,
                criado_em,
                atualizado_em
            FROM formas_pagamento
            WHERE codFormaPagamento = @codFormaPagamento
            """;
        command.Parameters.AddWithValue("@codFormaPagamento", codFormaPagamento);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearFormaPagamento(reader));
        }
        else
        {
            return NotFound();
        }
    }
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] FormasPagamentoCreateDto formaDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO formas_pagamento (formaPagamento, ativo, codUsuario)
            VALUES (@formaPagamento, @ativo, @codUsuario);
            """;
        command.Parameters.AddWithValue("@formaPagamento", formaDto.formaPagamento);
        command.Parameters.AddWithValue("@ativo", formaDto.ativo ?? true);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codFormaPagamento = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar a forma de pagamento.");
        }
    }
////[Authorize]
    [HttpPatch("{codFormaPagamento:int}")]
    public async Task<ActionResult> Atualizar(int codFormaPagamento, [FromBody] FormasPagamentoUpdateDto formaDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (formaDto.formaPagamento != null) updates.Add("formaPagamento = @formaPagamento");
        if (formaDto.ativo.HasValue) updates.Add("ativo = @ativo");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE formas_pagamento SET {updateClause} WHERE codFormaPagamento = @codFormaPagamento";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codFormaPagamento", codFormaPagamento);
        if (formaDto.formaPagamento != null) command.Parameters.AddWithValue("@formaPagamento", formaDto.formaPagamento);
        if (formaDto.ativo.HasValue) command.Parameters.AddWithValue("@ativo", formaDto.ativo.Value);

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
    [HttpDelete("{codFormaPagamento:int}")]
    public async Task<ActionResult> Deletar(int codFormaPagamento, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM formas_pagamento WHERE codFormaPagamento = @codFormaPagamento";
        command.Parameters.AddWithValue("@codFormaPagamento", codFormaPagamento);

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

    private static FormasPagamentoReadDto MapearFormaPagamento(MySqlDataReader reader)
    {
        return new FormasPagamentoReadDto
        {
            codFormaPagamento = reader.GetInt32("codFormaPagamento"),
            formaPagamento = reader.IsDBNull(reader.GetOrdinal("formaPagamento")) ? string.Empty : reader.GetString("formaPagamento"),
            ativo = reader.GetBoolean("ativo"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };
    }
}
