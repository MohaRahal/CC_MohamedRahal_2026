using Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class LogsController : ControllerBase
{
    private readonly MySqlConnection _connection;

    public LogsController(MySqlConnection connection)
    {
        _connection = connection;
    }

    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LogReadDto>>> GetLogs(CancellationToken cancellationToken)
    {
        var logs = new List<LogReadDto>();
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT l.id, l.idUser, u.name as userName, l.acao, l.tabela, l.tipo, l.created_at
            FROM logs l
            LEFT JOIN users u ON l.idUser = u.id
            ORDER BY l.created_at DESC
            """;

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            logs.Add(new LogReadDto
            {
                Id = reader.GetInt32("id"),
                IdUser = reader.GetInt32("idUser"),
                User = reader.IsDBNull(reader.GetOrdinal("userName")) ? null : new UserLogDto 
                {
                    Id = reader.GetInt32("idUser"),
                    Name = reader.GetString("userName")
                },
                Acao = reader.GetString("acao"),
                Tabela = reader.GetString("tabela"),
                Tipo = reader.GetString("tipo"),
                CreatedAt = reader.GetDateTime("created_at")
            });
        }

        return Ok(logs);
    }

    
    [HttpGet("{id}")]
    public async Task<ActionResult<LogReadDto>> GetLogById(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT l.id, l.idUser, u.name as userName, l.acao, l.tabela, l.tipo, l.created_at
            FROM logs l
            LEFT JOIN users u ON l.idUser = u.id
            WHERE l.id = @id
            """;
        command.Parameters.AddWithValue("@id", id);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            var log = new LogReadDto
            {
                Id = reader.GetInt32("id"),
                IdUser = reader.GetInt32("idUser"),
                User = reader.IsDBNull(reader.GetOrdinal("userName")) ? null : new UserLogDto 
                {
                    Id = reader.GetInt32("idUser"),
                    Name = reader.GetString("userName")
                },
                Acao = reader.GetString("acao"),
                Tabela = reader.GetString("tabela"),
                Tipo = reader.GetString("tipo"),
                CreatedAt = reader.GetDateTime("created_at")
            };
            return Ok(log);
        }

        return NotFound(new { mensagem = "Log nÃ£o encontrado." });
    }
}

