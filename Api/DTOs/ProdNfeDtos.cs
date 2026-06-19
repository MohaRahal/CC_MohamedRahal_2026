namespace Api.DTOs;

public class ProdNfeCompletoReadDto
{
    public int numNfe { get; set; }
    public int serie { get; set; }
    public int modelo { get; set; }
    public int codProd { get; set; }
    public string? CSOSNProdNFe { get; set; }
    public string? CFOPProdNFe { get; set; }
    public decimal? qtdProdNFe { get; set; }
    public decimal? vlrUntProdNFe { get; set; }
    public decimal? vlrDescProdNFe { get; set; }
    public decimal? vlrIcmsProdNFe { get; set; }
    public decimal? vlrIPIProdNfe { get; set; }
    public decimal? aliqIcmsProdNFe { get; set; }
    public decimal? aliqIpiProdNFe { get; set; }
    public decimal? baseCalcIcmsProd { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public ProdutosReadDto? Produto { get; set; }
}

public class ProdNfeCreateDto
{
    public int codProd { get; set; }
    public string? CSOSNProdNFe { get; set; }
    public string? CFOPProdNFe { get; set; }
    public decimal? qtdProdNFe { get; set; }
    public decimal? vlrUntProdNFe { get; set; }
    public decimal? vlrDescProdNFe { get; set; }
    public decimal? vlrIcmsProdNFe { get; set; }
    public decimal? vlrIPIProdNfe { get; set; }
    public decimal? aliqIcmsProdNFe { get; set; }
    public decimal? aliqIpiProdNFe { get; set; }
    public decimal? baseCalcIcmsProd { get; set; }
}

public class ProdNfeUpdateDto
{
    public string? CSOSNProdNFe { get; set; }
    public string? CFOPProdNFe { get; set; }
    public decimal? qtdProdNFe { get; set; }
    public decimal? vlrUntProdNFe { get; set; }
    public decimal? vlrDescProdNFe { get; set; }
    public decimal? vlrIcmsProdNFe { get; set; }
    public decimal? vlrIPIProdNfe { get; set; }
    public decimal? aliqIcmsProdNFe { get; set; }
    public decimal? aliqIpiProdNFe { get; set; }
    public decimal? baseCalcIcmsProd { get; set; }
}

