using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModelosController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public ModelosController(MySqlConnection connection)
    {
        _connection = connection;
    }

    [HttpGet]
    public async Task<ActionResult<List<ModeloReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var modelos = new List<ModeloReadDto>();
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = "SELECT codModelo, modelo, codMarca, criado_em, atualizado_em FROM modelos";
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            modelos.Add(new ModeloReadDto
            {
                codModelo = reader.GetInt32("codModelo"),
                modelo = reader.GetString("modelo"),
                codMarca = reader.GetInt32("codMarca"),
                criado_em = reader.GetDateTime("criado_em"),
                atualizado_em = reader.GetDateTime("atualizado_em")
            });
        }
        return Ok(modelos);
    }

    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] ModeloCreateDto modeloDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = "INSERT INTO modelos (modelo, codMarca, codUsuario) VALUES (@modelo, @codMarca, @codUsuario)";
        command.Parameters.AddWithValue("@modelo", modeloDto.modelo);
        command.Parameters.AddWithValue("@codMarca", modeloDto.codMarca);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return Ok(new { codModelo = command.LastInsertedId, modelo = modeloDto.modelo, codMarca = modeloDto.codMarca });
        }
        return StatusCode(500, "Erro ao criar modelo.");
    }
}
