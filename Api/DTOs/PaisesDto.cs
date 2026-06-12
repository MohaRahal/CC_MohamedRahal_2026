namespace Api.DTOs;

public class PaisesCreateDto
{
    public string Nome { get; set; } = string.Empty;
    public string Sigla { get; set; } = string.Empty;
    public string Ddi { get; set; } = string.Empty;
    public string Moeda { get; set; } = string.Empty;
}
public class PaisesReadDto
{
    public int CodPais { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Sigla { get; set; } = string.Empty;
    public string Ddi { get; set; } = string.Empty;
    public string Moeda { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}
public class PaisesUpdateDto
{
    public string? Nome { get; set; }
    public string? Sigla { get; set; }
    public string? Ddi { get; set; }
    public string? Moeda { get; set; }
}
