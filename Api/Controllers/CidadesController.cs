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
     [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<CidadesReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var cidades = new List<CidadesReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                c.codCidade AS CodCidade,
                c.cidade AS Cidade,
                c.codEstado AS CodEstado,
                c.created_at AS CriadoEm,
                c.updated_at AS AtualizadoEm,
                e.codEstado AS Estado_CodEstado,
                e.estado AS Estado_Nome,
                e.Uf AS Estado_Sigla,
                e.codPais AS Estado_CodPais,
                e.created_at AS Estado_CriadoEm,
                e.updated_at AS Estado_AtualizadoEm,
                p.codPais AS Pais_CodPais,
                p.pais AS Pais_Nome,
                p.sigla AS Pais_Sigla,
                p.DDI AS Pais_Ddi,
                p.moeda AS Pais_Moeda,
                p.created_at AS Pais_CriadoEm,
                p.updated_at AS Pais_AtualizadoEm
            FROM cidades c
            LEFT JOIN estados e ON c.codEstado = e.codEstado
            LEFT JOIN paises p ON e.codPais = p.codPais
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            cidades.Add(MapearCidade(reader));
        }
        return Ok(cidades);
    }
     [Authorize]
    [HttpGet("{codCidade:int}")]
    public async Task<ActionResult<CidadesReadDto>> BuscarPorCodigo(int codCidade, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                c.codCidade AS CodCidade,
                c.cidade AS Cidade,
                c.codEstado AS CodEstado,
                c.created_at AS CriadoEm,
                c.updated_at AS AtualizadoEm,
                e.codEstado AS Estado_CodEstado,
                e.estado AS Estado_Nome,
                e.Uf AS Estado_Sigla,
                e.codPais AS Estado_CodPais,
                e.created_at AS Estado_CriadoEm,
                e.updated_at AS Estado_AtualizadoEm,
                p.codPais AS Pais_CodPais,
                p.nome AS Pais_Nome,
                p.sigla AS Pais_Sigla,
                p.ddi AS Pais_Ddi,
                p.moeda AS Pais_Moeda,
                p.created_at AS Pais_CriadoEm,
                p.updated_at AS Pais_AtualizadoEm
            FROM cidades c
            LEFT JOIN estados e ON c.codEstado = e.codEstado
            LEFT JOIN paises p ON e.codPais = p.codPais
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
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] CidadesCreateDto cidadeDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO cidades (cidade, codEstado)
            VALUES (@cidade, @codEstado);
            """;
        command.Parameters.AddWithValue("@cidade", cidadeDto.Cidade);
        command.Parameters.AddWithValue("@codEstado", cidadeDto.CodEstado.HasValue ? cidadeDto.CodEstado.Value : DBNull.Value);

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
     [Authorize]
    [HttpPatch("{codCidade:int}")]
    public async Task<ActionResult> Atualizar(int codCidade, [FromBody] CidadesUpdateDto cidadeDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (cidadeDto.Cidade != null) updates.Add("cidade = @cidade");
        if (cidadeDto.CodEstado.HasValue) updates.Add("codEstado = @codEstado");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE cidades SET {updateClause} WHERE codCidade = @codCidade";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codCidade", codCidade);
        if (cidadeDto.Cidade != null) command.Parameters.AddWithValue("@cidade", cidadeDto.Cidade);
        if (cidadeDto.CodEstado.HasValue) command.Parameters.AddWithValue("@codEstado", cidadeDto.CodEstado.Value);

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
            CodCidade = reader.GetInt32("CodCidade"),
            Cidade = reader.GetString("Cidade"),
            CodEstado = reader.IsDBNull(reader.GetOrdinal("CodEstado")) ? null : reader.GetInt32("CodEstado"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };

        if (!reader.IsDBNull(reader.GetOrdinal("Estado_CodEstado")))
        {
            var estado = new EstadosReadDto
            {
                CodEstado = reader.GetInt32("Estado_CodEstado"),
                Estado = reader.GetString("Estado_Nome"),
                Uf = reader.GetString("Estado_Sigla"),
                CodPais = reader.IsDBNull(reader.GetOrdinal("Estado_CodPais")) ? null : reader.GetInt32("Estado_CodPais"),
                CriadoEm = reader.GetDateTime("Estado_CriadoEm"),
                AtualizadoEm = reader.GetDateTime("Estado_AtualizadoEm")
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

            cidade.Estado = estado;
        }

        return cidade;
    }
}
