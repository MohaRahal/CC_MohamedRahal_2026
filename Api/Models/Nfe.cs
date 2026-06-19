namespace Api.Models;

public class Nfe
{
    public int numNfe { get; set; }
    public int serie { get; set; }
    public int modelo { get; set; }
    public int codForn { get; set; }
    public int? pagina { get; set; }
    public string? natOper { get; set; }
    public string? protAcesso { get; set; }
    public DateOnly? dataProtAcesso { get; set; }
    public TimeOnly? horaProtAcesso { get; set; }
    public string? chaveAcessoNFe { get; set; }
    public DateOnly? dataEmitNfe { get; set; }
    public DateOnly? dataEntNfe { get; set; }
    public TimeOnly? horaEntNFe { get; set; }
    public decimal? baseCalcIcms { get; set; }
    public decimal? valorIcms { get; set; }
    public decimal? baseCalcIcmsSub { get; set; }
    public decimal? valorIcmsSub { get; set; }
    public decimal? valorFreteNFe { get; set; }
    public decimal? valorSeguroNFe { get; set; }
    public decimal? descontoNFe { get; set; }
    public decimal? outrasDespNfe { get; set; }
    public decimal? valorIpi { get; set; }
    public int? codTransp { get; set; }
    public int? fretePorContaNFe { get; set; }
    public int? codVeic { get; set; }
    public int? qtdadeVol { get; set; }
    public string? especieVol { get; set; }
    public string? marcaVol { get; set; }
    public decimal? pesoBrutoVol { get; set; }
    public decimal? pesoLiqVol { get; set; }
    public string? infComp { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
    public int? codFormaPagamento { get; set; }
    public int? codCondPagamento { get; set; }

    public Fornecedores? Fornecedor { get; set; }
    public Transportadores? Transportadora { get; set; }
    public Veiculos? Veiculo { get; set; }
    public FormasPagamento? FormaPagamento { get; set; }
    public CondicoesPagamento? CondicaoPagamento { get; set; }
}

