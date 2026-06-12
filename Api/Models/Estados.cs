namespace Api.Models;

public class Estados
{
    public int CodEstado { get; set; }
    public string Uf { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public int CodPais { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public Paises? Pais { get; set; }
}

