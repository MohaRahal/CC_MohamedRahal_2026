namespace Api.DTOs;

public class EstadosReadDto
{
    public int CodEstado { get; set; }
    public string Uf { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public int? CodPais { get; set; }
    public PaisesReadDto? Pais { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class EstadosCreateDto
{
    public string Uf { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public int? CodPais { get; set; }
}

public class EstadosUpdateDto
{
    public string? Uf { get; set; }
    public string? Estado { get; set; }
    public int? CodPais { get; set; }
}
