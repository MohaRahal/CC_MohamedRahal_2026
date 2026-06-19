using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FuncionariosController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public FuncionariosController(MySqlConnection connection)
    {
        _connection = connection;
    }

////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<FuncionarioReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var list = new List<FuncionarioReadDto>();
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codFuncionario, funcionario, cpf, data_nascimento,
                sexo, codCargo, ender, numero, complemento,
                bairro, codCidade, cep, fone,
                criado_em, atualizado_em
            FROM funcionarios
            ORDER BY funcionario
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
            list.Add(MapearFuncionario(reader));
        return Ok(list);
    }

////[Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<FuncionarioReadDto>> BuscarPorId(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                codFuncionario, funcionario, cpf, data_nascimento,
                sexo, codCargo, ender, numero, complemento,
                bairro, codCidade, cep, fone,
                criado_em, atualizado_em
            FROM funcionarios
            WHERE codFuncionario = @codFuncionario
            """;
        command.Parameters.AddWithValue("@codFuncionario", id);
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
            return Ok(MapearFuncionario(reader));
        return NotFound();
    }

////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] FuncionarioCreateDto dto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);
        command.CommandText = """
            INSERT INTO funcionarios
                (funcionario, cpf, data_nascimento, sexo, codCargo,
                 ender, numero, complemento, bairro, codCidade, cep, fone, codUsuario)
            VALUES
                (@funcionario, @cpf, @data_nascimento, @sexo, @codCargo,
                 @ender, @numero, @complemento, @bairro, @codCidade, @cep, @fone, @codUsuario);
            """;
        command.Parameters.AddWithValue("@funcionario", dto.funcionario);
        command.Parameters.AddWithValue("@cpf", dto.cpf);
        command.Parameters.AddWithValue("@data_nascimento", dto.data_nascimento);
        command.Parameters.AddWithValue("@sexo", dto.sexo);
        command.Parameters.AddWithValue("@codCargo", dto.codCargo);
        command.Parameters.AddWithValue("@ender", (object?)dto.ender ?? DBNull.Value);
        command.Parameters.AddWithValue("@numero", (object?)dto.numero ?? DBNull.Value);
        command.Parameters.AddWithValue("@complemento", (object?)dto.complemento ?? DBNull.Value);
        command.Parameters.AddWithValue("@bairro", (object?)dto.bairro ?? DBNull.Value);
        command.Parameters.AddWithValue("@codCidade", (object?)dto.codCidade ?? DBNull.Value);
        command.Parameters.AddWithValue("@cep", (object?)dto.cep ?? DBNull.Value);
        command.Parameters.AddWithValue("@fone", (object?)dto.fone ?? DBNull.Value);
        command.Parameters.AddWithValue("@codUsuario", (object?)idUserLogado ?? DBNull.Value);

        var rows = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rows > 0)
            return CreatedAtAction(nameof(BuscarPorId), new { id = command.LastInsertedId }, null);
        return StatusCode(500, "Erro ao criar funcionário.");
    }

////[Authorize]
    [HttpPatch("{id:int}")]
    public async Task<ActionResult> Atualizar(int id, [FromBody] FuncionarioUpdateDto dto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        var updates = new List<string>();
        if (dto.funcionario != null) updates.Add("funcionario = @funcionario");
        if (dto.cpf != null) updates.Add("cpf = @cpf");
        if (dto.data_nascimento != null) updates.Add("data_nascimento = @data_nascimento");
        if (dto.sexo != null) updates.Add("sexo = @sexo");
        if (dto.codCargo.HasValue) updates.Add("codCargo = @codCargo");
        if (dto.ender != null) updates.Add("ender = @ender");
        if (dto.numero != null) updates.Add("numero = @numero");
        if (dto.complemento != null) updates.Add("complemento = @complemento");
        if (dto.bairro != null) updates.Add("bairro = @bairro");
        if (dto.codCidade.HasValue) updates.Add("codCidade = @codCidade");
        if (dto.cep != null) updates.Add("cep = @cep");
        if (dto.fone != null) updates.Add("fone = @fone");

        if (updates.Count == 0) return BadRequest("Nenhum campo para atualizar.");

        var updateClause = string.Join(", ", updates);
        await using var command = _connection.CreateCommand();
        command.CommandText = $"UPDATE funcionarios SET {updateClause} WHERE codFuncionario = @codFuncionario";
        command.Parameters.AddWithValue("@codFuncionario", id);
        if (dto.funcionario != null) command.Parameters.AddWithValue("@funcionario", dto.funcionario);
        if (dto.cpf != null) command.Parameters.AddWithValue("@cpf", dto.cpf);
        if (dto.data_nascimento != null) command.Parameters.AddWithValue("@data_nascimento", dto.data_nascimento);
        if (dto.sexo != null) command.Parameters.AddWithValue("@sexo", dto.sexo);
        if (dto.codCargo.HasValue) command.Parameters.AddWithValue("@codCargo", dto.codCargo.Value);
        if (dto.ender != null) command.Parameters.AddWithValue("@ender", dto.ender);
        if (dto.numero != null) command.Parameters.AddWithValue("@numero", dto.numero);
        if (dto.complemento != null) command.Parameters.AddWithValue("@complemento", dto.complemento);
        if (dto.bairro != null) command.Parameters.AddWithValue("@bairro", dto.bairro);
        if (dto.codCidade.HasValue) command.Parameters.AddWithValue("@codCidade", dto.codCidade.Value);
        if (dto.cep != null) command.Parameters.AddWithValue("@cep", dto.cep);
        if (dto.fone != null) command.Parameters.AddWithValue("@fone", dto.fone);

        var rows = await command.ExecuteNonQueryAsync(cancellationToken);
        return rows > 0 ? NoContent() : NotFound();
    }

////[Authorize]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Deletar(int id, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM funcionarios WHERE codFuncionario = @codFuncionario";
        command.Parameters.AddWithValue("@codFuncionario", id);
        var rows = await command.ExecuteNonQueryAsync(cancellationToken);
        return rows > 0 ? NoContent() : NotFound();
    }

    private static FuncionarioReadDto MapearFuncionario(MySqlDataReader r) => new()
    {
        codFuncionario    = r.GetInt32("codFuncionario"),
        funcionario       = r.GetString("funcionario"),
        cpf               = r.IsDBNull(r.GetOrdinal("cpf")) ? string.Empty : r.GetString("cpf"),
        data_nascimento   = r.IsDBNull(r.GetOrdinal("data_nascimento")) ? string.Empty : r.GetString("data_nascimento"),
        sexo              = r.IsDBNull(r.GetOrdinal("sexo")) ? string.Empty : r.GetString("sexo"),
        codCargo          = r.GetInt32("codCargo"),
        ender             = r.IsDBNull(r.GetOrdinal("ender")) ? null : r.GetString("ender"),
        numero            = r.IsDBNull(r.GetOrdinal("numero")) ? null : r.GetString("numero"),
        complemento       = r.IsDBNull(r.GetOrdinal("complemento")) ? null : r.GetString("complemento"),
        bairro            = r.IsDBNull(r.GetOrdinal("bairro")) ? null : r.GetString("bairro"),
        codCidade         = r.IsDBNull(r.GetOrdinal("codCidade")) ? null : r.GetInt32("codCidade"),
        cep               = r.IsDBNull(r.GetOrdinal("cep")) ? null : r.GetString("cep"),
        fone              = r.IsDBNull(r.GetOrdinal("fone")) ? null : r.GetString("fone"),
        criado_em         = r.GetDateTime("criado_em"),
        atualizado_em     = r.GetDateTime("atualizado_em"),
    };
}
