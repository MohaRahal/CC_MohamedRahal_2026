namespace Api.Models;

public class Veiculos
{
    public int CodVeic { get; set; }
    public string PlacaVeic { get; set; } = string.Empty;
    public int CodEstado { get; set; }
    public int CodAntt { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public Estados? Estado { get; set; }
}
