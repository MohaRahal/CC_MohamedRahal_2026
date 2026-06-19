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
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<UsuarioReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var users = new List<UsuarioReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codUsuario,
                usuario,
                codFuncionario,
                codCargo,
                ativo,
                criado_em,
                atualizado_em
            FROM usuarios
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            users.Add(MapearUser(reader));
        }
        return Ok(users);
    }
////[Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UsuarioReadDto>> BuscarPorCodigo(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codUsuario,
                usuario,
                codFuncionario,
                codCargo,
                ativo,
                criado_em,
                atualizado_em
            FROM usuarios
            WHERE codUsuario = @codUsuario
            """;
        command.Parameters.AddWithValue("@codUsuario", id);

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
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] UsuarioCreateDto userDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO usuarios (usuario, senha, codFuncionario, codCargo, ativo)
            VALUES (@usuario, @senha, @codFuncionario, @codCargo, @ativo);
            """;
       
        command.Parameters.AddWithValue("@usuario", userDto.usuario);
        command.Parameters.AddWithValue("@senha", userDto.senha);
        command.Parameters.AddWithValue("@codFuncionario", userDto.codFuncionario);
        command.Parameters.AddWithValue("@codCargo", userDto.codCargo);
        command.Parameters.AddWithValue("@ativo", userDto.ativo);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { id = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o usuÃ¡rio.");
        }
    }
////[Authorize]
    [HttpPatch("{id:int}")]
    public async Task<ActionResult> Atualizar(int id, [FromBody] UsuarioUpdateDto userDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (userDto.usuario != null) updates.Add("usuario = @usuario");
        if (userDto.senha != null) updates.Add("senha = @senha");
        if (userDto.codFuncionario.HasValue) updates.Add("codFuncionario = @codFuncionario");
        if (userDto.codCargo.HasValue) updates.Add("codCargo = @codCargo");
        if (userDto.ativo.HasValue) updates.Add("ativo = @ativo");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"""
        UPDATE usuarios SET {updateClause} WHERE codUsuario = @codUsuario
        """;

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codUsuario", id);

        if (userDto.usuario != null) command.Parameters.AddWithValue("@usuario", userDto.usuario);
        if (userDto.senha != null) command.Parameters.AddWithValue("@senha", userDto.senha);
        if (userDto.codFuncionario.HasValue) command.Parameters.AddWithValue("@codFuncionario", userDto.codFuncionario.Value);
        if (userDto.codCargo.HasValue) command.Parameters.AddWithValue("@codCargo", userDto.codCargo.Value);
        if (userDto.ativo.HasValue) command.Parameters.AddWithValue("@ativo", userDto.ativo.Value);

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
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Deletar(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText =
        """
        DELETE FROM usuarios WHERE codUsuario = @codUsuario;
        """;
        command.Parameters.AddWithValue("@codUsuario", id);

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

    private static UsuarioReadDto MapearUser(MySqlDataReader reader)
    {
        return new UsuarioReadDto
        {
            codUsuario = reader.GetInt32("codUsuario"),
            usuario = reader.GetString("usuario"),
            codFuncionario = reader.GetInt32("codFuncionario"),
            codCargo = reader.GetInt32("codCargo"),
            ativo = reader.GetBoolean("ativo"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };
    }
}

