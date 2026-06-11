namespace Api.Models;


public class Transportadores
{
    public int CodTransp { get; set; }
    public string CpfCnpjTransp { get; set; } = string.Empty;
    public string EndTransp { get; set; } = string.Empty;
    public int CodCidade { get; set; }
    public string RazaoSocTransp { get; set; } = string.Empty;
    public string InscEstTransp { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public Cidades? Cidade { get; set; }
}
