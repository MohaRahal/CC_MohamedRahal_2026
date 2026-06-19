namespace Api.DTOs;

public class ProdutosReadDto
{
    public int codProd { get; set; }
    public string produto { get; set; } = string.Empty;
    public int codMarca { get; set; }
    public int codGrupo { get; set; }
    public int codUnidade { get; set; }
    public string codigoBarras { get; set; } = string.Empty;
    public string undProd { get; set; } = string.Empty;
    public decimal? pesoBruto { get; set; }
    public decimal? pesoLiq { get; set; }
    public decimal? saldoProd { get; set; }
    public decimal precoVenda { get; set; }
    public decimal precoCompra { get; set; }
    public decimal? custoMedioProd { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}

public class ProdutosCreateDto
{
    public string produto { get; set; } = string.Empty;
    public int codMarca { get; set; }
    public int codGrupo { get; set; }
    public int codUnidade { get; set; }
    public string codigoBarras { get; set; } = string.Empty;
    public string undProd { get; set; } = string.Empty;
    public decimal? pesoBruto { get; set; }
    public decimal? pesoLiq { get; set; }
    public decimal? saldoProd { get; set; }
    public decimal precoVenda { get; set; }
    public decimal precoCompra { get; set; }
    public decimal? custoMedioProd { get; set; }
}

public class ProdutosUpdateDto
{
    public string? produto { get; set; }
    public int? codMarca { get; set; }
    public int? codGrupo { get; set; }
    public int? codUnidade { get; set; }
    public string? codigoBarras { get; set; }
    public string? undProd { get; set; }
    public decimal? pesoBruto { get; set; }
    public decimal? pesoLiq { get; set; }
    public decimal? saldoProd { get; set; }
    public decimal? precoVenda { get; set; }
    public decimal? precoCompra { get; set; }
    public decimal? custoMedioProd { get; set; }
}

