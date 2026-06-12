namespace Api.Models;

public class Ncmsh
{
    public string Codigo { get; set; } = string.Empty;
    public decimal AliqIcmsProdNfe { get; set; }
    public decimal AliqIpiProdNfe { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

