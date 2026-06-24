using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CidadesController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public CidadesController(MySqlConnection connection)
    {
        _connection = connection;
    }
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<CidadesReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var cidades = new List<CidadesReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                c.codCidade,
                c.cidade,
                c.codEstado,
                c.codUsuario,
                c.criado_em,
                c.atualizado_em,
                e.codEstado AS Estado_codEstado,
                e.estado AS Estado_estado,
                e.UF AS Estado_UF,
                e.codPais AS Estado_codPais,
                e.criado_em AS Estado_criado_em,
                e.atualizado_em AS Estado_atualizado_em,
                p.codPais AS Pais_codPais,
                p.pais AS Pais_pais,
                p.sigla AS Pais_sigla,
                p.ddi AS Pais_ddi,
                p.moeda AS Pais_moeda,
                p.criado_em AS Pais_criado_em,
                p.atualizado_em AS Pais_atualizado_em,
                u.codUsuario AS Usuario_codUsuario,
                u.usuario AS Usuario_usuario
            FROM cidades c
            LEFT JOIN estados e ON c.codEstado = e.codEstado
            LEFT JOIN paises p ON e.codPais = p.codPais
            LEFT JOIN usuarios u ON c.codUsuario = u.codUsuario
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            cidades.Add(MapearCidade(reader));
        }
        return Ok(cidades);
    }
////[Authorize]
    [HttpGet("{codCidade:int}")]
    public async Task<ActionResult<CidadesReadDto>> BuscarPorCodigo(int codCidade, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                c.codCidade,
                c.cidade,
                c.codEstado,
                c.codUsuario,
                c.criado_em,
                c.atualizado_em,
                e.codEstado AS Estado_codEstado,
                e.estado AS Estado_estado,
                e.UF AS Estado_UF,
                e.codPais AS Estado_codPais,
                e.criado_em AS Estado_criado_em,
                e.atualizado_em AS Estado_atualizado_em,
                p.codPais AS Pais_codPais,
                p.pais AS Pais_pais,
                p.sigla AS Pais_sigla,
                p.ddi AS Pais_ddi,
                p.moeda AS Pais_moeda,
                p.criado_em AS Pais_criado_em,
                p.atualizado_em AS Pais_atualizado_em,
                u.codUsuario AS Usuario_codUsuario,
                u.usuario AS Usuario_usuario
            FROM cidades c
            LEFT JOIN estados e ON c.codEstado = e.codEstado
            LEFT JOIN paises p ON e.codPais = p.codPais
            LEFT JOIN usuarios u ON c.codUsuario = u.codUsuario
            WHERE c.codCidade = @codCidade
            """;
        command.Parameters.AddWithValue("@codCidade", codCidade);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearCidade(reader));
        }
        else
        {
            return NotFound();
        }
    }
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] CidadesCreateDto cidadeDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO cidades (cidade, codEstado, codUsuario)
            VALUES (@cidade, @codEstado, @codUsuario);
            """;
        command.Parameters.AddWithValue("@cidade", cidadeDto.cidade);
        command.Parameters.AddWithValue("@codEstado", cidadeDto.codEstado.HasValue ? cidadeDto.codEstado.Value : DBNull.Value);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codCidade = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar a cidade.");
        }
    }
////[Authorize]
    [HttpPatch("{codCidade:int}")]
    public async Task<ActionResult> Atualizar(int codCidade, [FromBody] CidadesUpdateDto cidadeDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (cidadeDto.cidade != null) updates.Add("cidade = @cidade");
        if (cidadeDto.codEstado.HasValue) updates.Add("codEstado = @codEstado");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE cidades SET {updateClause} WHERE codCidade = @codCidade";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codCidade", codCidade);
        if (cidadeDto.cidade != null) command.Parameters.AddWithValue("@cidade", cidadeDto.cidade);
        if (cidadeDto.codEstado.HasValue) command.Parameters.AddWithValue("@codEstado", cidadeDto.codEstado.Value);

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
    [HttpDelete("{codCidade:int}")]
    public async Task<ActionResult> Deletar(int codCidade, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM cidades WHERE codCidade = @codCidade";
        command.Parameters.AddWithValue("@codCidade", codCidade);

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

    private static CidadesReadDto MapearCidade(MySqlDataReader reader)
    {
        var cidade = new CidadesReadDto
        {
            codCidade = reader.GetInt32("codCidade"),
            cidade = reader.IsDBNull(reader.GetOrdinal("cidade")) ? string.Empty : reader.GetString("cidade"),
            codEstado = reader.IsDBNull(reader.GetOrdinal("codEstado")) ? null : reader.GetInt32("codEstado"),
            codUsuario = reader.IsDBNull(reader.GetOrdinal("codUsuario")) ? 0 : reader.GetInt32("codUsuario"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };

        if (!reader.IsDBNull(reader.GetOrdinal("Estado_codEstado")))
        {
            var estado = new EstadosReadDto
            {
                codEstado = reader.GetInt32("Estado_codEstado"),
                estado = reader.IsDBNull(reader.GetOrdinal("Estado_estado")) ? string.Empty : reader.GetString("Estado_estado"),
                UF = reader.IsDBNull(reader.GetOrdinal("Estado_UF")) ? string.Empty : reader.GetString("Estado_UF"),
                codPais = reader.IsDBNull(reader.GetOrdinal("Estado_codPais")) ? null : reader.GetInt32("Estado_codPais"),
                criado_em = reader.GetDateTime("Estado_criado_em"),
                atualizado_em = reader.GetDateTime("Estado_atualizado_em")
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

            cidade.Estado = estado;
        }

        if (!reader.IsDBNull(reader.GetOrdinal("Usuario_codUsuario")))
        {
            cidade.Usuario = new UsuarioReadDto
            {
                codUsuario = reader.GetInt32("Usuario_codUsuario"),
                usuario = reader.GetString("Usuario_usuario")
            };
        }

        return cidade;
    }
}
