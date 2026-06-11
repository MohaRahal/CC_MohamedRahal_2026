using Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Data;
using Microsoft.AspNetCore.Authorization;
namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NfeController : ControllerBase
{
    private readonly MySqlConnection _connection;

    public NfeController(MySqlConnection connection)
    {
        _connection = connection;
    }
     [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<NfeReadDto>>> Listar(CancellationToken cancellationToken)
    {
        var nfes = new List<NfeReadDto>();

        await _connection.OpenAsync(cancellationToken);

        await using var command = _connection.CreateCommand();
        command.CommandText = """
            SELECT 
                n.numNfe, n.serie, n.modelo, n.codForn, n.natOper, n.protAcesso, n.dataProtAcesso, n.horaProtAcesso,
                n.chaveAcessoNFe, n.dataEmitNfe, n.dataEntNfe, n.horaEntNFe, n.valorIcms, n.baseCalcIcmsSub, n.valorIcmsSub,
                n.valorFreteNFe, n.valorSeguroNFe, n.descontoNFe, n.outrasDespNfe, n.valorIpi, n.codTransp,
                n.fretePorContaNFe, n.codVeic, n.qtdadeVol, n.especieVol, n.marcaVol, n.pesoBrutoVol, n.pesoLiqVol,
                n.codFormaPagamento, n.codCondPagamento, n.created_at, n.updated_at,
                
                f.RazaoSocial AS fornRazaoSocial, f.cnpj AS fornCnpj, f.ender AS fornEndereco, f.fone AS fornFone,
                
                t.razaoSocTransp AS transpRazaoSocial, t.cpf_cnpjTransp AS transpCnpj,
                
                v.placaVeic AS veicPlaca, v.codANTT AS veicCodAntt,
                
                c.descricao AS condDescricao, c.qtdParcelas AS condQtdParcelas
            FROM nfe n
            LEFT JOIN fornecedores f ON n.codForn = f.codForn
            LEFT JOIN transportadores t ON n.codTransp = t.codTransp
            LEFT JOIN veiculo v ON n.codVeic = v.codVeic
            LEFT JOIN condicoes_pagamento c ON n.codCondPagamento = c.codCondPagamento
            """;
        
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            nfes.Add(MapearNfeCompleta(reader));
        }
        
        return Ok(nfes);
    }
     [Authorize]
    [HttpGet("{numNfe:int}/{serie:int}/{modelo:int}")]
    public async Task<ActionResult<NfeReadDto>> BuscarPorCodigo(int numNfe, int serie, int modelo, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);

       
        await using var commandNfe = _connection.CreateCommand();
        commandNfe.CommandText = """
            SELECT 
                n.numNfe, n.serie, n.modelo, n.codForn, n.natOper, n.protAcesso, n.dataProtAcesso, n.horaProtAcesso,
                n.chaveAcessoNFe, n.dataEmitNfe, n.dataEntNfe, n.horaEntNFe, n.valorIcms, n.baseCalcIcmsSub, n.valorIcmsSub,
                n.valorFreteNFe, n.valorSeguroNFe, n.descontoNFe, n.outrasDespNfe, n.valorIpi, n.codTransp,
                n.fretePorContaNFe, n.codVeic, n.qtdadeVol, n.especieVol, n.marcaVol, n.pesoBrutoVol, n.pesoLiqVol,
                n.codFormaPagamento, n.codCondPagamento, n.created_at, n.updated_at,
                
                f.RazaoSocial AS fornRazaoSocial, f.cnpj AS fornCnpj, f.ender AS fornEndereco, f.fone AS fornFone,
                
                t.razaoSocTransp AS transpRazaoSocial, t.cpf_cnpjTransp AS transpCnpj,
                
                v.placaVeic AS veicPlaca, v.codANTT AS veicCodAntt,
                
                c.descricao AS condDescricao, c.qtdParcelas AS condQtdParcelas
            FROM nfe n
            LEFT JOIN fornecedores f ON n.codForn = f.codForn
            LEFT JOIN transportadores t ON n.codTransp = t.codTransp
            LEFT JOIN veiculo v ON n.codVeic = v.codVeic
            LEFT JOIN condicoes_pagamento c ON n.codCondPagamento = c.codCondPagamento
            WHERE n.numNfe = @numNfe AND n.serie = @serie AND n.modelo = @modelo;
            """;
        
        commandNfe.Parameters.AddWithValue("@numNfe", numNfe);
        commandNfe.Parameters.AddWithValue("@serie", serie);
        commandNfe.Parameters.AddWithValue("@modelo", modelo);

        await using var readerNfe = await commandNfe.ExecuteReaderAsync(cancellationToken);
        if (!await readerNfe.ReadAsync(cancellationToken))
        {
            return NotFound("Nota fiscal não encontrada.");
        }

        var nfe = MapearNfeCompleta(readerNfe);
        await readerNfe.CloseAsync(); 

        await using var commandItens = _connection.CreateCommand();
        commandItens.CommandText = """
            SELECT 
                p.numNfe, p.serie, p.modelo, p.codProd, p.CSOSNProdNFe, p.CFOPProdNFe, 
                p.vlrUntProdNFe, p.vlrDescProdNFe, p.vlrIcmsProdNFe, p.vlrIPIProdNfe, 
                p.aliqIcmsProdNFe, p.aliqIpiProdNFe, p.baseCalcIcmsProd, p.created_at, p.updated_at,
                
                prod.descProd AS prodDescricao, prod.NCMSHPROD AS prodNcmsh, prod.pesoBruto AS prodPeso
            FROM prod_nfe p
            LEFT JOIN produtos prod ON p.codProd = prod.codProd
            WHERE p.numNfe = @numNfe AND p.serie = @serie AND p.modelo = @modelo
            ORDER BY p.codProd ASC;
            """;
        commandItens.Parameters.AddWithValue("@numNfe", numNfe);
        commandItens.Parameters.AddWithValue("@serie", serie);
        commandItens.Parameters.AddWithValue("@modelo", modelo);

        await using var readerItens = await commandItens.ExecuteReaderAsync(cancellationToken);
        while (await readerItens.ReadAsync(cancellationToken))
        {
            nfe.Itens.Add(MapearItemCompleto(readerItens));
        }

        return Ok(nfe);
    }
     [Authorize]
    [HttpPost]
    public async Task<ActionResult> Criar([FromBody] NfeCreateDto nfeDto, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var transaction = await _connection.BeginTransactionAsync(cancellationToken);

        try
        {
            await using var cmdNfe = _connection.CreateCommand();
            cmdNfe.Transaction = transaction;
            cmdNfe.CommandText = """
                INSERT INTO nfe (
                    numNfe, serie, modelo, codForn, natOper, protAcesso, dataProtAcesso, horaProtAcesso,
                    chaveAcessoNFe, dataEmitNfe, dataEntNfe, horaEntNFe, valorIcms, baseCalcIcmsSub, valorIcmsSub,
                    valorFreteNFe, valorSeguroNFe, descontoNFe, outrasDespNfe, valorIpi, codTransp,
                    fretePorContaNFe, codVeic, qtdadeVol, especieVol, marcaVol, pesoBrutoVol, pesoLiqVol,
                    codFormaPagamento, codCondPagamento
                ) VALUES (
                    @numNfe, @serie, @modelo, @codForn, @natOper, @protAcesso, @dataProtAcesso, @horaProtAcesso,
                    @chaveAcessoNFe, @dataEmitNfe, @dataEntNfe, @horaEntNFe, @valorIcms, @baseCalcIcmsSub, @valorIcmsSub,
                    @valorFreteNFe, @valorSeguroNFe, @descontoNFe, @outrasDespNfe, @valorIpi, @codTransp,
                    @fretePorContaNFe, @codVeic, @qtdadeVol, @especieVol, @marcaVol, @pesoBrutoVol, @pesoLiqVol,
                    @codFormaPagamento, @codCondPagamento
                );
                """;
            
            cmdNfe.Parameters.AddWithValue("@numNfe", nfeDto.NumNfe);
            cmdNfe.Parameters.AddWithValue("@serie", nfeDto.Serie);
            cmdNfe.Parameters.AddWithValue("@modelo", nfeDto.Modelo);
            cmdNfe.Parameters.AddWithValue("@codForn", nfeDto.CodFornecedor);
            cmdNfe.Parameters.AddWithValue("@natOper", nfeDto.NatOper);
            cmdNfe.Parameters.AddWithValue("@protAcesso", nfeDto.ProtAcesso);
            cmdNfe.Parameters.AddWithValue("@dataProtAcesso", nfeDto.DataProtAcesso.HasValue ? nfeDto.DataProtAcesso.Value : DBNull.Value);
            cmdNfe.Parameters.AddWithValue("@horaProtAcesso", nfeDto.HoraProtAcesso.HasValue ? nfeDto.HoraProtAcesso.Value : DBNull.Value);
            cmdNfe.Parameters.AddWithValue("@chaveAcessoNFe", nfeDto.ChaveAcessoNFe);
            cmdNfe.Parameters.AddWithValue("@dataEmitNfe", nfeDto.DataEmitNfe.HasValue ? nfeDto.DataEmitNfe.Value : DBNull.Value);
            cmdNfe.Parameters.AddWithValue("@dataEntNfe", nfeDto.DataEntNfe.HasValue ? nfeDto.DataEntNfe.Value : DBNull.Value);
            cmdNfe.Parameters.AddWithValue("@horaEntNFe", nfeDto.HoraEntNfe.HasValue ? nfeDto.HoraEntNfe.Value : DBNull.Value);
            cmdNfe.Parameters.AddWithValue("@valorIcms", nfeDto.ValorIcms ?? 0m);
            cmdNfe.Parameters.AddWithValue("@baseCalcIcmsSub", nfeDto.BaseCalcIcmsSub ?? 0m);
            cmdNfe.Parameters.AddWithValue("@valorIcmsSub", nfeDto.ValorIcmsSub ?? 0m);
            cmdNfe.Parameters.AddWithValue("@valorFreteNFe", nfeDto.ValorFreteNfe ?? 0m);
            cmdNfe.Parameters.AddWithValue("@valorSeguroNFe", nfeDto.ValorSeguroNfe ?? 0m);
            cmdNfe.Parameters.AddWithValue("@descontoNFe", nfeDto.DescontoNfe ?? 0m);
            cmdNfe.Parameters.AddWithValue("@outrasDespNfe", nfeDto.OutrasDespesasNfe ?? 0m);
            cmdNfe.Parameters.AddWithValue("@valorIpi", nfeDto.ValorIpi ?? 0m);
            cmdNfe.Parameters.AddWithValue("@codTransp", nfeDto.CodTransportadora.HasValue ? nfeDto.CodTransportadora.Value : DBNull.Value);
            cmdNfe.Parameters.AddWithValue("@fretePorContaNFe", nfeDto.FretePorContaNfe ?? 0);
            cmdNfe.Parameters.AddWithValue("@codVeic", nfeDto.CodVeiculo.HasValue ? nfeDto.CodVeiculo.Value : DBNull.Value);
            cmdNfe.Parameters.AddWithValue("@qtdadeVol", nfeDto.QtdadeVol ?? 0);
            cmdNfe.Parameters.AddWithValue("@especieVol", nfeDto.EspecieVol);
            cmdNfe.Parameters.AddWithValue("@marcaVol", nfeDto.MarcaVol);
            cmdNfe.Parameters.AddWithValue("@pesoBrutoVol", nfeDto.PesoBrutoVol ?? 0m);
            cmdNfe.Parameters.AddWithValue("@pesoLiqVol", nfeDto.PesoLiquidoVol ?? 0m);
            cmdNfe.Parameters.AddWithValue("@codFormaPagamento", nfeDto.CodFormaPagamento);
            cmdNfe.Parameters.AddWithValue("@codCondPagamento", nfeDto.CodCondicaoPagamento);

            await cmdNfe.ExecuteNonQueryAsync(cancellationToken);

           
            if (nfeDto.Itens != null && nfeDto.Itens.Any())
            {
                foreach (var item in nfeDto.Itens)
                {
                    await using var cmdItem = _connection.CreateCommand();
                    cmdItem.Transaction = transaction;
                    cmdItem.CommandText = """
                        INSERT INTO prod_nfe (
                            numNfe, serie, modelo, codProd, CSOSNProdNFe, CFOPProdNFe, 
                            vlrUntProdNFe, vlrDescProdNFe, vlrIcmsProdNFe, vlrIPIProdNfe, 
                            aliqIcmsProdNFe, aliqIpiProdNFe, baseCalcIcmsProd
                        ) VALUES (
                            @numNfe, @serie, @modelo, @codProd, @CSOSNProdNFe, @CFOPProdNFe,
                            @vlrUntProdNFe, @vlrDescProdNFe, @vlrIcmsProdNFe, @vlrIPIProdNfe,
                            @aliqIcmsProdNFe, @aliqIpiProdNFe, @baseCalcIcmsProd
                        );
                        """;
                    
                    cmdItem.Parameters.AddWithValue("@numNfe", nfeDto.NumNfe);
                    cmdItem.Parameters.AddWithValue("@serie", nfeDto.Serie);
                    cmdItem.Parameters.AddWithValue("@modelo", nfeDto.Modelo);
                    cmdItem.Parameters.AddWithValue("@codProd", item.CodProduto);
                    cmdItem.Parameters.AddWithValue("@CSOSNProdNFe", item.CsosnProdNfe);
                    cmdItem.Parameters.AddWithValue("@CFOPProdNFe", item.CfopProdNfe);
                    cmdItem.Parameters.AddWithValue("@vlrUntProdNFe", item.VlrUntProdNfe ?? 0m);
                    cmdItem.Parameters.AddWithValue("@vlrDescProdNFe", item.VlrDescProdNfe ?? 0m);
                    cmdItem.Parameters.AddWithValue("@vlrIcmsProdNFe", item.VlrIcmsProdNfe ?? 0m);
                    cmdItem.Parameters.AddWithValue("@vlrIPIProdNfe", item.VlrIpiProdNfe ?? 0m);
                    cmdItem.Parameters.AddWithValue("@aliqIcmsProdNFe", item.AliqIcmsProdNfe ?? 0m);
                    cmdItem.Parameters.AddWithValue("@aliqIpiProdNFe", item.AliqIpiProdNfe ?? 0m);
                    cmdItem.Parameters.AddWithValue("@baseCalcIcmsProd", item.BaseCalcIcmsProd ?? 0m);

                    await cmdItem.ExecuteNonQueryAsync(cancellationToken);
                }
            }

            await transaction.CommitAsync(cancellationToken);
            return CreatedAtAction(nameof(BuscarPorCodigo), new { numNfe = nfeDto.NumNfe, serie = nfeDto.Serie, modelo = nfeDto.Modelo }, null);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            return StatusCode(500, $"Erro ao processar a NFe: {ex.Message}");
        }
    }
     [Authorize]
    [HttpDelete("{numNfe:int}/{serie:int}/{modelo:int}")]
    public async Task<ActionResult> Deletar(int numNfe, int serie, int modelo, CancellationToken cancellationToken)
    {
        await _connection.OpenAsync(cancellationToken);
        await using var transaction = await _connection.BeginTransactionAsync(cancellationToken);

        try
        {
            
            await using var cmdItem = _connection.CreateCommand();
            cmdItem.Transaction = transaction;
            cmdItem.CommandText = "DELETE FROM prod_nfe WHERE numNfe = @numNfe AND serie = @serie AND modelo = @modelo;";
            cmdItem.Parameters.AddWithValue("@numNfe", numNfe);
            cmdItem.Parameters.AddWithValue("@serie", serie);
            cmdItem.Parameters.AddWithValue("@modelo", modelo);
            await cmdItem.ExecuteNonQueryAsync(cancellationToken);

            
            await using var cmdNfe = _connection.CreateCommand();
            cmdNfe.Transaction = transaction;
            cmdNfe.CommandText = "DELETE FROM nfe WHERE numNfe = @numNfe AND serie = @serie AND modelo = @modelo;";
            cmdNfe.Parameters.AddWithValue("@numNfe", numNfe);
            cmdNfe.Parameters.AddWithValue("@serie", serie);
            cmdNfe.Parameters.AddWithValue("@modelo", modelo);
            var rowsAffected = await cmdNfe.ExecuteNonQueryAsync(cancellationToken);

            if (rowsAffected == 0)
            {
                await transaction.RollbackAsync(cancellationToken);
                return NotFound("Nota fiscal não encontrada.");
            }

            await transaction.CommitAsync(cancellationToken);
            return NoContent();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            return StatusCode(500, $"Erro ao deletar NFe: {ex.Message}");
        }
    }

    
    private static NfeReadDto MapearNfeCompleta(MySqlDataReader reader)
    {
        var nfe = new NfeReadDto
        {
            NumNfe = reader.GetInt32("numNfe"),
            Serie = reader.GetInt32("serie"),
            Modelo = reader.GetInt32("modelo"),
            CodFornecedor = reader.GetInt32("codForn"),
            NatOper = reader.IsDBNull("natOper") ? string.Empty : reader.GetString("natOper"),
            ChaveAcessoNFe = reader.IsDBNull("chaveAcessoNFe") ? string.Empty : reader.GetString("chaveAcessoNFe"),
            ValorIcms = reader.IsDBNull("valorIcms") ? 0 : reader.GetDecimal("valorIcms"),
            ValorFreteNfe = reader.IsDBNull("valorFreteNFe") ? 0 : reader.GetDecimal("valorFreteNFe"),
            CodFormaPagamento = reader.IsDBNull("codFormaPagamento") ? 0 : reader.GetInt32("codFormaPagamento"),
            CodCondicaoPagamento = reader.IsDBNull("codCondPagamento") ? 0 : reader.GetInt32("codCondPagamento")
        };

       
        if (!reader.IsDBNull("fornRazaoSocial"))
        {
            nfe.Fornecedor = new FornecedoresReadDto
            {
                CodForn = nfe.CodFornecedor,
                RazaoSocial = reader.GetString("fornRazaoSocial"),
                Cnpj = reader.IsDBNull("fornCnpj") ? string.Empty : reader.GetString("fornCnpj"),
                Endereco = reader.IsDBNull("fornEndereco") ? string.Empty : reader.GetString("fornEndereco"),
                Fone = reader.IsDBNull("fornFone") ? string.Empty : reader.GetString("fornFone")
            };
        }

        
        if (!reader.IsDBNull("codTransp"))
        {
            nfe.CodTransportadora = reader.GetInt32("codTransp");
            if (!reader.IsDBNull("transpRazaoSocial"))
            {
                nfe.Transportadora = new TransportadoresReadDto
                {
                    CodTransp = nfe.CodTransportadora.Value,
                    RazaoSocTransp = reader.GetString("transpRazaoSocial"),
                    CpfCnpjTransp = reader.IsDBNull("transpCnpj") ? string.Empty : reader.GetString("transpCnpj")
                };
            }
        }

        return nfe;
    }

    private static ProdNfeCompletoReadDto MapearItemCompleto(MySqlDataReader reader)
    {
        var item = new ProdNfeCompletoReadDto
        {
            NumNfe = reader.GetInt32("numNfe"),
            Serie = reader.GetInt32("serie"),
            Modelo = reader.GetInt32("modelo"),
            CodProduto = reader.GetInt32("codProd"),
            CsosnProdNfe = reader.IsDBNull("CSOSNProdNFe") ? string.Empty : reader.GetString("CSOSNProdNFe"),
            CfopProdNfe = reader.IsDBNull("CFOPProdNFe") ? string.Empty : reader.GetString("CFOPProdNFe"),
            VlrUntProdNfe = reader.IsDBNull("vlrUntProdNFe") ? 0 : reader.GetDecimal("vlrUntProdNFe"),
            VlrIcmsProdNfe = reader.IsDBNull("vlrIcmsProdNFe") ? 0 : reader.GetDecimal("vlrIcmsProdNFe")
        };

        if (!reader.IsDBNull("prodDescricao"))
        {
            item.Produto = new ProdutosReadDto
            {
                CodProduto = item.CodProduto,
                DescProd = reader.GetString("prodDescricao"),
                NcmshProd = reader.IsDBNull("prodNcmsh") ? string.Empty : reader.GetString("prodNcmsh"),
                PesoProd = reader.IsDBNull("prodPeso") ? 0 : reader.GetDecimal("prodPeso")
            };
        }

        return item;
    }
}
