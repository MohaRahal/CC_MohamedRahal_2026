using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly MySqlConnection _connection;
    public ClientesController(MySqlConnection connection)
    {
        _connection = connection;
    }
////[Authorize]
    [HttpGet]
    public async Task<ActionResult<List<ClientesReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var clientes = new List<ClientesReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                cl.codCliente,
                cl.cliente,
                cl.rg_inscEst,
                cl.tipoPessoa,
                cl.cpf_cnpj,
                cl.ender,
                cl.numero,
                cl.complemento,
                cl.bairro,
                cl.codCidade,
                cl.cep,
                cl.site,
                cl.fone,
                cl.email,
                cl.limiteCredito,
                cl.codCondPagamento,
                cl.codUsuario,
                cl.criado_em,
                cl.atualizado_em,
                c.codCidade AS Cidade_codCidade,
                c.cidade AS Cidade_cidade,
                c.codEstado AS Cidade_codEstado,
                c.codUsuario AS Cidade_codUsuario,
                c.criado_em AS Cidade_criado_em,
                c.atualizado_em AS Cidade_atualizado_em,
                cp.codCondPagamento AS Condicao_codCondPagamento,
                cp.condPagamento AS Condicao_condPagamento,
                cp.qtdParcelas AS Condicao_qtdParcelas,
                cp.ativo AS Condicao_ativo,
                cp.juros AS Condicao_juros,
                cp.multa AS Condicao_multa,
                cp.desconto AS Condicao_desconto,
                cp.criado_em AS Condicao_criado_em,
                cp.atualizado_em AS Condicao_atualizado_em,
                u.codUsuario AS Usuario_codUsuario,
                u.usuario AS Usuario_usuario,
                u.codFuncionario AS Usuario_codFuncionario,
                u.codCargo AS Usuario_codCargo,
                u.ativo AS Usuario_ativo,
                u.criado_em AS Usuario_criado_em,
                u.atualizado_em AS Usuario_atualizado_em
            FROM clientes cl
            LEFT JOIN cidades c ON cl.codCidade = c.codCidade
            LEFT JOIN condicoes_pagamento cp ON cl.codCondPagamento = cp.codCondPagamento
            LEFT JOIN usuarios u ON cl.codUsuario = u.codUsuario
            """;
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            clientes.Add(MapearCliente(reader));
        }
        return Ok(clientes);
    }
////[Authorize]
    [HttpGet("{codCliente:int}")]
    public async Task<ActionResult<ClientesReadDto>> BuscarPorCodigo(int codCliente, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT
                cl.codCliente,
                cl.cliente,
                cl.rg_inscEst,
                cl.tipoPessoa,
                cl.cpf_cnpj,
                cl.ender,
                cl.numero,
                cl.complemento,
                cl.bairro,
                cl.codCidade,
                cl.cep,
                cl.site,
                cl.fone,
                cl.email,
                cl.limiteCredito,
                cl.codCondPagamento,
                cl.codUsuario,
                cl.criado_em,
                cl.atualizado_em,
                c.codCidade AS Cidade_codCidade,
                c.cidade AS Cidade_cidade,
                c.codEstado AS Cidade_codEstado,
                c.codUsuario AS Cidade_codUsuario,
                c.criado_em AS Cidade_criado_em,
                c.atualizado_em AS Cidade_atualizado_em,
                cp.codCondPagamento AS Condicao_codCondPagamento,
                cp.condPagamento AS Condicao_condPagamento,
                cp.qtdParcelas AS Condicao_qtdParcelas,
                cp.ativo AS Condicao_ativo,
                cp.juros AS Condicao_juros,
                cp.multa AS Condicao_multa,
                cp.desconto AS Condicao_desconto,
                cp.criado_em AS Condicao_criado_em,
                cp.atualizado_em AS Condicao_atualizado_em,
                u.codUsuario AS Usuario_codUsuario,
                u.usuario AS Usuario_usuario,
                u.codFuncionario AS Usuario_codFuncionario,
                u.codCargo AS Usuario_codCargo,
                u.ativo AS Usuario_ativo,
                u.criado_em AS Usuario_criado_em,
                u.atualizado_em AS Usuario_atualizado_em
            FROM clientes cl
            LEFT JOIN cidades c ON cl.codCidade = c.codCidade
            LEFT JOIN condicoes_pagamento cp ON cl.codCondPagamento = cp.codCondPagamento
            LEFT JOIN usuarios u ON cl.codUsuario = u.codUsuario
            WHERE cl.codCliente = @codCliente
            """;
        command.Parameters.AddWithValue("@codCliente", codCliente);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return Ok(MapearCliente(reader));
        }
        else
        {
            return NotFound();
        }
    }
////[Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] ClientesCreateDto clienteDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var idUserLogado = string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);
        Console.WriteLine(idUserLogado);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO clientes (cliente, rg_inscEst, tipoPessoa, cpf_cnpj, ender, numero, complemento, bairro, codCidade, cep, site, fone, email, limiteCredito, codCondPagamento, codUsuario)
            VALUES (@cliente, @rg_inscEst, @tipoPessoa, @cpf_cnpj, @ender, @numero, @complemento, @bairro, @codCidade, @cep, @site, @fone, @email, @limiteCredito, @codCondPagamento, @codUsuario);
            """;

        command.Parameters.AddWithValue("@cliente", string.IsNullOrEmpty(clienteDto.cliente) ? (object)DBNull.Value : clienteDto.cliente);
        command.Parameters.AddWithValue("@rg_inscEst", string.IsNullOrEmpty(clienteDto.rg_inscEst) ? (object)DBNull.Value : clienteDto.rg_inscEst);
        command.Parameters.AddWithValue("@tipoPessoa", string.IsNullOrEmpty(clienteDto.tipoPessoa) ? (object)DBNull.Value : clienteDto.tipoPessoa);
        command.Parameters.AddWithValue("@cpf_cnpj", string.IsNullOrEmpty(clienteDto.cpf_cnpj) ? (object)DBNull.Value : clienteDto.cpf_cnpj);
        command.Parameters.AddWithValue("@ender", string.IsNullOrEmpty(clienteDto.ender) ? (object)DBNull.Value : clienteDto.ender);
        command.Parameters.AddWithValue("@numero", string.IsNullOrEmpty(clienteDto.numero) ? (object)DBNull.Value : clienteDto.numero);
        command.Parameters.AddWithValue("@complemento", string.IsNullOrEmpty(clienteDto.complemento) ? (object)DBNull.Value : clienteDto.complemento);
        command.Parameters.AddWithValue("@bairro", string.IsNullOrEmpty(clienteDto.bairro) ? (object)DBNull.Value : clienteDto.bairro);
        command.Parameters.AddWithValue("@codCidade", clienteDto.codCidade > 0 ? clienteDto.codCidade : DBNull.Value);
        command.Parameters.AddWithValue("@cep", string.IsNullOrEmpty(clienteDto.cep) ? (object)DBNull.Value : clienteDto.cep);
        command.Parameters.AddWithValue("@site", string.IsNullOrEmpty(clienteDto.site) ? (object)DBNull.Value : clienteDto.site);
        command.Parameters.AddWithValue("@fone", string.IsNullOrEmpty(clienteDto.fone) ? (object)DBNull.Value : clienteDto.fone);
        command.Parameters.AddWithValue("@email", string.IsNullOrEmpty(clienteDto.email) ? (object)DBNull.Value : clienteDto.email);
        command.Parameters.AddWithValue("@limiteCredito", clienteDto.limiteCredito);
        command.Parameters.AddWithValue("@codCondPagamento", clienteDto.codCondPagamento > 0 ? clienteDto.codCondPagamento : DBNull.Value);
        command.Parameters.AddWithValue("@codUsuario", idUserLogado);

        var rowsAffected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsAffected > 0)
        {
            return CreatedAtAction(nameof(BuscarPorCodigo), new { codCliente = command.LastInsertedId }, new { codCliente = command.LastInsertedId });
        }
        else
        {
            return StatusCode(500, "Ocorreu um erro ao criar o cliente.");
        }
    }
////[Authorize]
    [HttpPatch("{codCliente:int}")]
    public async Task<ActionResult> Atualizar(int codCliente, [FromBody] ClientesUpdateDto clienteDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        var updates = new List<string>();
        if (clienteDto.cliente != null) updates.Add("cliente = @cliente");
        if (clienteDto.rg_inscEst != null) updates.Add("rg_inscEst = @rg_inscEst");
        if (clienteDto.tipoPessoa != null) updates.Add("tipoPessoa = @tipoPessoa");
        if (clienteDto.cpf_cnpj != null) updates.Add("cpf_cnpj = @cpf_cnpj");
        if (clienteDto.ender != null) updates.Add("ender = @ender");
        if (clienteDto.numero != null) updates.Add("numero = @numero");
        if (clienteDto.complemento != null) updates.Add("complemento = @complemento");
        if (clienteDto.bairro != null) updates.Add("bairro = @bairro");
        if (clienteDto.codCidade.HasValue) updates.Add("codCidade = @codCidade");
        if (clienteDto.cep != null) updates.Add("cep = @cep");
        if (clienteDto.site != null) updates.Add("site = @site");
        if (clienteDto.fone != null) updates.Add("fone = @fone");
        if (clienteDto.email != null) updates.Add("email = @email");
        if (clienteDto.limiteCredito.HasValue) updates.Add("limiteCredito = @limiteCredito");
        if (clienteDto.codCondPagamento.HasValue) updates.Add("codCondPagamento = @codCondPagamento");

        if (updates.Count == 0)
        {
            return BadRequest("Nenhum campo para atualizar.");
        }

        var updateClause = string.Join(", ", updates);
        var commandText = $"UPDATE clientes SET {updateClause} WHERE codCliente = @codCliente";

        await using var command = _connection.CreateCommand();
        command.CommandText = commandText;
        command.Parameters.AddWithValue("@codCliente", codCliente);

        if (clienteDto.cliente != null) command.Parameters.AddWithValue("@cliente", clienteDto.cliente);
        if (clienteDto.rg_inscEst != null) command.Parameters.AddWithValue("@rg_inscEst", clienteDto.rg_inscEst);
        if (clienteDto.tipoPessoa != null) command.Parameters.AddWithValue("@tipoPessoa", clienteDto.tipoPessoa);
        if (clienteDto.cpf_cnpj != null) command.Parameters.AddWithValue("@cpf_cnpj", clienteDto.cpf_cnpj);
        if (clienteDto.ender != null) command.Parameters.AddWithValue("@ender", clienteDto.ender);
        if (clienteDto.numero != null) command.Parameters.AddWithValue("@numero", clienteDto.numero);
        if (clienteDto.complemento != null) command.Parameters.AddWithValue("@complemento", clienteDto.complemento);
        if (clienteDto.bairro != null) command.Parameters.AddWithValue("@bairro", clienteDto.bairro);
        if (clienteDto.codCidade.HasValue) command.Parameters.AddWithValue("@codCidade", clienteDto.codCidade.Value);
        if (clienteDto.cep != null) command.Parameters.AddWithValue("@cep", clienteDto.cep);
        if (clienteDto.site != null) command.Parameters.AddWithValue("@site", clienteDto.site);
        if (clienteDto.fone != null) command.Parameters.AddWithValue("@fone", clienteDto.fone);
        if (clienteDto.email != null) command.Parameters.AddWithValue("@email", clienteDto.email);
        if (clienteDto.limiteCredito.HasValue) command.Parameters.AddWithValue("@limiteCredito", clienteDto.limiteCredito.Value);
        if (clienteDto.codCondPagamento.HasValue) command.Parameters.AddWithValue("@codCondPagamento", clienteDto.codCondPagamento.Value);

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
    [HttpDelete("{codCliente:int}")]
    public async Task<ActionResult> Deletar(int codCliente, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = "DELETE FROM clientes WHERE codCliente = @codCliente";
        command.Parameters.AddWithValue("@codCliente", codCliente);

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

    private static ClientesReadDto MapearCliente(MySqlDataReader reader)
    {
        var dto = new ClientesReadDto
        {
            codCliente = reader.GetInt32("codCliente"),
            cliente = reader.IsDBNull(reader.GetOrdinal("cliente")) ? string.Empty : reader.GetString("cliente"),
            rg_inscEst = reader.IsDBNull(reader.GetOrdinal("rg_inscEst")) ? string.Empty : reader.GetString("rg_inscEst"),
            tipoPessoa = reader.IsDBNull(reader.GetOrdinal("tipoPessoa")) ? string.Empty : reader.GetString("tipoPessoa"),
            cpf_cnpj = reader.IsDBNull(reader.GetOrdinal("cpf_cnpj")) ? string.Empty : reader.GetString("cpf_cnpj"),
            ender = reader.IsDBNull(reader.GetOrdinal("ender")) ? string.Empty : reader.GetString("ender"),
            numero = reader.IsDBNull(reader.GetOrdinal("numero")) ? string.Empty : reader.GetString("numero"),
            complemento = reader.IsDBNull(reader.GetOrdinal("complemento")) ? string.Empty : reader.GetString("complemento"),
            bairro = reader.IsDBNull(reader.GetOrdinal("bairro")) ? string.Empty : reader.GetString("bairro"),
            codCidade = reader.IsDBNull(reader.GetOrdinal("codCidade")) ? 0 : reader.GetInt32("codCidade"),
            cep = reader.IsDBNull(reader.GetOrdinal("cep")) ? string.Empty : reader.GetString("cep"),
            site = reader.IsDBNull(reader.GetOrdinal("site")) ? string.Empty : reader.GetString("site"),
            fone = reader.IsDBNull(reader.GetOrdinal("fone")) ? string.Empty : reader.GetString("fone"),
            email = reader.IsDBNull(reader.GetOrdinal("email")) ? string.Empty : reader.GetString("email"),
            limiteCredito = reader.IsDBNull(reader.GetOrdinal("limiteCredito")) ? 0m : reader.GetDecimal("limiteCredito"),
            codCondPagamento = reader.IsDBNull(reader.GetOrdinal("codCondPagamento")) ? 0 : reader.GetInt32("codCondPagamento"),
            codUsuario = reader.IsDBNull(reader.GetOrdinal("codUsuario")) ? 0 : reader.GetInt32("codUsuario"),
            criado_em = reader.GetDateTime("criado_em"),
            atualizado_em = reader.GetDateTime("atualizado_em")
        };

        if (!reader.IsDBNull(reader.GetOrdinal("Cidade_codCidade")))
        {
            dto.Cidade = new CidadesReadDto
            {
                codCidade = reader.GetInt32("Cidade_codCidade"),
                cidade = reader.GetString("Cidade_cidade"),
                codEstado = reader.IsDBNull(reader.GetOrdinal("Cidade_codEstado")) ? null : reader.GetInt32("Cidade_codEstado"),
                codUsuario = reader.IsDBNull(reader.GetOrdinal("Cidade_codUsuario")) ? 0 : reader.GetInt32("Cidade_codUsuario"),
                criado_em = reader.GetDateTime("Cidade_criado_em"),
                atualizado_em = reader.GetDateTime("Cidade_atualizado_em")
            };
        }

        if (!reader.IsDBNull(reader.GetOrdinal("Condicao_codCondPagamento")))
        {
            dto.CondicaoPagamento = new CondicoesPagamentoReadDto
            {
                codCondPagamento = reader.GetInt32("Condicao_codCondPagamento"),
                condPagamento = reader.GetString("Condicao_condPagamento"),
                qtdParcelas = reader.GetInt32("Condicao_qtdParcelas"),
                ativo = reader.GetBoolean("Condicao_ativo"),
                juros = reader.GetDecimal("Condicao_juros"),
                multa = reader.GetDecimal("Condicao_multa"),
                desconto = reader.GetDecimal("Condicao_desconto"),
                criado_em = reader.GetDateTime("Condicao_criado_em"),
                atualizado_em = reader.GetDateTime("Condicao_atualizado_em")
            };
        }

        if (!reader.IsDBNull(reader.GetOrdinal("Usuario_codUsuario")))
        {
            dto.Usuario = new UsuarioReadDto
            {
                codUsuario = reader.GetInt32("Usuario_codUsuario"),
                usuario = reader.GetString("Usuario_usuario"),
                codFuncionario = reader.IsDBNull(reader.GetOrdinal("Usuario_codFuncionario")) ? 0 : reader.GetInt32("Usuario_codFuncionario"),
                codCargo = reader.IsDBNull(reader.GetOrdinal("Usuario_codCargo")) ? 0 : reader.GetInt32("Usuario_codCargo"),
                ativo = reader.GetBoolean("Usuario_ativo"),
                criado_em = reader.GetDateTime("Usuario_criado_em"),
                atualizado_em = reader.GetDateTime("Usuario_atualizado_em")
            };
        }

        return dto;
    }
}
