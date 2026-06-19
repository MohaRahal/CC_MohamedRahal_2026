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
        var roles = new List<CargoReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codCargo,
                cargo,
                criado_em,
                atualizado_em
            FROM cargos
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            roles.Add(MapearRole(reader));
        }
        return Ok(roles);
    
    }
////[Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CargoReadDto>> BuscarPorId(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codCargo,
                cargo,
                criado_em,
                atualizado_em
            FROM cargos
            WHERE codCargo = @codCargo
            """;
        command.Parameters.AddWithValue("@codCargo", id);
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
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] CargoCreateDto role, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO cargos (cargo)
            VALUES (@cargo);
            """;
        command.Parameters.AddWithValue("@cargo", role.cargo);

        await command.ExecuteNonQueryAsync(cancellationToken);
        var id = command.LastInsertedId;

        return CreatedAtAction(nameof(BuscarPorId), new { id }, role);
    }
////[Authorize]
    [HttpPatch("{id:int}")]
    public async Task<ActionResult> Atualizar(int id, [FromBody] CargoUpdateDto role, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            UPDATE cargos
            SET cargo = @cargo
            WHERE codCargo = @codCargo;
            """;
        command.Parameters.AddWithValue("@cargo", role.cargo);
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

    private static CargoReadDto MapearRole(MySqlDataReader reader)
    {
        return new CargoReadDto
        {
            codCargo = reader.GetInt32("codCargo"),
            cargo = reader.GetString("cargo"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };
    }
}

