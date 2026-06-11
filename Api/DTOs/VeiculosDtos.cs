namespace Api.DTOs;

public class VeiculosReadDto
{
    public int CodVeic { get; set; }
    public string PlacaVeic { get; set; } = string.Empty;
    public int? CodEstado { get; set; }
    public string CodAntt { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class VeiculosCreateDto
{
    public string PlacaVeic { get; set; } = string.Empty;
    public int? CodEstado { get; set; }
    public string CodAntt { get; set; } = string.Empty;
}

public class VeiculosUpdateDto
{
    public string? PlacaVeic { get; set; }
    public int? CodEstado { get; set; }
    public string? CodAntt { get; set; }
}
