namespace Api.Models;

public class Produtos
{
    public int CodProduto { get; set; }
    public string DescProd { get; set; } = string.Empty;
    public string NcmshProd { get; set; } = string.Empty;
    public int UndProd { get; set; }
    public decimal PesoProd { get; set; }
    public decimal PesoLiq { get; set; }
    public decimal SaldoProd { get; set; }
    public decimal CustoMedioProd { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public Ncmsh? Ncmsh { get; set; }
}

