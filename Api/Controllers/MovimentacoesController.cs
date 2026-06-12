using Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Security.Claims;
using System.Data;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class MovimentacoesController : ControllerBase
{
    private readonly MySqlConnection _connection;

    public MovimentacoesController(MySqlConnection connection)
    {
        _connection = connection;
    }

    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MovimentacaoReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var movimentacoes = new List<MovimentacaoReadDto>();
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT m.id, m.codProduto, m.idUser, m.tipo, m.quantidade, m.saldoAnterior, 
                   m.saldoAtual, m.motivo, m.numNfe, m.serie, m.modelo, m.created_at,
                   p.descProd, u.name as userName
            FROM movimentacoes m
            INNER JOIN produtos p ON m.codProduto = p.codProduto
            INNER JOIN users u ON m.idUser = u.id
            ORDER BY m.created_at DESC
            """;

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            movimentacoes.Add(new MovimentacaoReadDto
            {
                Id = reader.GetInt32("id"),
                CodProduto = reader.GetInt32("codProduto"),
                ProdutoNome = reader.GetString("descProd"),
                IdUser = reader.GetInt32("idUser"),
                UserName = reader.GetString("userName"),
                Tipo = reader.GetString("tipo"),
                Quantidade = reader.GetDecimal("quantidade"),
                SaldoAnterior = reader.GetDecimal("saldoAnterior"),
                SaldoAtual = reader.GetDecimal("saldoAtual"),
                Motivo = reader.GetString("motivo"),
                NumNfe = reader.IsDBNull("numNfe") ? null : reader.GetInt32("numNfe"),
                Serie = reader.IsDBNull("serie") ? null : reader.GetInt32("serie"),
                Modelo = reader.IsDBNull("modelo") ? null : reader.GetInt32("modelo"),
                CreatedAt = reader.GetDateTime("created_at")
            });
        }

        return Ok(movimentacoes);
    }

    
    [HttpPost]
    public async Task<ActionResult> CriarAjusteManual([FromBody] MovimentacaoCreateDto dto, CancellationToken cancellationToken)
    {
        
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var idUser = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        if (dto.Quantidade <= 0) return BadRequest("A quantidade deve ser maior que zero.");
        if (dto.Tipo != "Entrada" && dto.Tipo != "Saida") return BadRequest("Tipo invÃ¡lido. Use 'Entrada' ou 'Saida'.");

        await _connection.OpenAsync(cancellationToken);
        
        
        await using var transaction = await _connection.BeginTransactionAsync(cancellationToken);

        try
        {
            
            await using var cmdSaldo = _connection.CreateCommand();
            cmdSaldo.Transaction = transaction;
            cmdSaldo.CommandText = "SELECT saldoProd FROM produtos WHERE codProduto = @codProduto FOR UPDATE";
            cmdSaldo.Parameters.AddWithValue("@codProduto", dto.CodProduto);

            var saldoObj = await cmdSaldo.ExecuteScalarAsync(cancellationToken);
            if (saldoObj == null)
            {
                await transaction.RollbackAsync(cancellationToken);
                return NotFound("Produto nÃ£o encontrado.");
            }

            decimal saldoAnterior = Convert.ToDecimal(saldoObj);
            
            
            decimal saldoAtual = dto.Tipo == "Entrada" 
                ? saldoAnterior + dto.Quantidade 
                : saldoAnterior - dto.Quantidade;

            if (saldoAtual < 0)
            {
                await transaction.RollbackAsync(cancellationToken);
                return BadRequest("AtenÃ§Ã£o: Saldo insuficiente para realizar essa saÃ­da.");
            }

            
            await using var cmdMov = _connection.CreateCommand();
            cmdMov.Transaction = transaction;
            cmdMov.CommandText = """
                INSERT INTO movimentacoes (codProduto, idUser, tipo, quantidade, saldoAnterior, saldoAtual, motivo)
                VALUES (@codProduto, @idUser, @tipo, @quantidade, @saldoAnterior, @saldoAtual, @motivo)
                """;
            cmdMov.Parameters.AddWithValue("@codProduto", dto.CodProduto);
            cmdMov.Parameters.AddWithValue("@idUser", idUser);
            cmdMov.Parameters.AddWithValue("@tipo", dto.Tipo);
            cmdMov.Parameters.AddWithValue("@quantidade", dto.Quantidade);
            cmdMov.Parameters.AddWithValue("@saldoAnterior", saldoAnterior);
            cmdMov.Parameters.AddWithValue("@saldoAtual", saldoAtual);
            cmdMov.Parameters.AddWithValue("@motivo", dto.Motivo);
            await cmdMov.ExecuteNonQueryAsync(cancellationToken);

            
            await using var cmdUpd = _connection.CreateCommand();
            cmdUpd.Transaction = transaction;
            cmdUpd.CommandText = "UPDATE produtos SET saldoProd = @saldoAtual WHERE codProduto = @codProduto";
            cmdUpd.Parameters.AddWithValue("@saldoAtual", saldoAtual);
            cmdUpd.Parameters.AddWithValue("@codProduto", dto.CodProduto);
            await cmdUpd.ExecuteNonQueryAsync(cancellationToken);

            
            await transaction.CommitAsync(cancellationToken);
            return Ok(new { mensagem = "MovimentaÃ§Ã£o registrada e estoque atualizado com sucesso!" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            return StatusCode(500, $"Erro ao processar movimentaÃ§Ã£o: {ex.Message}");
        }
    }
}

