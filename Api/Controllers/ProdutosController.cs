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
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<ProdutosReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var produtos = new List<ProdutosReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                p.codProd,
                p.produto,
                p.codMarca,
                m.marca AS m_marca,
                m.criado_em AS m_criado_em,
                m.atualizado_em AS m_atualizado_em,
                p.codGrupo,
                g.grupo AS g_grupo,
                g.criado_em AS g_criado_em,
                g.atualizado_em AS g_atualizado_em,
                p.codUnidade,
                um.unidade AS um_unidade,
                um.criado_em AS um_criado_em,
                um.atualizado_em AS um_atualizado_em,
                p.codigoBarras,
                p.pesoBruto,
                p.pesoLiq,
                p.saldoProd,
                p.precoVenda,
                p.precoCompra,
                p.custoMedioProd,
                p.codUsuario,
                p.criado_em,
                p.atualizado_em,
                u.codUsuario AS u_codUsuario,
                u.usuario AS u_usuario,
                u.codFuncionario AS u_codFuncionario,
                u.codCargo AS u_codCargo,
                u.ativo AS u_ativo,
                u.criado_em AS u_criado_em,
                u.atualizado_em AS u_atualizado_em
            FROM produtos p
            LEFT JOIN unidades_medidas um ON p.codUnidade = um.codUnidade
            LEFT JOIN marcas m ON p.codMarca = m.codMarca
            LEFT JOIN grupos g ON p.codGrupo = g.codGrupo
            LEFT JOIN usuarios u ON p.codUsuario = u.codUsuario
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            produtos.Add(MapearProduto(reader));
        }
        return Ok(produtos);
    }
////[Authorize]
    [HttpGet("{codProd:int}")]
    public async Task<ActionResult<ProdutosReadDto>> BuscarPorCodigo(int codProd, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                p.codProd,
                p.produto,
                p.codMarca,
                m.marca AS m_marca,
                m.criado_em AS m_criado_em,
                m.atualizado_em AS m_atualizado_em,
                p.codGrupo,
                g.grupo AS g_grupo,
                g.criado_em AS g_criado_em,
                g.atualizado_em AS g_atualizado_em,
                p.codUnidade,
                um.unidade AS um_unidade,
                um.criado_em AS um_criado_em,
                um.atualizado_em AS um_atualizado_em,
                p.codigoBarras,
                p.pesoBruto,
                p.pesoLiq,
                p.saldoProd,
                p.precoVenda,
                p.precoCompra,
                p.custoMedioProd,
                p.codUsuario,
                p.criado_em,
                p.atualizado_em,
                u.codUsuario AS u_codUsuario,
                u.usuario AS u_usuario,
                u.codFuncionario AS u_codFuncionario,
                u.codCargo AS u_codCargo,
                u.ativo AS u_ativo,
                u.criado_em AS u_criado_em,
                u.atualizado_em AS u_atualizado_em
            FROM produtos p
            LEFT JOIN unidades_medidas um ON p.codUnidade = um.codUnidade
            LEFT JOIN marcas m ON p.codMarca = m.codMarca
            LEFT JOIN grupos g ON p.codGrupo = g.codGrupo
            LEFT JOIN usuarios u ON p.codUsuario = u.codUsuario
            WHERE p.codProd = @codProd
            """;
        command.Parameters.AddWithValue("@codProd", codProd);

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
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] ProdutosCreateDto produtoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        
        command.CommandText = """
            INSERT INTO produtos (produto, codMarca, codGrupo, codUnidade, codigoBarras, pesoBruto, pesoLiq, saldoProd, precoVenda, precoCompra, custoMedioProd, codUsuario)
            VALUES (@produto, @codMarca, @codGrupo, @codUnidade, @codigoBarras, @pesoBruto, @pesoLiq, @saldoProd, @precoVenda, @precoCompra, @custoMedioProd, @codUsuario);
            """;

        command.Parameters.AddWithValue("@produto", string.IsNullOrEmpty(produtoDto.produto) ? (object)DBNull.Value : produtoDto.produto);
        command.Parameters.AddWithValue("@codMarca", produtoDto.codMarca);
        command.Parameters.AddWithValue("@codGrupo", produtoDto.codGrupo);
        command.Parameters.AddWithValue("@codUnidade", produtoDto.codUnidade);
        command.Parameters.AddWithValue("@codigoBarras", produtoDto.codigoBarras);
        command.Parameters.AddWithValue("@pesoBruto", produtoDto.pesoBruto.HasValue ? produtoDto.pesoBruto.Value : DBNull.Value);
        command.Parameters.AddWithValue("@pesoLiq", produtoDto.pesoLiq.HasValue ? produtoDto.pesoLiq.Value : DBNull.Value);
        command.Parameters.AddWithValue("@saldoProd", produtoDto.saldoProd.HasValue ? produtoDto.saldoProd.Value : DBNull.Value);
        command.Parameters.AddWithValue("@precoVenda", produtoDto.precoVenda);
        command.Parameters.AddWithValue("@precoCompra", produtoDto.precoCompra);
        command.Parameters.AddWithValue("@custoMedioProd", produtoDto.custoMedioProd.HasValue ? produtoDto.custoMedioProd.Value : DBNull.Value);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codProd = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o produto.");
        }
    }
////[Authorize]
    [HttpPatch("{codProd:int}")]
    public async Task<ActionResult> Atualizar(int codProd, [FromBody] ProdutosUpdateDto produtoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (produtoDto.produto != null) updates.Add("produto = @produto");
        if (produtoDto.codMarca.HasValue) updates.Add("codMarca = @codMarca");
        if (produtoDto.codGrupo.HasValue) updates.Add("codGrupo = @codGrupo");
        if (produtoDto.codUnidade.HasValue) updates.Add("codUnidade = @codUnidade");
        if (produtoDto.codigoBarras != null) updates.Add("codigoBarras = @codigoBarras");
        if (produtoDto.pesoBruto.HasValue) updates.Add("pesoBruto = @pesoBruto");
        if (produtoDto.pesoLiq.HasValue) updates.Add("pesoLiq = @pesoLiq");
        if (produtoDto.saldoProd.HasValue) updates.Add("saldoProd = @saldoProd");
        if (produtoDto.precoVenda.HasValue) updates.Add("precoVenda = @precoVenda");
        if (produtoDto.precoCompra.HasValue) updates.Add("precoCompra = @precoCompra");
        if (produtoDto.custoMedioProd.HasValue) updates.Add("custoMedioProd = @custoMedioProd");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE produtos SET {updateClause} WHERE codProd = @codProd";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codProd", codProd);
        
        if (produtoDto.produto != null) command.Parameters.AddWithValue("@produto", produtoDto.produto);
        if (produtoDto.codMarca.HasValue) command.Parameters.AddWithValue("@codMarca", produtoDto.codMarca.Value);
        if (produtoDto.codGrupo.HasValue) command.Parameters.AddWithValue("@codGrupo", produtoDto.codGrupo.Value);
        if (produtoDto.codUnidade.HasValue) command.Parameters.AddWithValue("@codUnidade", produtoDto.codUnidade.Value);
        if (produtoDto.codigoBarras != null) command.Parameters.AddWithValue("@codigoBarras", produtoDto.codigoBarras);
        if (produtoDto.pesoBruto.HasValue) command.Parameters.AddWithValue("@pesoBruto", produtoDto.pesoBruto.Value);
        if (produtoDto.pesoLiq.HasValue) command.Parameters.AddWithValue("@pesoLiq", produtoDto.pesoLiq.Value);
        if (produtoDto.saldoProd.HasValue) command.Parameters.AddWithValue("@saldoProd", produtoDto.saldoProd.Value);
        if (produtoDto.precoVenda.HasValue) command.Parameters.AddWithValue("@precoVenda", produtoDto.precoVenda.Value);
        if (produtoDto.precoCompra.HasValue) command.Parameters.AddWithValue("@precoCompra", produtoDto.precoCompra.Value);
        if (produtoDto.custoMedioProd.HasValue) command.Parameters.AddWithValue("@custoMedioProd", produtoDto.custoMedioProd.Value);

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
    [HttpDelete("{codProd:int}")]
    public async Task<ActionResult> Deletar(int codProd, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM produtos WHERE codProd = @codProd";
        command.Parameters.AddWithValue("@codProd", codProd);

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
        var dto = new ProdutosReadDto
        {
            codProd = reader.GetInt32("codProd"),
            produto = reader.IsDBNull(reader.GetOrdinal("produto")) ? string.Empty : reader.GetString("produto"),
            codMarca = reader.GetInt32("codMarca"),
            codGrupo = reader.GetInt32("codGrupo"),
            codUnidade = reader.GetInt32("codUnidade"),
            codigoBarras = reader.GetString("codigoBarras"),
            pesoBruto = reader.IsDBNull(reader.GetOrdinal("pesoBruto")) ? null : reader.GetDecimal("pesoBruto"),
            pesoLiq = reader.IsDBNull(reader.GetOrdinal("pesoLiq")) ? null : reader.GetDecimal("pesoLiq"),
            saldoProd = reader.IsDBNull(reader.GetOrdinal("saldoProd")) ? null : reader.GetDecimal("saldoProd"),
            precoVenda = reader.GetDecimal("precoVenda"),
            precoCompra = reader.GetDecimal("precoCompra"),
            custoMedioProd = reader.IsDBNull(reader.GetOrdinal("custoMedioProd")) ? null : reader.GetDecimal("custoMedioProd"),
            codUsuario = reader.IsDBNull(reader.GetOrdinal("codUsuario")) ? 0 : reader.GetInt32("codUsuario"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };

        if (!reader.IsDBNull(reader.GetOrdinal("m_marca")))
        {
            dto.Marca = new MarcaReadDto
            {
                codMarca = dto.codMarca,
                marca = reader.GetString("m_marca"),
                criado_em = reader.GetDateTime("m_criado_em"),
                atualizado_em = reader.GetDateTime("m_atualizado_em")
            };
        }

        if (!reader.IsDBNull(reader.GetOrdinal("g_grupo")))
        {
            dto.Grupo = new GrupoReadDto
            {
                codGrupo = dto.codGrupo,
                grupo = reader.GetString("g_grupo"),
                criado_em = reader.GetDateTime("g_criado_em"),
                atualizado_em = reader.GetDateTime("g_atualizado_em")
            };
        }

        if (!reader.IsDBNull(reader.GetOrdinal("um_unidade")))
        {
            dto.Unidade = new UnidadeMedidaReadDto
            {
                codUnidade = dto.codUnidade,
                unidade = reader.GetString("um_unidade"),
                criado_em = reader.GetDateTime("um_criado_em"),
                atualizado_em = reader.GetDateTime("um_atualizado_em")
            };
        }

        if (!reader.IsDBNull(reader.GetOrdinal("u_codUsuario")))
        {
            dto.Usuario = new UsuarioReadDto
            {
                codUsuario = reader.GetInt32("u_codUsuario"),
                usuario = reader.GetString("u_usuario"),
                codFuncionario = reader.IsDBNull(reader.GetOrdinal("u_codFuncionario")) ? 0 : reader.GetInt32("u_codFuncionario"),
                codCargo = reader.IsDBNull(reader.GetOrdinal("u_codCargo")) ? 0 : reader.GetInt32("u_codCargo"),
                ativo = reader.GetBoolean("u_ativo"),
                criado_em = reader.GetDateTime("u_criado_em"),
                atualizado_em = reader.GetDateTime("u_atualizado_em")
            };
        }

        return dto;
    }
}
