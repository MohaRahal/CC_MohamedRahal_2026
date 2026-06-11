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
     [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<FornecedoresReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var fornecedores = new List<FornecedoresReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codForn AS CodForn,
                RazaoSocial AS RazaoSocial,
                ender AS Endereco,
                bairro AS Bairro,
                codCidade AS CodCidade,
                cep AS Cep,
                fone AS Fone,
                email AS Email,
                inscEst AS InscEst,
                InscEstSubTrib AS InscEstSubTrib,
                cnpj AS Cnpj,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM fornecedores
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            fornecedores.Add(MapearFornecedor(reader));
        }
        return Ok(fornecedores);
    }
     [Authorize]
    [HttpGet("{codForn:int}")]
    public async Task<ActionResult<FornecedoresReadDto>> BuscarPorCodigo(int codForn, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codForn AS CodForn,
                RazaoSocial AS RazaoSocial,
                ender AS Endereco,
                bairro AS Bairro,
                codCidade AS CodCidade,
                cep AS Cep,
                fone AS Fone,
                email AS Email,
                inscEst AS InscEst,
                InscEstSubTrib AS InscEstSubTrib,
                cnpj AS Cnpj,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
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
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] FornecedoresCreateDto fornDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO fornecedores (RazaoSocial, ender, bairro, codCidade, cep, fone, email, inscEst, InscEstSubTrib, cnpj)
            VALUES (@RazaoSocial, @ender, @bairro, @codCidade, @cep, @fone, @email, @inscEst, @InscEstSubTrib, @cnpj);
            """;
        command.Parameters.AddWithValue("@RazaoSocial", fornDto.RazaoSocial);
        command.Parameters.AddWithValue("@ender", fornDto.Endereco);
        command.Parameters.AddWithValue("@bairro", fornDto.Bairro);
        command.Parameters.AddWithValue("@codCidade", fornDto.CodCidade.HasValue ? fornDto.CodCidade.Value : DBNull.Value);
        command.Parameters.AddWithValue("@cep", fornDto.Cep);
        command.Parameters.AddWithValue("@fone", fornDto.Fone);
        command.Parameters.AddWithValue("@email", fornDto.Email);
        command.Parameters.AddWithValue("@inscEst", fornDto.InscEst);
        command.Parameters.AddWithValue("@InscEstSubTrib", fornDto.InscEstSubTrib);
        command.Parameters.AddWithValue("@cnpj", fornDto.Cnpj);

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
     [Authorize]
    [HttpPatch("{codForn:int}")]
    public async Task<ActionResult> Atualizar(int codForn, [FromBody] FornecedoresUpdateDto fornDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (fornDto.RazaoSocial != null) updates.Add("RazaoSocial = @RazaoSocial");
        if (fornDto.Endereco != null) updates.Add("ender = @ender");
        if (fornDto.Bairro != null) updates.Add("bairro = @bairro");
        if (fornDto.CodCidade.HasValue) updates.Add("codCidade = @codCidade");
        if (fornDto.Cep != null) updates.Add("cep = @cep");
        if (fornDto.Fone != null) updates.Add("fone = @fone");
        if (fornDto.Email != null) updates.Add("email = @email");
        if (fornDto.InscEst != null) updates.Add("inscEst = @inscEst");
        if (fornDto.InscEstSubTrib != null) updates.Add("InscEstSubTrib = @InscEstSubTrib");
        if (fornDto.Cnpj != null) updates.Add("cnpj = @cnpj");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE fornecedores SET {updateClause} WHERE codForn = @codForn";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codForn", codForn);
        if (fornDto.RazaoSocial != null) command.Parameters.AddWithValue("@RazaoSocial", fornDto.RazaoSocial);
        if (fornDto.Endereco != null) command.Parameters.AddWithValue("@ender", fornDto.Endereco);
        if (fornDto.Bairro != null) command.Parameters.AddWithValue("@bairro", fornDto.Bairro);
        if (fornDto.CodCidade.HasValue) command.Parameters.AddWithValue("@codCidade", fornDto.CodCidade.Value);
        if (fornDto.Cep != null) command.Parameters.AddWithValue("@cep", fornDto.Cep);
        if (fornDto.Fone != null) command.Parameters.AddWithValue("@fone", fornDto.Fone);
        if (fornDto.Email != null) command.Parameters.AddWithValue("@email", fornDto.Email);
        if (fornDto.InscEst != null) command.Parameters.AddWithValue("@inscEst", fornDto.InscEst);
        if (fornDto.InscEstSubTrib != null) command.Parameters.AddWithValue("@InscEstSubTrib", fornDto.InscEstSubTrib);
        if (fornDto.Cnpj != null) command.Parameters.AddWithValue("@cnpj", fornDto.Cnpj);

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
            CodForn = reader.GetInt32("CodForn"),
            RazaoSocial = reader.IsDBNull(reader.GetOrdinal("RazaoSocial")) ? string.Empty : reader.GetString("RazaoSocial"),
            Endereco = reader.IsDBNull(reader.GetOrdinal("Endereco")) ? string.Empty : reader.GetString("Endereco"),
            Bairro = reader.IsDBNull(reader.GetOrdinal("Bairro")) ? string.Empty : reader.GetString("Bairro"),
            CodCidade = reader.IsDBNull(reader.GetOrdinal("CodCidade")) ? null : reader.GetInt32("CodCidade"),
            Cep = reader.IsDBNull(reader.GetOrdinal("Cep")) ? string.Empty : reader.GetString("Cep"),
            Fone = reader.IsDBNull(reader.GetOrdinal("Fone")) ? string.Empty : reader.GetString("Fone"),
            Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? string.Empty : reader.GetString("Email"),
            InscEst = reader.IsDBNull(reader.GetOrdinal("InscEst")) ? string.Empty : reader.GetString("InscEst"),
            InscEstSubTrib = reader.IsDBNull(reader.GetOrdinal("InscEstSubTrib")) ? string.Empty : reader.GetString("InscEstSubTrib"),
            Cnpj = reader.IsDBNull(reader.GetOrdinal("Cnpj")) ? string.Empty : reader.GetString("Cnpj"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }
}
