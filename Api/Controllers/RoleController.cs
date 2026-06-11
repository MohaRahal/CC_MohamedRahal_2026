using Api.DTOs;
using MySqlConnector;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authorization;


namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoleController : ControllerBase
{
    private readonly MySqlConnection _connection;

    [ActivatorUtilitiesConstructor]
    public RoleController(MySqlConnection connection)
    {
        _connection = connection;
    }
    
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<RoleReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var roles = new List<RoleReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                id AS Id,
                name AS Name,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM roles
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            roles.Add(MapearRole(reader));
        }
        return Ok(roles);
    
    }
     [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<RoleReadDto>> BuscarPorId(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                id AS Id,
                name AS Name,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM roles
            WHERE id = @id
            """;
        command.Parameters.AddWithValue("@id", id);
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearRole(reader));
        }
        else
        {
            return NotFound();
        }
    }
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] RoleCreateDto role, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO roles (name)
            VALUES (@name);
            """;
        command.Parameters.AddWithValue("@name", role.Name);

        await command.ExecuteNonQueryAsync(cancellationToken);
        var id = command.LastInsertedId;

        return CreatedAtAction(nameof(BuscarPorId), new { id }, role);
    }
     [Authorize]
    [HttpPatch("{id:int}")]
    public async Task<ActionResult> Atualizar(int id, [FromBody] RoleUpdateDto role, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            UPDATE roles
            SET name = @name
            WHERE id = @id;
            """;
        command.Parameters.AddWithValue("@name", role.Name);
        command.Parameters.AddWithValue("@id", id);
        

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
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Deletar(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        var command = _connection.CreateCommand();
        command.CommandText = """
            DELETE FROM roles
            WHERE id = @id;
            """;
        command.Parameters.AddWithValue("@id", id);
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

    private static RoleReadDto MapearRole(MySqlDataReader reader)
    {
        return new RoleReadDto
        {
            Id = reader.GetInt32("Id"),
            Name = reader.GetString("Name"),
            created_at = reader.GetDateTime("CriadoEm"),
            updated_at = reader.GetDateTime("AtualizadoEm")
        };
    }
}
