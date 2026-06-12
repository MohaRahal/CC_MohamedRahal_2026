using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public UsersController(MySqlConnection connection)
    {
        _connection = connection;
    }
     [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<UsersReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var users = new List<UsersReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                id AS Id,
                name AS Name,
                roleid AS RoleId,
                ativo AS Ativo,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM users
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            users.Add(MapearUser(reader));
        }
        return Ok(users);
    }
     [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UsersReadDto>> BuscarPorCodigo(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                id AS Id,
                name AS Name,
                roleid AS RoleId,
                ativo AS Ativo,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM users
            WHERE id = @id
            """;
        command.Parameters.AddWithValue("@id", id);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearUser(reader));
        }
        else
        {
            return NotFound();
        }
    }
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] UsersCreateDto userDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO users (name, senha, roleid, ativo)
            VALUES (@name, @senha, @roleid, @ativo);
            INSERT INTO logs (idUser, acao, tabela, tipo)
            VALUES (@idUser, 'Criou um novo usuario', 'users', 'Insert')
            """;
       
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        command.Parameters.AddWithValue("@name", userDto.Name);
        command.Parameters.AddWithValue("@senha", userDto.Senha);
        command.Parameters.AddWithValue("@roleid", userDto.RoleId);
        command.Parameters.AddWithValue("@ativo", userDto.Ativo);
        command.Parameters.AddWithValue("@idUser", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { id = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o usuário.");
        }
    }
     [Authorize]
    [HttpPatch("{id:int}")]
    public async Task<ActionResult> Atualizar(int id, [FromBody] UsersUpdateDto userDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (userDto.Name != null) updates.Add("name = @name");
        if (userDto.Senha != null) updates.Add("senha = @senha");
        if (userDto.RoleId.HasValue) updates.Add("roleid = @roleid");
        if (userDto.Ativo.HasValue) updates.Add("ativo = @ativo");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE users SET {updateClause} WHERE id = @id";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@id", id);
        if (userDto.Name != null) command.Parameters.AddWithValue("@name", userDto.Name);
        if (userDto.Senha != null) command.Parameters.AddWithValue("@senha", userDto.Senha);
        if (userDto.RoleId.HasValue) command.Parameters.AddWithValue("@roleid", userDto.RoleId.Value);
        if (userDto.Ativo.HasValue) command.Parameters.AddWithValue("@ativo", userDto.Ativo.Value);

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

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM users WHERE id = @id";
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

    private static UsersReadDto MapearUser(MySqlDataReader reader)
    {
        return new UsersReadDto
        {
            Id = reader.GetInt32("Id"),
            Name = reader.GetString("Name"),
            RoleId = reader.GetInt32("RoleId"),
            Ativo = reader.GetBoolean("Ativo"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }
}
