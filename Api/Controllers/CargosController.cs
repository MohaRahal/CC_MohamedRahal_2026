using Api.DTOs;
using MySqlConnector;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authorization;


namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CargosController : ControllerBase
{
    private readonly MySqlConnection _connection;

    [ActivatorUtilitiesConstructor]
    public CargosController(MySqlConnection connection)
    {
        _connection = connection;
    }
    
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<CargoReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var cargos = new List<CargoReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                c.codCargo,
                c.cargo,
                c.codUsuario,
                c.criado_em,
                c.atualizado_em,
                u.codUsuario as u_codUsuario,
                u.usuario as u_usuario,
                u.codFuncionario as u_codFuncionario,
                u.codCargo as u_codCargo,
                u.ativo as u_ativo,
                u.criado_em as u_criado_em,
                u.atualizado_em as u_atualizado_em
            FROM cargos c
            LEFT JOIN usuarios u ON c.codUsuario = u.codUsuario
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            cargos.Add(MapearCargo(reader));
        }
        return Ok(cargos);
    
    }
////[Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CargoReadDto>> BuscarPorId(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                c.codCargo,
                c.cargo,
                c.codUsuario,
                c.criado_em,
                c.atualizado_em,
                u.codUsuario as u_codUsuario,
                u.usuario as u_usuario,
                u.codFuncionario as u_codFuncionario,
                u.codCargo as u_codCargo,
                u.ativo as u_ativo,
                u.criado_em as u_criado_em,
                u.atualizado_em as u_atualizado_em
            FROM cargos c
            LEFT JOIN usuarios u ON c.codUsuario = u.codUsuario
            WHERE c.codCargo = @codCargo
            """;
        command.Parameters.AddWithValue("@codCargo", id);
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearCargo(reader));
        }
        else
        {
            return NotFound();
        }
    }
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] CargoCreateDto cargo, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO cargos (cargo,codUsuario)
            VALUES (@cargo,@codUsuario);
            """;
        command.Parameters.AddWithValue("@cargo", cargo.cargo);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        await command.ExecuteNonQueryAsync(cancellationToken);
        var id = command.LastInsertedId;

        return CreatedAtAction(nameof(BuscarPorId), new { id }, cargo);
    }
////[Authorize]
    [HttpPatch("{id:int}")]
    public async Task<ActionResult> Atualizar(int id, [FromBody] CargoUpdateDto cargo, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            UPDATE cargos
            SET cargo = @cargo, codUsuario = @codUsuario
            WHERE codCargo = @codCargo;
            """;
        command.Parameters.AddWithValue("@cargo", cargo.cargo);
        command.Parameters.AddWithValue("@codCargo", id);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

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
        var command = _connection.CreateCommand();
        command.CommandText = """
            DELETE FROM cargos
            WHERE codCargo = @codCargo;
            """;
        command.Parameters.AddWithValue("@codCargo", id);
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

    private static CargoReadDto MapearCargo(MySqlDataReader reader)
    {
        var cargo = new CargoReadDto
        {
            codCargo = reader.GetInt32("codCargo"),
            cargo = reader.GetString("cargo"),
            codUsuario = reader.IsDBNull(reader.GetOrdinal("codUsuario")) ? null : reader.GetInt32("codUsuario"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };

        if (!reader.IsDBNull(reader.GetOrdinal("u_codUsuario")))
        {
            cargo.Usuario = new UsuarioReadDto
            {
                codUsuario = reader.GetInt32("u_codUsuario"),
                usuario = reader.GetString("u_usuario"),
                codFuncionario = reader.IsDBNull(reader.GetOrdinal("u_codFuncionario")) ? 0 : reader.GetInt32("u_codFuncionario"),
                codCargo = reader.IsDBNull(reader.GetOrdinal("u_codCargo")) ? 0 : reader.GetInt32("u_codCargo"),
                ativo = reader.GetBoolean("u_ativo"),
                criado_em = reader.GetDateTime("u_criado_em"),
                atualizado_em = reader.GetDateTime("u_atualizado_em")
            };
        }

        return cargo;
    }
}

