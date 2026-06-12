using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public ProdutosController(MySqlConnection connection)
    {
        _connection = connection;
    }
     [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<ProdutosReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var produtos = new List<ProdutosReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codProd AS CodProduto,
                descProd AS DescProd,
                NCMSHPROD AS NcmshProd,
                undProd AS UndProd,
                pesoBruto AS PesoProd,
                pesoLiq AS PesoLiq,
                saldoProd AS SaldoProd,
                custoMedioProd AS CustoMedioProd,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM produtos
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            produtos.Add(MapearProduto(reader));
        }
        return Ok(produtos);
    }
     [Authorize]
    [HttpGet("{codProduto:int}")]
    public async Task<ActionResult<ProdutosReadDto>> BuscarPorCodigo(int codProduto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codProd AS CodProduto,
                descProd AS DescProd,
                NCMSHPROD AS NcmshProd,
                undProd AS UndProd,
                pesoBruto AS PesoProd,
                pesoLiq AS PesoLiq,
                saldoProd AS SaldoProd,
                custoMedioProd AS CustoMedioProd,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM produtos
            WHERE codProd = @codProd
            """;
        command.Parameters.AddWithValue("@codProd", codProduto);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearProduto(reader));
        }
        else
        {
            return NotFound();
        }
    }
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] ProdutosCreateDto produtoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        
        command.CommandText = """
            INSERT INTO produtos ( descProd, NCMSHPROD, undProd, pesoBruto, pesoLiq, saldoProd, custoMedioProd)
            VALUES ( @descProd, @NCMSHPROD, @undProd, @pesoBruto, @pesoLiq, @saldoProd, @custoMedioProd);
            """;

        command.Parameters.AddWithValue("@descProd", produtoDto.DescProd);
        command.Parameters.AddWithValue("@NCMSHPROD", produtoDto.NcmshProd);
        command.Parameters.AddWithValue("@undProd", produtoDto.UndProd.HasValue ? produtoDto.UndProd.Value : DBNull.Value);
        command.Parameters.AddWithValue("@pesoBruto", produtoDto.PesoProd.HasValue ? produtoDto.PesoProd.Value : 0m);
        command.Parameters.AddWithValue("@pesoLiq", produtoDto.PesoLiq.HasValue ? produtoDto.PesoLiq.Value : 0m);
        command.Parameters.AddWithValue("@saldoProd", produtoDto.SaldoProd.HasValue ? produtoDto.SaldoProd.Value : 0m);
        command.Parameters.AddWithValue("@custoMedioProd", produtoDto.CustoMedioProd.HasValue ? produtoDto.CustoMedioProd.Value : 0m);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return Ok("Produto criado com sucesso");
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o produto.");
        }
    }
     [Authorize]
    [HttpPatch("{codProduto:int}")]
    public async Task<ActionResult> Atualizar(int codProduto, [FromBody] ProdutosUpdateDto produtoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (produtoDto.DescProd != null) updates.Add("descProd = @descProd");
        if (produtoDto.NcmshProd != null) updates.Add("NCMSHPROD = @NCMSHPROD");
        if (produtoDto.UndProd.HasValue) updates.Add("undProd = @undProd");
        if (produtoDto.PesoProd.HasValue) updates.Add("pesoBruto = @pesoBruto");
        if (produtoDto.PesoLiq.HasValue) updates.Add("pesoLiq = @pesoLiq");
        if (produtoDto.SaldoProd.HasValue) updates.Add("saldoProd = @saldoProd");
        if (produtoDto.CustoMedioProd.HasValue) updates.Add("custoMedioProd = @custoMedioProd");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE produtos SET {updateClause} WHERE codProd = @codProd";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codProd", codProduto);
        if (produtoDto.DescProd != null) command.Parameters.AddWithValue("@descProd", produtoDto.DescProd);
        if (produtoDto.NcmshProd != null) command.Parameters.AddWithValue("@NCMSHPROD", produtoDto.NcmshProd);
        if (produtoDto.UndProd.HasValue) command.Parameters.AddWithValue("@undProd", produtoDto.UndProd.Value);
        if (produtoDto.PesoProd.HasValue) command.Parameters.AddWithValue("@pesoBruto", produtoDto.PesoProd.Value);
        if (produtoDto.PesoLiq.HasValue) command.Parameters.AddWithValue("@pesoLiq", produtoDto.PesoLiq.Value);
        if (produtoDto.SaldoProd.HasValue) command.Parameters.AddWithValue("@saldoProd", produtoDto.SaldoProd.Value);
        if (produtoDto.CustoMedioProd.HasValue) command.Parameters.AddWithValue("@custoMedioProd", produtoDto.CustoMedioProd.Value);

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
    [HttpDelete("{codProduto:int}")]
    public async Task<ActionResult> Deletar(int codProduto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM produtos WHERE codProd = @codProd";
        command.Parameters.AddWithValue("@codProd", codProduto);

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

    private static ProdutosReadDto MapearProduto(MySqlDataReader reader)
    {
        return new ProdutosReadDto
        {
            CodProduto = reader.GetInt32("CodProduto"),
            DescProd = reader.IsDBNull(reader.GetOrdinal("DescProd")) ? string.Empty : reader.GetString("DescProd"),
            NcmshProd = reader.IsDBNull(reader.GetOrdinal("NcmshProd")) ? string.Empty : reader.GetString("NcmshProd"),
            UndProd = reader.IsDBNull(reader.GetOrdinal("UndProd")) ? null : reader.GetInt32("UndProd"),
            PesoProd = reader.IsDBNull(reader.GetOrdinal("PesoProd")) ? 0m : reader.GetDecimal("PesoProd"),
            PesoLiq = reader.IsDBNull(reader.GetOrdinal("PesoLiq")) ? 0m : reader.GetDecimal("PesoLiq"),
            SaldoProd = reader.IsDBNull(reader.GetOrdinal("SaldoProd")) ? 0m : reader.GetDecimal("SaldoProd"),
            CustoMedioProd = reader.IsDBNull(reader.GetOrdinal("CustoMedioProd")) ? 0m : reader.GetDecimal("CustoMedioProd"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }
}

