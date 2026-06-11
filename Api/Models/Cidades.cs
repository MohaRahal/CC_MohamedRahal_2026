namespace Api.Models;

public class Cidades
{
    public int CodCidade { get; set; }
    public string Cidade { get; set; } = string.Empty;
    public int CodEstado { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public Estados? Estado { get; set; }
}
