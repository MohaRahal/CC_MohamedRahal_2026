using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NcmshController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public NcmshController(MySqlConnection connection)
    {
        _connection = connection;
    }
     [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<NcmshReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var ncms = new List<NcmshReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                ncmSh AS Codigo,
                aliqIcmsProdNFe AS AliqIcmsProdNfe,
                aliqIpiProdNFe AS AliqIpiProdNfe,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM ncm_sh
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            ncms.Add(MapearNcmsh(reader));
        }
        return Ok(ncms);
    }
     [Authorize]
    [HttpGet("{codigo}")]
    public async Task<ActionResult<NcmshReadDto>> BuscarPorCodigo(string codigo, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                ncmSh AS Codigo,
                aliqIcmsProdNFe AS AliqIcmsProdNfe,
                aliqIpiProdNFe AS AliqIpiProdNfe,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM ncm_sh
            WHERE ncmSh = @ncmSh
            """;
        command.Parameters.AddWithValue("@ncmSh", codigo);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearNcmsh(reader));
        }
        else
        {
            return NotFound();
        }
    }
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] NcmshCreateDto ncmshDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO ncm_sh (ncmSh, aliqIcmsProdNFe, aliqIpiProdNFe)
            VALUES (@ncmSh, @aliqIcmsProdNFe, @aliqIpiProdNFe);
            """;
        command.Parameters.AddWithValue("@ncmSh", ncmshDto.Codigo);
        command.Parameters.AddWithValue("@aliqIcmsProdNFe", ncmshDto.AliqIcmsProdNfe.HasValue ? ncmshDto.AliqIcmsProdNfe.Value : DBNull.Value);
        command.Parameters.AddWithValue("@aliqIpiProdNFe", ncmshDto.AliqIpiProdNfe.HasValue ? ncmshDto.AliqIpiProdNfe.Value : DBNull.Value);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codigo = ncmshDto.Codigo }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o NCM/SH.");
        }
    }
     [Authorize]
    [HttpPatch("{codigo}")]
    public async Task<ActionResult> Atualizar(string codigo, [FromBody] NcmshUpdateDto ncmshDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (ncmshDto.AliqIcmsProdNfe.HasValue) updates.Add("aliqIcmsProdNFe = @aliqIcmsProdNFe");
        if (ncmshDto.AliqIpiProdNfe.HasValue) updates.Add("aliqIpiProdNFe = @aliqIpiProdNFe");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE ncm_sh SET {updateClause} WHERE ncmSh = @ncmSh";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@ncmSh", codigo);
        if (ncmshDto.AliqIcmsProdNfe.HasValue) command.Parameters.AddWithValue("@aliqIcmsProdNFe", ncmshDto.AliqIcmsProdNfe.Value);
        if (ncmshDto.AliqIpiProdNfe.HasValue) command.Parameters.AddWithValue("@aliqIpiProdNFe", ncmshDto.AliqIpiProdNfe.Value);

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
    [HttpDelete("{codigo}")]
    public async Task<ActionResult> Deletar(string codigo, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM ncm_sh WHERE ncmSh = @ncmSh";
        command.Parameters.AddWithValue("@ncmSh", codigo);

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

    private static NcmshReadDto MapearNcmsh(MySqlDataReader reader)
    {
        return new NcmshReadDto
        {
            Codigo = reader.GetString("Codigo"),
            AliqIcmsProdNfe = reader.IsDBNull(reader.GetOrdinal("AliqIcmsProdNfe")) ? 0m : reader.GetDecimal("AliqIcmsProdNfe"),
            AliqIpiProdNfe = reader.IsDBNull(reader.GetOrdinal("AliqIpiProdNfe")) ? 0m : reader.GetDecimal("AliqIpiProdNfe"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }
}
