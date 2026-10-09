using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComprasController : ControllerBase
{
    private readonly MySqlConnection _connection;

    public ComprasController(MySqlConnection connection) => _connection = connection;

    [HttpGet]
    public async Task<ActionResult<List<CompraReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var compras = new List<CompraReadDto>();
        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = $"""
            {SelectCompra}
            ORDER BY c.dataEntNfe DESC, c.criado_em DESC
            """;

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken)) compras.Add(MapearCompra(reader));
        return Ok(compras);
    }

    [HttpGet("{numNfe:int}/{serie:int}/{modelo:int}/{codForn:int}")]
    public async Task<ActionResult<CompraReadDto>> Buscar(
        int numNfe, int serie, int modelo, int codForn, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        CompraReadDto? compra;

        await using (var command = _connection.CreateCommand())
        {
            command.CommandText = $"""
                {SelectCompra}
                WHERE c.numNfe = @numNfe AND c.serie = @serie
                  AND c.modelo = @modelo AND c.codForn = @codForn
                """;
            AdicionarChave(command, numNfe, serie, modelo, codForn);
            await using var reader = await command.ExecuteReaderAsync(cancellationToken);
            if (!await reader.ReadAsync(cancellationToken)) return NotFound();
            compra = MapearCompra(reader);
        }

        await using (var command = _connection.CreateCommand())
        {
            command.CommandText = """
                SELECT cp.numParcela, cp.vencimentoParcela, cp.valorParcela,
                       cp.codFormaPagamento, fp.formaPagamento
                FROM contas_pagar cp
                INNER JOIN formas_pagamento fp ON fp.codFormaPagamento = cp.codFormaPagamento
                WHERE cp.numNfe = @numNfe AND cp.serie = @serie
                  AND cp.modelo = @modelo AND cp.codForn = @codForn
                ORDER BY cp.numParcela
                """;
            AdicionarChave(command, numNfe, serie, modelo, codForn);
            await using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                compra.parcelas.Add(new ContaPagarDto
                {
                    numParcela = reader.GetInt32("numParcela"),
                    vencimentoParcela = DateOnly.FromDateTime(reader.GetDateTime("vencimentoParcela")),
                    valorParcela = reader.GetDecimal("valorParcela"),
                    codFormaPagamento = reader.GetInt32("codFormaPagamento"),
                    formaPagamento = reader.GetString("formaPagamento")
                });
            }
        }

        return Ok(compra);
    }

    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] CompraCreateDto dto, CancellationToken cancellationToken)
    {
        if (dto.numNfe <= 0 || dto.serie <= 0 || dto.modelo <= 0 || dto.codForn <= 0)
            return BadRequest("Nota, série, modelo e fornecedor são obrigatórios.");
        if (dto.parcelas.Any(p => p.numParcela <= 0 || p.valorParcela <= 0 || p.codFormaPagamento <= 0))
            return BadRequest("Todas as parcelas devem ter número, valor e forma de pagamento válidos.");
        if (dto.parcelas.GroupBy(p => p.numParcela).Any(g => g.Count() > 1))
            return BadRequest("Existem números de parcela repetidos.");

        await _connection.OpenAsync(cancellationToken);
        await using var transaction = await _connection.BeginTransactionAsync(cancellationToken);
        try
        {
            await using (var command = _connection.CreateCommand())
            {
                command.Transaction = transaction;
                command.CommandText = """
                    INSERT INTO compras (
                        numNfe, serie, modelo, codForn, pagina, natOper, protAcesso,
                        dataProtAcesso, horaProtAcesso, chaveAcessoNFe, dataEmitNfe,
                        dataEntNfe, horaEntNFe, baseCalcIcms, valorIcms, baseCalcIcmsSub,
                        valorIcmsSub, valorFreteNFe, valorSeguroNFe, descontoNFe,
                        outrasDespNfe, valorIpi, codTransp, fretePorContaNFe, codVeic,
                        qtdadeVol, especieVol, marcaVol, numVol, pesoBrutoVol, pesoLiqVol,
                        infComp, codFormaPagamento, codCondPagamento
                    ) VALUES (
                        @numNfe, @serie, @modelo, @codForn, @pagina, @natOper, @protAcesso,
                        @dataProtAcesso, @horaProtAcesso, @chaveAcessoNFe, @dataEmitNfe,
                        @dataEntNfe, @horaEntNFe, @baseCalcIcms, @valorIcms, @baseCalcIcmsSub,
                        @valorIcmsSub, @valorFreteNFe, @valorSeguroNFe, @descontoNFe,
                        @outrasDespNfe, @valorIpi, @codTransp, @fretePorContaNFe, @codVeic,
                        @qtdadeVol, @especieVol, @marcaVol, @numVol, @pesoBrutoVol, @pesoLiqVol,
                        @infComp, @codFormaPagamento, @codCondPagamento
                    )
                    """;
                AdicionarParametros(command, dto);
                await command.ExecuteNonQueryAsync(cancellationToken);
            }

            foreach (var parcela in dto.parcelas)
            {
                await using var command = _connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = """
                    INSERT INTO contas_pagar
                        (numNfe, serie, modelo, codForn, numParcela, vencimentoParcela, valorParcela, codFormaPagamento)
                    VALUES
                        (@numNfe, @serie, @modelo, @codForn, @numParcela, @vencimento, @valor, @forma)
                    """;
                AdicionarChave(command, dto.numNfe, dto.serie, dto.modelo, dto.codForn);
                command.Parameters.AddWithValue("@numParcela", parcela.numParcela);
                command.Parameters.AddWithValue("@vencimento", parcela.vencimentoParcela);
                command.Parameters.AddWithValue("@valor", parcela.valorParcela);
                command.Parameters.AddWithValue("@forma", parcela.codFormaPagamento);
                await command.ExecuteNonQueryAsync(cancellationToken);
            }

            await transaction.CommitAsync(cancellationToken);
            return CreatedAtAction(nameof(Buscar), new { dto.numNfe, dto.serie, dto.modelo, dto.codForn }, null);
        }
        catch (MySqlException ex) when (ex.Number == 1062)
        {
            await transaction.RollbackAsync(cancellationToken);
            return Conflict("Já existe uma compra com esta nota, série, modelo e fornecedor.");
        }
        catch (MySqlException ex) when (ex.Number == 1452)
        {
            await transaction.RollbackAsync(cancellationToken);
            return BadRequest("Um dos cadastros vinculados não existe ou está inválido.");
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    [HttpDelete("{numNfe:int}/{serie:int}/{modelo:int}/{codForn:int}")]
    public async Task<ActionResult> Excluir(
        int numNfe, int serie, int modelo, int codForn, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var transaction = await _connection.BeginTransactionAsync(cancellationToken);

        await using (var parcelas = _connection.CreateCommand())
        {
            parcelas.Transaction = transaction;
            parcelas.CommandText = """
                DELETE FROM contas_pagar WHERE numNfe = @numNfe AND serie = @serie
                AND modelo = @modelo AND codForn = @codForn
                """;
            AdicionarChave(parcelas, numNfe, serie, modelo, codForn);
            await parcelas.ExecuteNonQueryAsync(cancellationToken);
        }

        int afetadas;
        await using (var compra = _connection.CreateCommand())
        {
            compra.Transaction = transaction;
            compra.CommandText = """
                DELETE FROM compras WHERE numNfe = @numNfe AND serie = @serie
                AND modelo = @modelo AND codForn = @codForn
                """;
            AdicionarChave(compra, numNfe, serie, modelo, codForn);
            afetadas = await compra.ExecuteNonQueryAsync(cancellationToken);
        }

        if (afetadas == 0)
        {
            await transaction.RollbackAsync(cancellationToken);
            return NotFound();
        }

        await transaction.CommitAsync(cancellationToken);
        return NoContent();
    }

    private const string SelectCompra = """
        SELECT c.*, f.fornecedor, t.transportador,
               COALESCE(v.placaMercosul, v.placaVeiculo) AS veiculo,
               fp.formaPagamento, cp.condPagamento,
               COALESCE((SELECT SUM(x.valorParcela) FROM contas_pagar x
                         WHERE x.numNfe = c.numNfe AND x.serie = c.serie
                           AND x.modelo = c.modelo AND x.codForn = c.codForn), 0) AS totalParcelas
        FROM compras c
        INNER JOIN fornecedores f ON f.codForn = c.codForn
        LEFT JOIN transportadores t ON t.codTransp = c.codTransp
        LEFT JOIN veiculos v ON v.codVeiculo = c.codVeic
        LEFT JOIN formas_pagamento fp ON fp.codFormaPagamento = c.codFormaPagamento
        LEFT JOIN condicoes_pagamento cp ON cp.codCondPagamento = c.codCondPagamento
        """;

    private static CompraReadDto MapearCompra(MySqlDataReader r) => new()
    {
        numNfe = r.GetInt32("numNfe"), serie = r.GetInt32("serie"), modelo = r.GetInt32("modelo"),
        codForn = r.GetInt32("codForn"), fornecedor = r.GetString("fornecedor"),
        pagina = Int32N(r, "pagina"), natOper = StringN(r, "natOper"), protAcesso = StringN(r, "protAcesso"),
        dataProtAcesso = DateN(r, "dataProtAcesso"), horaProtAcesso = TimeN(r, "horaProtAcesso"),
        chaveAcessoNFe = StringN(r, "chaveAcessoNFe"), dataEmitNfe = DateN(r, "dataEmitNfe"),
        dataEntNfe = DateN(r, "dataEntNfe"), horaEntNFe = TimeN(r, "horaEntNFe"),
        baseCalcIcms = DecimalN(r, "baseCalcIcms"), valorIcms = DecimalN(r, "valorIcms"),
        baseCalcIcmsSub = DecimalN(r, "baseCalcIcmsSub"), valorIcmsSub = DecimalN(r, "valorIcmsSub"),
        valorFreteNFe = DecimalN(r, "valorFreteNFe"), valorSeguroNFe = DecimalN(r, "valorSeguroNFe"),
        descontoNFe = DecimalN(r, "descontoNFe"), outrasDespNfe = DecimalN(r, "outrasDespNfe"),
        valorIpi = DecimalN(r, "valorIpi"), codTransp = Int32N(r, "codTransp"),
        transportador = StringN(r, "transportador"), fretePorContaNFe = Int32N(r, "fretePorContaNFe"),
        codVeic = Int32N(r, "codVeic"), veiculo = StringN(r, "veiculo"), qtdadeVol = Int32N(r, "qtdadeVol"),
        especieVol = StringN(r, "especieVol"), marcaVol = StringN(r, "marcaVol"), numVol = StringN(r, "numVol"),
        pesoBrutoVol = DecimalN(r, "pesoBrutoVol"), pesoLiqVol = DecimalN(r, "pesoLiqVol"),
        infComp = StringN(r, "infComp"), codFormaPagamento = Int32N(r, "codFormaPagamento"),
        formaPagamento = StringN(r, "formaPagamento"), codCondPagamento = Int32N(r, "codCondPagamento"),
        condPagamento = StringN(r, "condPagamento"), totalParcelas = r.GetDecimal("totalParcelas"),
        criado_em = r.GetDateTime("criado_em"), atualizado_em = r.GetDateTime("atualizado_em")
    };

    private static void AdicionarChave(MySqlCommand c, int nota, int serie, int modelo, int fornecedor)
    {
        c.Parameters.AddWithValue("@numNfe", nota); c.Parameters.AddWithValue("@serie", serie);
        c.Parameters.AddWithValue("@modelo", modelo); c.Parameters.AddWithValue("@codForn", fornecedor);
    }

    private static void AdicionarParametros(MySqlCommand c, CompraCreateDto d)
    {
        AdicionarChave(c, d.numNfe, d.serie, d.modelo, d.codForn);
        void Add(string nome, object? valor) => c.Parameters.AddWithValue(nome, valor ?? DBNull.Value);
        Add("@pagina", d.pagina); Add("@natOper", d.natOper); Add("@protAcesso", d.protAcesso);
        Add("@dataProtAcesso", d.dataProtAcesso); Add("@horaProtAcesso", d.horaProtAcesso);
        Add("@chaveAcessoNFe", d.chaveAcessoNFe); Add("@dataEmitNfe", d.dataEmitNfe);
        Add("@dataEntNfe", d.dataEntNfe); Add("@horaEntNFe", d.horaEntNFe);
        Add("@baseCalcIcms", d.baseCalcIcms); Add("@valorIcms", d.valorIcms);
        Add("@baseCalcIcmsSub", d.baseCalcIcmsSub); Add("@valorIcmsSub", d.valorIcmsSub);
        Add("@valorFreteNFe", d.valorFreteNFe); Add("@valorSeguroNFe", d.valorSeguroNFe);
        Add("@descontoNFe", d.descontoNFe); Add("@outrasDespNfe", d.outrasDespNfe);
        Add("@valorIpi", d.valorIpi); Add("@codTransp", d.codTransp);
        Add("@fretePorContaNFe", d.fretePorContaNFe); Add("@codVeic", d.codVeic);
        Add("@qtdadeVol", d.qtdadeVol); Add("@especieVol", d.especieVol); Add("@marcaVol", d.marcaVol);
        Add("@numVol", d.numVol); Add("@pesoBrutoVol", d.pesoBrutoVol); Add("@pesoLiqVol", d.pesoLiqVol);
        Add("@infComp", d.infComp); Add("@codFormaPagamento", d.codFormaPagamento);
        Add("@codCondPagamento", d.codCondPagamento);
    }

    private static string? StringN(MySqlDataReader r, string n) => r.IsDBNull(r.GetOrdinal(n)) ? null : r.GetString(n);
    private static int? Int32N(MySqlDataReader r, string n) => r.IsDBNull(r.GetOrdinal(n)) ? null : r.GetInt32(n);
    private static decimal? DecimalN(MySqlDataReader r, string n) => r.IsDBNull(r.GetOrdinal(n)) ? null : r.GetDecimal(n);
    private static DateOnly? DateN(MySqlDataReader r, string n) => r.IsDBNull(r.GetOrdinal(n)) ? null : DateOnly.FromDateTime(r.GetDateTime(n));
    private static TimeOnly? TimeN(MySqlDataReader r, string n) => r.IsDBNull(r.GetOrdinal(n)) ? null : TimeOnly.FromTimeSpan(r.GetTimeSpan(n));
}
