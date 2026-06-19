using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MySqlConnection _connection;
    private readonly IConfiguration _configuration;

    public AuthController(MySqlConnection connection, IConfiguration configuration)
    {
        _connection = connection;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginDto login, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT codUsuario, usuario, codCargo, ativo
            FROM usuarios
            WHERE usuario = @usuario AND senha = @senha
            """;
        command.Parameters.AddWithValue("@usuario", login.usuario);
        command.Parameters.AddWithValue("@senha", login.senha);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
        {
            return Unauthorized(new { mensagem = "UsuÃ¡rio ou senha invÃ¡lidos." });
        }

        var ativo = reader.GetBoolean("ativo");
        if (!ativo)
        {
            return Unauthorized(new { mensagem = "UsuÃ¡rio inativo. O acesso estÃ¡ bloqueado." });
        }

        var userId = reader.GetInt32("codUsuario");
        var userName = reader.GetString("usuario");
        var roleId = reader.GetInt32("codCargo");

        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtKey = _configuration["Jwt:Key"];
        var key = Encoding.ASCII.GetBytes(jwtKey);
        
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, userName),
                new Claim("roleid", roleId.ToString()) 
            }),
            Expires = DateTime.UtcNow.AddHours(6), 
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return Ok(new
        {
            Token = tokenString,
            Usuario = new { id = userId, name = userName, roleid = roleId }
        });
    }
}

