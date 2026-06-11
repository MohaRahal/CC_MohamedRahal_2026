namespace Api.DTOs;

public class NfeReadDto
{
    public int NumNfe { get; set; }
    public int Serie { get; set; }
    public int Modelo { get; set; }
    public int CodFornecedor { get; set; }
    public string NatOper { get; set; } = string.Empty;
    public string ProtAcesso { get; set; } = string.Empty;
    public DateTime? DataProtAcesso { get; set; }
    public TimeSpan? HoraProtAcesso { get; set; }
    public string ChaveAcessoNFe { get; set; } = string.Empty;
    public DateTime? DataEmitNfe { get; set; }
    public DateTime? DataEntNfe { get; set; }
    public TimeSpan? HoraEntNfe { get; set; }
    public decimal ValorIcms { get; set; }
    public decimal BaseCalcIcmsSub { get; set; }
    public decimal ValorIcmsSub { get; set; }
    public decimal ValorFreteNfe { get; set; }
    public decimal ValorSeguroNfe { get; set; }
    public decimal DescontoNfe { get; set; }
    public decimal OutrasDespesasNfe { get; set; }
    public decimal ValorIpi { get; set; }
    public int? CodTransportadora { get; set; }
    public int FretePorContaNfe { get; set; }
    public int? CodVeiculo { get; set; }
    public int QtdadeVol { get; set; }
    public string EspecieVol { get; set; } = string.Empty;
    public string MarcaVol { get; set; } = string.Empty;
    public decimal PesoBrutoVol { get; set; }
    public decimal PesoLiquidoVol { get; set; }
    public int CodFormaPagamento { get; set; }
    public int CodCondicaoPagamento { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public FornecedoresReadDto? Fornecedor { get; set; }
    public TransportadoresReadDto? Transportadora { get; set; }
    public VeiculosReadDto? Veiculo { get; set; }
    public CondicoesPagamentoReadDto? CondicaoPagamento { get; set; }

    public List<ProdNfeCompletoReadDto> Itens { get; set; } = new();
}

public class NfeCreateDto
{
    public int NumNfe { get; set; }
    public int Serie { get; set; }
    public int Modelo { get; set; }
    public int CodFornecedor { get; set; }
    public string NatOper { get; set; } = string.Empty;
    public string ProtAcesso { get; set; } = string.Empty;
    public DateTime? DataProtAcesso { get; set; }
    public TimeSpan? HoraProtAcesso { get; set; }
    public string ChaveAcessoNFe { get; set; } = string.Empty;
    public DateTime? DataEmitNfe { get; set; }
    public DateTime? DataEntNfe { get; set; }
    public TimeSpan? HoraEntNfe { get; set; }
    public decimal? ValorIcms { get; set; }
    public decimal? BaseCalcIcmsSub { get; set; }
    public decimal? ValorIcmsSub { get; set; }
    public decimal? ValorFreteNfe { get; set; }
    public decimal? ValorSeguroNfe { get; set; }
    public decimal? DescontoNfe { get; set; }
    public decimal? OutrasDespesasNfe { get; set; }
    public decimal? ValorIpi { get; set; }
    public int? CodTransportadora { get; set; }
    public int? FretePorContaNfe { get; set; }
    public int? CodVeiculo { get; set; }
    public int? QtdadeVol { get; set; }
    public string EspecieVol { get; set; } = string.Empty;
    public string MarcaVol { get; set; } = string.Empty;
    public decimal? PesoBrutoVol { get; set; }
    public decimal? PesoLiquidoVol { get; set; }
    public int CodFormaPagamento { get; set; }
    public int CodCondicaoPagamento { get; set; }

    public List<ProdNfeCreateDto> Itens { get; set; } = new();
}

public class NfeUpdateDto
{
    public string? NatOper { get; set; }
    public string? ProtAcesso { get; set; }
    public DateTime? DataProtAcesso { get; set; }
    public TimeSpan? HoraProtAcesso { get; set; }
    public string? ChaveAcessoNFe { get; set; }
    public decimal? ValorIcms { get; set; }
    public decimal? ValorFreteNfe { get; set; }
    public decimal? PesoBrutoVol { get; set; }
    // Podem ser adicionados outros campos para update parcial
}