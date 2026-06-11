namespace Api.Models;

public  class Paises
{
    public int CodPais { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Sigla { get; set; } = string.Empty;
    public string Ddi { get; set; } = string.Empty;
    public string Moeda { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

}