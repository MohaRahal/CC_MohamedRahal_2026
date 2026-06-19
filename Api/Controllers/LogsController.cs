using Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
////[Authorize]
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
            SELECT l.codLog, l.codUsuario, u.usuario as userName, l.nomeTabela, l.codRegistro, l.novoRegistro, l.tipo, l.criado_em
            FROM logs l
            LEFT JOIN usuarios u ON l.codUsuario = u.codUsuario
            ORDER BY l.criado_em DESC
            """;

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            logs.Add(new LogReadDto
            {
                codLog = reader.GetInt32("codLog"),
                codUsuario = reader.GetInt32("codUsuario"),
                User = reader.IsDBNull(reader.GetOrdinal("userName")) ? null : new UserLogDto 
                {
                    codUsuario = reader.GetInt32("codUsuario"),
                    usuario = reader.GetString("userName")
                },
                nomeTabela = reader.IsDBNull(reader.GetOrdinal("nomeTabela")) ? string.Empty : reader.GetString("nomeTabela"),
                codRegistro = reader.IsDBNull(reader.GetOrdinal("codRegistro")) ? 0 : int.TryParse(reader.GetString("codRegistro"), out var reg) ? reg : 0,
                novoRegistro = reader.IsDBNull(reader.GetOrdinal("novoRegistro")) ? 0 : int.TryParse(reader.GetString("novoRegistro"), out var nreg) ? nreg : 0,
                tipo = reader.GetString("tipo"),
                criado_em = reader.GetDateTime("criado_em")
            });
        }

        return Ok(logs);
    }

    [HttpGet("{codLog:int}")]
    public async Task<ActionResult<LogReadDto>> GetLogById(int codLog, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT l.codLog, l.codUsuario, u.usuario as userName, l.nomeTabela, l.codRegistro, l.novoRegistro, l.tipo, l.criado_em
            FROM logs l
            LEFT JOIN usuarios u ON l.codUsuario = u.codUsuario
            WHERE l.codLog = @codLog
            """;
        command.Parameters.AddWithValue("@codLog", codLog);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            var log = new LogReadDto
            {
                codLog = reader.GetInt32("codLog"),
                codUsuario = reader.GetInt32("codUsuario"),
                User = reader.IsDBNull(reader.GetOrdinal("userName")) ? null : new UserLogDto 
                {
                    codUsuario = reader.GetInt32("codUsuario"),
                    usuario = reader.GetString("userName")
                },
                nomeTabela = reader.IsDBNull(reader.GetOrdinal("nomeTabela")) ? string.Empty : reader.GetString("nomeTabela"),
                codRegistro = reader.IsDBNull(reader.GetOrdinal("codRegistro")) ? 0 : int.TryParse(reader.GetString("codRegistro"), out var reg) ? reg : 0,
                novoRegistro = reader.IsDBNull(reader.GetOrdinal("novoRegistro")) ? 0 : int.TryParse(reader.GetString("novoRegistro"), out var nreg) ? nreg : 0,
                tipo = reader.GetString("tipo"),
                criado_em = reader.GetDateTime("criado_em")
            };
            return Ok(log);
        }

        return NotFound(new { mensagem = "Log não encontrado." });
    }
}
