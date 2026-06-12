using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstadosController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public EstadosController(MySqlConnection connection)
    {
        _connection = connection;
    }
     [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<EstadosReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var estados = new List<EstadosReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                e.codEstado AS CodEstado,
                e.estado AS Nome,
                e.Uf AS Sigla,
                e.codPais AS CodPais,
                e.created_at AS CriadoEm,
                e.updated_at AS AtualizadoEm,
                p.codPais AS Pais_CodPais,
                p.pais AS Pais_Nome,
                p.sigla AS Pais_Sigla,
                p.DDI AS Pais_Ddi,
                p.moeda AS Pais_Moeda,
                p.created_at AS Pais_CriadoEm,
                p.updated_at AS Pais_AtualizadoEm
            FROM estados e
            LEFT JOIN paises p ON e.codPais = p.codPais
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            estados.Add(MapearEstado(reader));
        }
        return Ok(estados);
    }
     [Authorize]
    [HttpGet("{codEstado:int}")]
    public async Task<ActionResult<EstadosReadDto>> BuscarPorCodigo(int codEstado, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                e.codEstado AS CodEstado,
                e.estado AS Nome,
                e.Uf AS Sigla,
                e.codPais AS CodPais,
                e.created_at AS CriadoEm,
                e.updated_at AS AtualizadoEm,
                p.codPais AS Pais_CodPais,
                p.nome AS Pais_Nome,
                p.sigla AS Pais_Sigla,
                p.ddi AS Pais_Ddi,
                p.moeda AS Pais_Moeda,
                p.created_at AS Pais_CriadoEm,
                p.updated_at AS Pais_AtualizadoEm
            FROM estados e
            LEFT JOIN paises p ON e.codPais = p.codPais
            WHERE e.codEstado = @codEstado
            """;
        command.Parameters.AddWithValue("@codEstado", codEstado);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearEstado(reader));
        }
        else
        {
            return NotFound();
        }
    }
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] EstadosCreateDto estados, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO estados (estado, Uf, codPais)
            VALUES (@estado, @Uf, @codPais);
            """;
        command.Parameters.AddWithValue("@estado", estados.Estado);
        command.Parameters.AddWithValue("@Uf", estados.Uf);
        command.Parameters.AddWithValue("@codPais", estados.CodPais);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codEstado = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o estado.");
        }
    }
     [Authorize]
    [HttpPatch("{codEstado:int}")]
    public async Task<ActionResult> Atualizar(int codEstado, [FromBody] EstadosUpdateDto estados, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (estados.Estado != null) updates.Add("estado = @estado");
        if (estados.Uf != null) updates.Add("Uf = @Uf");
        if (estados.CodPais.HasValue) updates.Add("codPais = @codPais");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE estados SET {updateClause} WHERE codEstado = @codEstado";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codEstado", codEstado);
        if (estados.Estado != null) command.Parameters.AddWithValue("@estado", estados.Estado);
        if (estados.Uf != null) command.Parameters.AddWithValue("@Uf", estados.Uf);
        if (estados.CodPais.HasValue) command.Parameters.AddWithValue("@codPais", estados.CodPais.Value);

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
    [HttpDelete("{codEstado:int}")]
    public async Task<ActionResult> Deletar(int codEstado, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM estados WHERE codEstado = @codEstado";
        command.Parameters.AddWithValue("@codEstado", codEstado);

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
    

    private static EstadosReadDto MapearEstado(MySqlDataReader reader)
    {
        var estado = new EstadosReadDto
        {
            CodEstado = reader.GetInt32("CodEstado"),
            Estado = reader.GetString("Nome"),
            Uf = reader.GetString("Sigla"),
            CodPais = reader.IsDBNull(reader.GetOrdinal("CodPais")) ? null : reader.GetInt32("CodPais"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };

        if (!reader.IsDBNull(reader.GetOrdinal("Pais_CodPais")))
        {
            estado.Pais = new PaisesReadDto
            {
                CodPais = reader.GetInt32("Pais_CodPais"),
                Nome = reader.GetString("Pais_Nome"),
                Sigla = reader.GetString("Pais_Sigla"),
                Ddi = reader.GetString("Pais_Ddi"),
                Moeda = reader.GetString("Pais_Moeda"),
                CriadoEm = reader.GetDateTime("Pais_CriadoEm"),
                AtualizadoEm = reader.GetDateTime("Pais_AtualizadoEm")
            };
        }

        return estado;
    }
}