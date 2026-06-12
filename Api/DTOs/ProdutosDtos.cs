namespace Api.DTOs;

public class ProdutosReadDto
{
    public int CodProduto { get; set; }
    public string DescProd { get; set; } = string.Empty;
    public string NcmshProd { get; set; } = string.Empty;
    public int? UndProd { get; set; }
    public decimal PesoProd { get; set; }
    public decimal PesoLiq { get; set; }
    public decimal SaldoProd { get; set; }
    public decimal CustoMedioProd { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class ProdutosCreateDto
{
    public string DescProd { get; set; } = string.Empty;
    public string NcmshProd { get; set; } = string.Empty;
    public int? UndProd { get; set; }
    public decimal? PesoProd { get; set; }
    public decimal? PesoLiq { get; set; }
    public decimal? SaldoProd { get; set; }
    public decimal? CustoMedioProd { get; set; }
}

public class ProdutosUpdateDto
{
    public string? DescProd { get; set; }
    public string? NcmshProd { get; set; }
    public int? UndProd { get; set; }
    public decimal? PesoProd { get; set; }
    public decimal? PesoLiq { get; set; }
    public decimal? SaldoProd { get; set; }
    public decimal? CustoMedioProd { get; set; }
}

