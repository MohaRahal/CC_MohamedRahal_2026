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
                codEstado AS CodEstado,
                estado AS Nome,
                Uf AS Sigla,
                codPais AS CodPais,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM estados
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
                codEstado AS CodEstado,
                estado AS Nome,
                Uf AS Sigla,
                codPais AS CodPais,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM estados
            WHERE codEstado = @codEstado
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
        return new EstadosReadDto
        {
            CodEstado = reader.GetInt32("CodEstado"),
            Estado = reader.GetString("Nome"),
            Uf = reader.GetString("Sigla"),
            CodPais = reader.GetInt32("CodPais"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }
}