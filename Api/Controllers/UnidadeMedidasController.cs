using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnidadeMedidasController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public UnidadeMedidasController(MySqlConnection connection)
    {
        _connection = connection;
    }
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<UnidadeMedidaReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var unidades = new List<UnidadeMedidaReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                id AS Id,
                sigla AS Sigla,
                descricao AS Descricao,
                created_at AS CriadoEm,
                updated_at AS AtualizadoEm
            FROM unidade_medidas
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            unidades.Add(MapearUnidadeMedida(reader));
        }
        return Ok(unidades);
    }
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<UnidadeMedidaCreateDto>>Criar(UnidadeMedidaCreateDto modelo, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO unidade_medidas (sigla, descricao)
            VALUES (@sigla, @descricao)
            """;
        command.Parameters.AddWithValue("@sigla", modelo.Sigla);
        command.Parameters.AddWithValue("@descricao", modelo.Descricao);
        await command.ExecuteNonQueryAsync(cancellationToken);
        return Ok(modelo);
    }
    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UnidadeMedidaReadDto>> BuscarPorCodigo(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = "SELECT * FROM unidade_medidas WHERE id = @id";
        command.Parameters.AddWithValue("@id", id);
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearUnidadeMedida(reader));
        }
        else
        {
            return NotFound();
        }
    }
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Excluir(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM unidade_medidas WHERE id = @id";
        command.Parameters.AddWithValue("@id", id);
        await command.ExecuteNonQueryAsync(cancellationToken);
        return Ok();
    }

    private static UnidadeMedidaReadDto MapearUnidadeMedida(MySqlDataReader reader)
    {
        return new UnidadeMedidaReadDto
        {
            Id = reader.GetInt32("Id"),
            Sigla = reader.GetString("Sigla"),
            Descricao = reader.GetString("Descricao"),
            CriadoEm = reader.GetDateTime("CriadoEm"),
            AtualizadoEm = reader.GetDateTime("AtualizadoEm")
        };
    }
}
