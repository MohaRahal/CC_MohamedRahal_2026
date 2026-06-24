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
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<EstadosReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var estados = new List<EstadosReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                e.codEstado,
                e.UF,
                e.estado,
                e.codPais,
                e.codUsuario,
                e.criado_em,
                e.atualizado_em,
                p.codPais AS Pais_codPais,
                p.pais AS Pais_pais,
                p.sigla AS Pais_sigla,
                p.ddi AS Pais_ddi,
                p.moeda AS Pais_moeda,
                p.criado_em AS Pais_criado_em,
                p.atualizado_em AS Pais_atualizado_em,
                u.codUsuario AS Usuario_codUsuario,
                u.usuario AS Usuario_usuario
            FROM estados e
            LEFT JOIN paises p ON e.codPais = p.codPais
            LEFT JOIN usuarios u ON e.codUsuario = u.codUsuario
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            estados.Add(MapearEstado(reader));
        }
        return Ok(estados);
    }
////[Authorize]
    [HttpGet("{codEstado:int}")]
    public async Task<ActionResult<EstadosReadDto>> BuscarPorCodigo(int codEstado, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                e.codEstado,
                e.UF,
                e.estado,
                e.codPais,
                e.codUsuario,
                e.criado_em,
                e.atualizado_em,
                p.codPais AS Pais_codPais,
                p.pais AS Pais_pais,
                p.sigla AS Pais_sigla,
                p.ddi AS Pais_ddi,
                p.moeda AS Pais_moeda,
                p.criado_em AS Pais_criado_em,
                p.atualizado_em AS Pais_atualizado_em,
                u.codUsuario AS Usuario_codUsuario,
                u.usuario AS Usuario_usuario
            FROM estados e
            LEFT JOIN paises p ON e.codPais = p.codPais
            LEFT JOIN usuarios u ON e.codUsuario = u.codUsuario
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
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] EstadosCreateDto estadoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO estados (UF, estado, codPais, codUsuario)
            VALUES (@UF, @estado, @codPais, @codUsuario);
            """;
        command.Parameters.AddWithValue("@UF", estadoDto.UF);
        command.Parameters.AddWithValue("@estado", estadoDto.estado);
        command.Parameters.AddWithValue("@codPais", estadoDto.codPais.HasValue ? estadoDto.codPais.Value : DBNull.Value);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

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
////[Authorize]
    [HttpPatch("{codEstado:int}")]
    public async Task<ActionResult> Atualizar(int codEstado, [FromBody] EstadosUpdateDto estadoDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (estadoDto.UF != null) updates.Add("UF = @UF");
        if (estadoDto.estado != null) updates.Add("estado = @estado");
        if (estadoDto.codPais.HasValue) updates.Add("codPais = @codPais");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE estados SET {updateClause} WHERE codEstado = @codEstado";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codEstado", codEstado);
        if (estadoDto.UF != null) command.Parameters.AddWithValue("@UF", estadoDto.UF);
        if (estadoDto.estado != null) command.Parameters.AddWithValue("@estado", estadoDto.estado);
        if (estadoDto.codPais.HasValue) command.Parameters.AddWithValue("@codPais", estadoDto.codPais.Value);

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
            codEstado = reader.GetInt32("codEstado"),
            UF = reader.IsDBNull(reader.GetOrdinal("UF")) ? string.Empty : reader.GetString("UF"),
            estado = reader.IsDBNull(reader.GetOrdinal("estado")) ? string.Empty : reader.GetString("estado"),
            codPais = reader.IsDBNull(reader.GetOrdinal("codPais")) ? null : reader.GetInt32("codPais"),
            codUsuario = reader.IsDBNull(reader.GetOrdinal("codUsuario")) ? 0 : reader.GetInt32("codUsuario"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };

        if (!reader.IsDBNull(reader.GetOrdinal("Pais_codPais")))
        {
            estado.Pais = new PaisesReadDto
            {
                codPais = reader.GetInt32("Pais_codPais"),
                pais = reader.IsDBNull(reader.GetOrdinal("Pais_pais")) ? string.Empty : reader.GetString("Pais_pais"),
                sigla = reader.IsDBNull(reader.GetOrdinal("Pais_sigla")) ? string.Empty : reader.GetString("Pais_sigla"),
                ddi = reader.IsDBNull(reader.GetOrdinal("Pais_ddi")) ? string.Empty : reader.GetString("Pais_ddi"),
                moeda = reader.IsDBNull(reader.GetOrdinal("Pais_moeda")) ? string.Empty : reader.GetString("Pais_moeda"),
                criado_em = reader.GetDateTime("Pais_criado_em"),
                atualizado_em = reader.GetDateTime("Pais_atualizado_em")
            };
        }

        if (!reader.IsDBNull(reader.GetOrdinal("Usuario_codUsuario")))
        {
            estado.Usuario = new UsuarioReadDto
            {
                codUsuario = reader.GetInt32("Usuario_codUsuario"),
                usuario = reader.GetString("Usuario_usuario")
            };
        }

        return estado;
    }
}
