using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaisesController : ControllerBase
{
    private readonly MySqlConnection _connection;

    public PaisesController(MySqlConnection connection)
    {
        _connection = connection;
    }
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<PaisesReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var paises = new List<PaisesReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codPais AS CodPais,
                Pais AS Nome,
                sigla AS Sigla,
                DDI AS Ddi,
                Moeda AS Moeda,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM paises
            """;

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);

        while (await reader.ReadAsync(cancellationToken))
        {
            paises.Add(MapearPais(reader));
        }

        return Ok(paises);
    }
     [Authorize]
    [HttpGet("{codPais:int}")]
    public async Task<ActionResult<PaisesReadDto>> BuscarPorCodigo(int codPais, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codPais AS CodPais,
                Pais AS Nome,
                sigla AS Sigla,
                DDI AS Ddi,
                Moeda AS Moeda,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM paises
            WHERE codPais = @codPais;
            """;
        command.Parameters.AddWithValue("@codPais", codPais);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);

        if (!await reader.ReadAsync(cancellationToken))
        {
            return NotFound();
        }

        return Ok(MapearPais(reader));
    }
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] PaisesCreateDto paises, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO paises (Pais,sigla, DDI, Moeda)
            VALUES (@Pais, @sigla, @DDI, @Moeda);
            """;
        command.Parameters.AddWithValue("@Pais", paises.Nome);
        command.Parameters.AddWithValue("@sigla", paises.Sigla);
        command.Parameters.AddWithValue("@DDI", paises.Ddi);
        command.Parameters.AddWithValue("@Moeda", paises.Moeda);

        await command.ExecuteNonQueryAsync(cancellationToken);
        var codPais = command.LastInsertedId;

        return CreatedAtAction(nameof(BuscarPorCodigo), new { codPais }, paises);
    }
     [Authorize]
    [HttpPatch("{codPais:int}")]
    public async Task<ActionResult> Atualizar(int codPais, [FromBody] PaisesUpdateDto paises, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        var camposAtualizados = new List<string>();

        if (paises.Nome is not null)
        {
            camposAtualizados.Add("Pais = @Pais");
            command.Parameters.AddWithValue("@Pais", paises.Nome);
        }

        if (paises.Sigla is not null)
        {
            camposAtualizados.Add("sigla = @sigla");
            command.Parameters.AddWithValue("@sigla", paises.Sigla);
        }

        if (paises.Ddi is not null)
        {
            camposAtualizados.Add("DDI = @DDI");
            command.Parameters.AddWithValue("@DDI", paises.Ddi);
        }

        if (paises.Moeda is not null)
        {
            camposAtualizados.Add("Moeda = @Moeda");
            command.Parameters.AddWithValue("@Moeda", paises.Moeda);
        }

        if (camposAtualizados.Count == 0)
        {
            return BadRequest("Informe ao menos um campo para atualizar.");
        }

        command.CommandText = $"""
            UPDATE paises
            SET {string.Join(", ", camposAtualizados)}
            WHERE codPais = @codPais;
            """;
        command.Parameters.AddWithValue("@codPais", codPais);

        var linhasAfetadas = await command.ExecuteNonQueryAsync(cancellationToken);

        if (linhasAfetadas == 0)
        {
            return NotFound();
        }

        return NoContent();
    }
     [Authorize]
    [HttpDelete("{codPais:int}")]
    public async Task<ActionResult> Deletar(int codPais, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            DELETE FROM paises
            WHERE codPais = @codPais;
            """;
        command.Parameters.AddWithValue("@codPais", codPais);

        var linhasAfetadas = await command.ExecuteNonQueryAsync(cancellationToken);

        if (linhasAfetadas == 0)
        {
            return NotFound();
        }

        return NoContent();
    }

    private static PaisesReadDto MapearPais(MySqlDataReader reader)
    {
        return new PaisesReadDto
        {
            CodPais = reader.GetInt32("CodPais"),
            Nome = ObterString(reader, "Nome"),
            Sigla = ObterString(reader, "Sigla"),
            Ddi = ObterString(reader, "Ddi"),
            Moeda = ObterString(reader, "Moeda"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }

    private static string ObterString(MySqlDataReader reader, string nomeCampo)
    {
        var valor = reader[nomeCampo];

        return valor == DBNull.Value ? string.Empty : Convert.ToString(valor) ?? string.Empty;
    }
}

