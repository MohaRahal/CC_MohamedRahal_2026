using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransportadoresController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public TransportadoresController(MySqlConnection connection)
    {
        _connection = connection;
    }
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<TransportadoresReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var transportadores = new List<TransportadoresReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                t.codTransp,
                t.apelido_NomeFantasia,
                t.transportador,
                t.inscEstTransp,
                t.tipoPessoa,
                t.cpf_cnpjTransp,
                t.ender,
                t.numero,
                t.complemento,
                t.bairro,
                t.codCidade,
                t.cep,
                t.site,
                t.fone,
                t.email,
                t.ativo,
                t.codUsuario,
                t.criado_em,
                t.atualizado_em,
                c.cidade,
                c.codEstado,
                u.codUsuario as u_codUsuario,
                u.usuario as u_usuario,
                u.codFuncionario as u_codFuncionario,
                u.codCargo as u_codCargo,
                u.ativo as u_ativo,
                u.criado_em as u_criado_em,
                u.atualizado_em as u_atualizado_em
            FROM transportadores t
            LEFT JOIN cidades c ON t.codCidade = c.codCidade
            LEFT JOIN usuarios u ON t.codUsuario = u.codUsuario
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            transportadores.Add(MapearTransportador(reader));
        }
        return Ok(transportadores);
    }
////[Authorize]
    [HttpGet("{codTransp:int}")]
    public async Task<ActionResult<TransportadoresReadDto>> BuscarPorCodigo(int codTransp, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                t.codTransp,
                t.apelido_NomeFantasia,
                t.transportador,
                t.inscEstTransp,
                t.tipoPessoa,
                t.cpf_cnpjTransp,
                t.ender,
                t.numero,
                t.complemento,
                t.bairro,
                t.codCidade,
                t.cep,
                t.site,
                t.fone,
                t.email,
                t.ativo,
                t.codUsuario,
                t.criado_em,
                t.atualizado_em,
                c.cidade,
                c.codEstado,
                u.codUsuario as u_codUsuario,
                u.usuario as u_usuario,
                u.codFuncionario as u_codFuncionario,
                u.codCargo as u_codCargo,
                u.ativo as u_ativo,
                u.criado_em as u_criado_em,
                u.atualizado_em as u_atualizado_em
            FROM transportadores t
            LEFT JOIN cidades c ON t.codCidade = c.codCidade
            LEFT JOIN usuarios u ON t.codUsuario = u.codUsuario
            WHERE t.codTransp = @codTransp
            """;
        command.Parameters.AddWithValue("@codTransp", codTransp);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearTransportador(reader));
        }
        else
        {
            return NotFound();
        }
    }
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] TransportadoresCreateDto transpDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO transportadores (apelido_NomeFantasia, transportador, inscEstTransp, tipoPessoa, cpf_cnpjTransp, ender, numero, complemento, bairro, codCidade, cep, site, fone, email, ativo, codUsuario)
            VALUES (@apelido_NomeFantasia, @transportador, @inscEstTransp, @tipoPessoa, @cpf_cnpjTransp, @ender, @numero, @complemento, @bairro, @codCidade, @cep, @site, @fone, @email, @ativo, @codUsuario);
            """;
        command.Parameters.AddWithValue("@apelido_NomeFantasia", transpDto.apelido_NomeFantasia);
        command.Parameters.AddWithValue("@transportador", string.IsNullOrEmpty(transpDto.transportador) ? (object)DBNull.Value : transpDto.transportador);
        command.Parameters.AddWithValue("@inscEstTransp", string.IsNullOrEmpty(transpDto.inscEstTransp) ? (object)DBNull.Value : transpDto.inscEstTransp);
        command.Parameters.AddWithValue("@tipoPessoa", transpDto.tipoPessoa);
        command.Parameters.AddWithValue("@cpf_cnpjTransp", string.IsNullOrEmpty(transpDto.cpf_cnpjTransp) ? (object)DBNull.Value : transpDto.cpf_cnpjTransp);
        command.Parameters.AddWithValue("@ender", string.IsNullOrEmpty(transpDto.ender) ? (object)DBNull.Value : transpDto.ender);
        command.Parameters.AddWithValue("@numero", string.IsNullOrEmpty(transpDto.numero) ? (object)DBNull.Value : transpDto.numero);
        command.Parameters.AddWithValue("@complemento", string.IsNullOrEmpty(transpDto.complemento) ? (object)DBNull.Value : transpDto.complemento);
        command.Parameters.AddWithValue("@bairro", string.IsNullOrEmpty(transpDto.bairro) ? (object)DBNull.Value : transpDto.bairro);
        command.Parameters.AddWithValue("@codCidade", transpDto.codCidade > 0 ? transpDto.codCidade : DBNull.Value);
        command.Parameters.AddWithValue("@cep", string.IsNullOrEmpty(transpDto.cep) ? (object)DBNull.Value : transpDto.cep);
        command.Parameters.AddWithValue("@site", string.IsNullOrEmpty(transpDto.site) ? (object)DBNull.Value : transpDto.site);
        command.Parameters.AddWithValue("@fone", string.IsNullOrEmpty(transpDto.fone) ? (object)DBNull.Value : transpDto.fone);
        command.Parameters.AddWithValue("@email", string.IsNullOrEmpty(transpDto.email) ? (object)DBNull.Value : transpDto.email);
        command.Parameters.AddWithValue("@ativo", transpDto.ativo);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codTransp = command.LastInsertedId }, null);
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o transportador.");
        }
    }
////[Authorize]
    [HttpPatch("{codTransp:int}")]
    public async Task<ActionResult> Atualizar(int codTransp, [FromBody] TransportadoresUpdateDto transpDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (transpDto.apelido_NomeFantasia != null) updates.Add("apelido_NomeFantasia = @apelido_NomeFantasia");
        if (transpDto.transportador != null) updates.Add("transportador = @transportador");
        if (transpDto.inscEstTransp != null) updates.Add("inscEstTransp = @inscEstTransp");
        if (transpDto.tipoPessoa != null) updates.Add("tipoPessoa = @tipoPessoa");
        if (transpDto.cpf_cnpjTransp != null) updates.Add("cpf_cnpjTransp = @cpf_cnpjTransp");
        if (transpDto.ender != null) updates.Add("ender = @ender");
        if (transpDto.numero != null) updates.Add("numero = @numero");
        if (transpDto.complemento != null) updates.Add("complemento = @complemento");
        if (transpDto.bairro != null) updates.Add("bairro = @bairro");
        if (transpDto.codCidade.HasValue) updates.Add("codCidade = @codCidade");
        if (transpDto.cep != null) updates.Add("cep = @cep");
        if (transpDto.site != null) updates.Add("site = @site");
        if (transpDto.fone != null) updates.Add("fone = @fone");
        if (transpDto.email != null) updates.Add("email = @email");
        if (transpDto.ativo.HasValue) updates.Add("ativo = @ativo");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE transportadores SET {updateClause} WHERE codTransp = @codTransp";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codTransp", codTransp);
        
        if (transpDto.apelido_NomeFantasia != null) command.Parameters.AddWithValue("@apelido_NomeFantasia", transpDto.apelido_NomeFantasia);
        if (transpDto.transportador != null) command.Parameters.AddWithValue("@transportador", transpDto.transportador);
        if (transpDto.inscEstTransp != null) command.Parameters.AddWithValue("@inscEstTransp", transpDto.inscEstTransp);
        if (transpDto.tipoPessoa != null) command.Parameters.AddWithValue("@tipoPessoa", transpDto.tipoPessoa);
        if (transpDto.cpf_cnpjTransp != null) command.Parameters.AddWithValue("@cpf_cnpjTransp", transpDto.cpf_cnpjTransp);
        if (transpDto.ender != null) command.Parameters.AddWithValue("@ender", transpDto.ender);
        if (transpDto.numero != null) command.Parameters.AddWithValue("@numero", transpDto.numero);
        if (transpDto.complemento != null) command.Parameters.AddWithValue("@complemento", transpDto.complemento);
        if (transpDto.bairro != null) command.Parameters.AddWithValue("@bairro", transpDto.bairro);
        if (transpDto.codCidade.HasValue) command.Parameters.AddWithValue("@codCidade", transpDto.codCidade.Value);
        if (transpDto.cep != null) command.Parameters.AddWithValue("@cep", transpDto.cep);
        if (transpDto.site != null) command.Parameters.AddWithValue("@site", transpDto.site);
        if (transpDto.fone != null) command.Parameters.AddWithValue("@fone", transpDto.fone);
        if (transpDto.email != null) command.Parameters.AddWithValue("@email", transpDto.email);
        if (transpDto.ativo.HasValue) command.Parameters.AddWithValue("@ativo", transpDto.ativo.Value);

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
    [HttpDelete("{codTransp:int}")]
    public async Task<ActionResult> Deletar(int codTransp, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM transportadores WHERE codTransp = @codTransp";
        command.Parameters.AddWithValue("@codTransp", codTransp);

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

    private static TransportadoresReadDto MapearTransportador(MySqlDataReader reader)
    {
        var dto = new TransportadoresReadDto
        {
            codTransp = reader.GetInt32("codTransp"),
            apelido_NomeFantasia = reader.GetString("apelido_NomeFantasia"),
            transportador = reader.IsDBNull(reader.GetOrdinal("transportador")) ? string.Empty : reader.GetString("transportador"),
            inscEstTransp = reader.IsDBNull(reader.GetOrdinal("inscEstTransp")) ? string.Empty : reader.GetString("inscEstTransp"),
            tipoPessoa = reader.GetString("tipoPessoa"),
            cpf_cnpjTransp = reader.IsDBNull(reader.GetOrdinal("cpf_cnpjTransp")) ? string.Empty : reader.GetString("cpf_cnpjTransp"),
            ender = reader.IsDBNull(reader.GetOrdinal("ender")) ? string.Empty : reader.GetString("ender"),
            numero = reader.IsDBNull(reader.GetOrdinal("numero")) ? string.Empty : reader.GetString("numero"),
            complemento = reader.IsDBNull(reader.GetOrdinal("complemento")) ? string.Empty : reader.GetString("complemento"),
            bairro = reader.IsDBNull(reader.GetOrdinal("bairro")) ? string.Empty : reader.GetString("bairro"),
            codCidade = reader.IsDBNull(reader.GetOrdinal("codCidade")) ? 0 : reader.GetInt32("codCidade"),
            cep = reader.IsDBNull(reader.GetOrdinal("cep")) ? string.Empty : reader.GetString("cep"),
            site = reader.IsDBNull(reader.GetOrdinal("site")) ? string.Empty : reader.GetString("site"),
            fone = reader.IsDBNull(reader.GetOrdinal("fone")) ? string.Empty : reader.GetString("fone"),
            email = reader.IsDBNull(reader.GetOrdinal("email")) ? string.Empty : reader.GetString("email"),
            ativo = reader.GetBoolean("ativo"),
            codUsuario = reader.IsDBNull(reader.GetOrdinal("codUsuario")) ? 0 : reader.GetInt32("codUsuario"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };
        
        if (dto.codCidade != 0 && !reader.IsDBNull(reader.GetOrdinal("cidade")))
        {
            dto.Cidade = new CidadesReadDto
            {
                codCidade = dto.codCidade,
                cidade = reader.GetString("cidade"),
                codEstado = reader.IsDBNull(reader.GetOrdinal("codEstado")) ? 0 : reader.GetInt32("codEstado")
            };
        }

        if (!reader.IsDBNull(reader.GetOrdinal("u_codUsuario")))
        {
            dto.Usuario = new UsuarioReadDto
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

        return dto;
    }
}
