using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FornecedoresController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public FornecedoresController(MySqlConnection connection)
    {
        _connection = connection;
    }
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<FornecedoresReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var fornecedores = new List<FornecedoresReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                f.codForn,
                f.fornecedor,
                f.apelido_NomeFantasia,
                f.ender,
                f.numero,
                f.complemento,
                f.bairro,
                f.codCidade,
                f.cep,
                f.site,
                f.fone,
                f.email,
                f.codCondPagamento,
                f.limiteCredito,
                f.rg_inscEst,
                f.tipoPessoa,
                f.cpf_cnpj,
                f.codUsuario,
                f.criado_em,
                f.atualizado_em,
                c.codCidade AS Cidade_codCidade,
                c.cidade AS Cidade_cidade,
                c.codEstado AS Cidade_codEstado,
                c.codUsuario AS Cidade_codUsuario,
                c.criado_em AS Cidade_criado_em,
                c.atualizado_em AS Cidade_atualizado_em,
                cp.codCondPagamento AS Condicao_codCondPagamento,
                cp.condPagamento AS Condicao_condPagamento,
                cp.qtdParcelas AS Condicao_qtdParcelas,
                cp.ativo AS Condicao_ativo,
                cp.juros AS Condicao_juros,
                cp.multa AS Condicao_multa,
                cp.desconto AS Condicao_desconto,
                cp.criado_em AS Condicao_criado_em,
                cp.atualizado_em AS Condicao_atualizado_em,
                u.codUsuario AS Usuario_codUsuario,
                u.usuario AS Usuario_usuario,
                u.codFuncionario AS Usuario_codFuncionario,
                u.codCargo AS Usuario_codCargo,
                u.ativo AS Usuario_ativo,
                u.criado_em AS Usuario_criado_em,
                u.atualizado_em AS Usuario_atualizado_em
            FROM fornecedores f
            LEFT JOIN cidades c ON f.codCidade = c.codCidade
            LEFT JOIN condicoes_pagamento cp ON f.codCondPagamento = cp.codCondPagamento
            LEFT JOIN usuarios u ON f.codUsuario = u.codUsuario
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            fornecedores.Add(MapearFornecedor(reader));
        }
        return Ok(fornecedores);
    }
////[Authorize]
    [HttpGet("{codForn:int}")]
    public async Task<ActionResult<FornecedoresReadDto>> BuscarPorCodigo(int codForn, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                f.codForn,
                f.fornecedor,
                f.apelido_NomeFantasia,
                f.ender,
                f.numero,
                f.complemento,
                f.bairro,
                f.codCidade,
                f.cep,
                f.site,
                f.fone,
                f.email,
                f.codCondPagamento,
                f.limiteCredito,
                f.rg_inscEst,
                f.tipoPessoa,
                f.cpf_cnpj,
                f.codUsuario,
                f.criado_em,
                f.atualizado_em,
                c.codCidade AS Cidade_codCidade,
                c.cidade AS Cidade_cidade,
                c.codEstado AS Cidade_codEstado,
                c.codUsuario AS Cidade_codUsuario,
                c.criado_em AS Cidade_criado_em,
                c.atualizado_em AS Cidade_atualizado_em,
                cp.codCondPagamento AS Condicao_codCondPagamento,
                cp.condPagamento AS Condicao_condPagamento,
                cp.qtdParcelas AS Condicao_qtdParcelas,
                cp.ativo AS Condicao_ativo,
                cp.juros AS Condicao_juros,
                cp.multa AS Condicao_multa,
                cp.desconto AS Condicao_desconto,
                cp.criado_em AS Condicao_criado_em,
                cp.atualizado_em AS Condicao_atualizado_em,
                u.codUsuario AS Usuario_codUsuario,
                u.usuario AS Usuario_usuario,
                u.codFuncionario AS Usuario_codFuncionario,
                u.codCargo AS Usuario_codCargo,
                u.ativo AS Usuario_ativo,
                u.criado_em AS Usuario_criado_em,
                u.atualizado_em AS Usuario_atualizado_em
            FROM fornecedores f
            LEFT JOIN cidades c ON f.codCidade = c.codCidade
            LEFT JOIN condicoes_pagamento cp ON f.codCondPagamento = cp.codCondPagamento
            LEFT JOIN usuarios u ON f.codUsuario = u.codUsuario
            WHERE f.codForn = @codForn
            """;
        command.Parameters.AddWithValue("@codForn", codForn);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearFornecedor(reader));
        }
        else
        {
            return NotFound();
        }
    }
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] FornecedoresCreateDto fornDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO fornecedores (fornecedor, apelido_NomeFantasia, ender, numero, complemento, bairro, codCidade, cep, site, fone, email, codCondPagamento, limiteCredito, rg_inscEst, tipoPessoa, cpf_cnpj, codUsuario)
            VALUES (@fornecedor, @apelido_NomeFantasia, @ender, @numero, @complemento, @bairro, @codCidade, @cep, @site, @fone, @email, @codCondPagamento, @limiteCredito, @rg_inscEst, @tipoPessoa, @cpf_cnpj, @codUsuario);
            """;
        
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        command.Parameters.AddWithValue("@fornecedor", string.IsNullOrEmpty(fornDto.fornecedor) ? (object)DBNull.Value : fornDto.fornecedor);
        command.Parameters.AddWithValue("@apelido_NomeFantasia", fornDto.apelido_NomeFantasia);
        command.Parameters.AddWithValue("@ender", string.IsNullOrEmpty(fornDto.ender) ? (object)DBNull.Value : fornDto.ender);
        command.Parameters.AddWithValue("@numero", string.IsNullOrEmpty(fornDto.numero) ? (object)DBNull.Value : fornDto.numero);
        command.Parameters.AddWithValue("@complemento", string.IsNullOrEmpty(fornDto.complemento) ? (object)DBNull.Value : fornDto.complemento);
        command.Parameters.AddWithValue("@bairro", string.IsNullOrEmpty(fornDto.bairro) ? (object)DBNull.Value : fornDto.bairro);
        command.Parameters.AddWithValue("@codCidade", fornDto.codCidade > 0 ? fornDto.codCidade : DBNull.Value);
        command.Parameters.AddWithValue("@cep", string.IsNullOrEmpty(fornDto.cep) ? (object)DBNull.Value : fornDto.cep);
        command.Parameters.AddWithValue("@site", string.IsNullOrEmpty(fornDto.site) ? (object)DBNull.Value : fornDto.site);
        command.Parameters.AddWithValue("@fone", string.IsNullOrEmpty(fornDto.fone) ? (object)DBNull.Value : fornDto.fone);
        command.Parameters.AddWithValue("@email", string.IsNullOrEmpty(fornDto.email) ? (object)DBNull.Value : fornDto.email);
        command.Parameters.AddWithValue("@codCondPagamento", fornDto.codCondPagamento);
        command.Parameters.AddWithValue("@limiteCredito", fornDto.limiteCredito);
        command.Parameters.AddWithValue("@rg_inscEst", string.IsNullOrEmpty(fornDto.rg_inscEst) ? (object)DBNull.Value : fornDto.rg_inscEst);
        command.Parameters.AddWithValue("@tipoPessoa", fornDto.tipoPessoa);
        command.Parameters.AddWithValue("@cpf_cnpj", string.IsNullOrEmpty(fornDto.cpf_cnpj) ? (object)DBNull.Value : fornDto.cpf_cnpj);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codForn = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o fornecedor.");
        }
    }
////[Authorize]
    [HttpPatch("{codForn:int}")]
    public async Task<ActionResult> Atualizar(int codForn, [FromBody] FornecedoresUpdateDto fornDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (fornDto.fornecedor != null) updates.Add("fornecedor = @fornecedor");
        if (fornDto.apelido_NomeFantasia != null) updates.Add("apelido_NomeFantasia = @apelido_NomeFantasia");
        if (fornDto.ender != null) updates.Add("ender = @ender");
        if (fornDto.numero != null) updates.Add("numero = @numero");
        if (fornDto.complemento != null) updates.Add("complemento = @complemento");
        if (fornDto.bairro != null) updates.Add("bairro = @bairro");
        if (fornDto.codCidade.HasValue) updates.Add("codCidade = @codCidade");
        if (fornDto.cep != null) updates.Add("cep = @cep");
        if (fornDto.site != null) updates.Add("site = @site");
        if (fornDto.fone != null) updates.Add("fone = @fone");
        if (fornDto.email != null) updates.Add("email = @email");
        if (fornDto.codCondPagamento.HasValue) updates.Add("codCondPagamento = @codCondPagamento");
        if (fornDto.limiteCredito.HasValue) updates.Add("limiteCredito = @limiteCredito");
        if (fornDto.rg_inscEst != null) updates.Add("rg_inscEst = @rg_inscEst");
        if (fornDto.tipoPessoa != null) updates.Add("tipoPessoa = @tipoPessoa");
        if (fornDto.cpf_cnpj != null) updates.Add("cpf_cnpj = @cpf_cnpj");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE fornecedores SET {updateClause} WHERE codForn = @codForn";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codForn", codForn);
        
        if (fornDto.fornecedor != null) command.Parameters.AddWithValue("@fornecedor", fornDto.fornecedor);
        if (fornDto.apelido_NomeFantasia != null) command.Parameters.AddWithValue("@apelido_NomeFantasia", fornDto.apelido_NomeFantasia);
        if (fornDto.ender != null) command.Parameters.AddWithValue("@ender", fornDto.ender);
        if (fornDto.numero != null) command.Parameters.AddWithValue("@numero", fornDto.numero);
        if (fornDto.complemento != null) command.Parameters.AddWithValue("@complemento", fornDto.complemento);
        if (fornDto.bairro != null) command.Parameters.AddWithValue("@bairro", fornDto.bairro);
        if (fornDto.codCidade.HasValue) command.Parameters.AddWithValue("@codCidade", fornDto.codCidade.Value);
        if (fornDto.cep != null) command.Parameters.AddWithValue("@cep", fornDto.cep);
        if (fornDto.site != null) command.Parameters.AddWithValue("@site", fornDto.site);
        if (fornDto.fone != null) command.Parameters.AddWithValue("@fone", fornDto.fone);
        if (fornDto.email != null) command.Parameters.AddWithValue("@email", fornDto.email);
        if (fornDto.codCondPagamento.HasValue) command.Parameters.AddWithValue("@codCondPagamento", fornDto.codCondPagamento.Value);
        if (fornDto.limiteCredito.HasValue) command.Parameters.AddWithValue("@limiteCredito", fornDto.limiteCredito.Value);
        if (fornDto.rg_inscEst != null) command.Parameters.AddWithValue("@rg_inscEst", fornDto.rg_inscEst);
        if (fornDto.tipoPessoa != null) command.Parameters.AddWithValue("@tipoPessoa", fornDto.tipoPessoa);
        if (fornDto.cpf_cnpj != null) command.Parameters.AddWithValue("@cpf_cnpj", fornDto.cpf_cnpj);

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
    [HttpDelete("{codForn:int}")]
    public async Task<ActionResult> Deletar(int codForn, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM fornecedores WHERE codForn = @codForn";
        command.Parameters.AddWithValue("@codForn", codForn);

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

    private static FornecedoresReadDto MapearFornecedor(MySqlDataReader reader)
    {
        var dto = new FornecedoresReadDto
        {
            codForn = reader.GetInt32("codForn"),
            fornecedor = reader.IsDBNull(reader.GetOrdinal("fornecedor")) ? string.Empty : reader.GetString("fornecedor"),
            apelido_NomeFantasia = reader.GetString("apelido_NomeFantasia"),
            ender = reader.IsDBNull(reader.GetOrdinal("ender")) ? string.Empty : reader.GetString("ender"),
            numero = reader.IsDBNull(reader.GetOrdinal("numero")) ? string.Empty : reader.GetString("numero"),
            complemento = reader.IsDBNull(reader.GetOrdinal("complemento")) ? string.Empty : reader.GetString("complemento"),
            bairro = reader.IsDBNull(reader.GetOrdinal("bairro")) ? string.Empty : reader.GetString("bairro"),
            codCidade = reader.IsDBNull(reader.GetOrdinal("codCidade")) ? 0 : reader.GetInt32("codCidade"),
            cep = reader.IsDBNull(reader.GetOrdinal("cep")) ? string.Empty : reader.GetString("cep"),
            site = reader.IsDBNull(reader.GetOrdinal("site")) ? string.Empty : reader.GetString("site"),
            fone = reader.IsDBNull(reader.GetOrdinal("fone")) ? string.Empty : reader.GetString("fone"),
            email = reader.IsDBNull(reader.GetOrdinal("email")) ? string.Empty : reader.GetString("email"),
            codCondPagamento = reader.GetInt32("codCondPagamento"),
            limiteCredito = reader.GetDecimal("limiteCredito"),
            rg_inscEst = reader.IsDBNull(reader.GetOrdinal("rg_inscEst")) ? string.Empty : reader.GetString("rg_inscEst"),
            tipoPessoa = reader.GetString("tipoPessoa"),
            cpf_cnpj = reader.IsDBNull(reader.GetOrdinal("cpf_cnpj")) ? string.Empty : reader.GetString("cpf_cnpj"),
            codUsuario = reader.IsDBNull(reader.GetOrdinal("codUsuario")) ? 0 : reader.GetInt32("codUsuario"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };

        if (!reader.IsDBNull(reader.GetOrdinal("Cidade_codCidade")))
        {
            dto.Cidade = new CidadesReadDto
            {
                codCidade = reader.GetInt32("Cidade_codCidade"),
                cidade = reader.GetString("Cidade_cidade"),
                codEstado = reader.IsDBNull(reader.GetOrdinal("Cidade_codEstado")) ? null : reader.GetInt32("Cidade_codEstado"),
                codUsuario = reader.IsDBNull(reader.GetOrdinal("Cidade_codUsuario")) ? 0 : reader.GetInt32("Cidade_codUsuario"),
                criado_em = reader.GetDateTime("Cidade_criado_em"),
                atualizado_em = reader.GetDateTime("Cidade_atualizado_em")
            };
        }

        if (!reader.IsDBNull(reader.GetOrdinal("Condicao_codCondPagamento")))
        {
            dto.CondicaoPagamento = new CondicoesPagamentoReadDto
            {
                codCondPagamento = reader.GetInt32("Condicao_codCondPagamento"),
                condPagamento = reader.GetString("Condicao_condPagamento"),
                qtdParcelas = reader.GetInt32("Condicao_qtdParcelas"),
                ativo = reader.GetBoolean("Condicao_ativo"),
                juros = reader.GetDecimal("Condicao_juros"),
                multa = reader.GetDecimal("Condicao_multa"),
                desconto = reader.GetDecimal("Condicao_desconto"),
                criado_em = reader.GetDateTime("Condicao_criado_em"),
                atualizado_em = reader.GetDateTime("Condicao_atualizado_em")
            };
        }

        if (!reader.IsDBNull(reader.GetOrdinal("Usuario_codUsuario")))
        {
            dto.Usuario = new UsuarioReadDto
            {
                codUsuario = reader.GetInt32("Usuario_codUsuario"),
                usuario = reader.GetString("Usuario_usuario"),
                codFuncionario = reader.IsDBNull(reader.GetOrdinal("Usuario_codFuncionario")) ? 0 : reader.GetInt32("Usuario_codFuncionario"),
                codCargo = reader.IsDBNull(reader.GetOrdinal("Usuario_codCargo")) ? 0 : reader.GetInt32("Usuario_codCargo"),
                ativo = reader.GetBoolean("Usuario_ativo"),
                criado_em = reader.GetDateTime("Usuario_criado_em"),
                atualizado_em = reader.GetDateTime("Usuario_atualizado_em")
            };
        }

        return dto;
    }
}
