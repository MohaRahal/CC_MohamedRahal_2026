namespace Api.DTOs;

public class ProdNfeCompletoReadDto
{
    public int NumNfe { get; set; }
    public int Serie { get; set; }
    public int Modelo { get; set; }
    public int Item { get; set; }
    public int CodProduto { get; set; }
    public string CsosnProdNfe { get; set; } = string.Empty;
    public string CfopProdNfe { get; set; } = string.Empty;
    public decimal VlrUntProdNfe { get; set; }
    public decimal VlrDescProdNfe { get; set; }
    public decimal VlrIcmsProdNfe { get; set; }
    public decimal VlrIpiProdNfe { get; set; }
    public decimal AliqIcmsProdNfe { get; set; }
    public decimal AliqIpiProdNfe { get; set; }
    public decimal BaseCalcIcmsProd { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public ProdutosReadDto? Produto { get; set; }
}

public class ProdNfeCreateDto
{
    public int Item { get; set; }
    public int CodProduto { get; set; }
    public string CsosnProdNfe { get; set; } = string.Empty;
    public string CfopProdNfe { get; set; } = string.Empty;
    public decimal? VlrUntProdNfe { get; set; }
    public decimal? VlrDescProdNfe { get; set; }
    public decimal? VlrIcmsProdNfe { get; set; }
    public decimal? VlrIpiProdNfe { get; set; }
    public decimal? AliqIcmsProdNfe { get; set; }
    public decimal? AliqIpiProdNfe { get; set; }
    public decimal? BaseCalcIcmsProd { get; set; }
}

public class ProdNfeUpdateDto
{
    public string? CsosnProdNfe { get; set; }
    public string? CfopProdNfe { get; set; }
    public decimal? VlrUntProdNfe { get; set; }
    public decimal? VlrDescProdNfe { get; set; }
    public decimal? VlrIcmsProdNfe { get; set; }
    public decimal? VlrIpiProdNfe { get; set; }
    public decimal? AliqIcmsProdNfe { get; set; }
    public decimal? AliqIpiProdNfe { get; set; }
    public decimal? BaseCalcIcmsProd { get; set; }
}

