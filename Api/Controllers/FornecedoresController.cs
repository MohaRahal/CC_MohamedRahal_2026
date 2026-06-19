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
                codForn,
                fornecedor,
                apelido_NomeFantasia,
                ender,
                numero,
                complemento,
                bairro,
                codCidade,
                cep,
                site,
                fone,
                email,
                codCondPagamento,
                limiteCredito,
                rg_inscEst,
                tipoPessoa,
                cpf_cnpj,
                criado_em,
                atualizado_em
            FROM fornecedores
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
                codForn,
                fornecedor,
                apelido_NomeFantasia,
                ender,
                numero,
                complemento,
                bairro,
                codCidade,
                cep,
                site,
                fone,
                email,
                codCondPagamento,
                limiteCredito,
                rg_inscEst,
                tipoPessoa,
                cpf_cnpj,
                criado_em,
                atualizado_em
            FROM fornecedores
            WHERE codForn = @codForn
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
        return new FornecedoresReadDto
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
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };
    }
}
