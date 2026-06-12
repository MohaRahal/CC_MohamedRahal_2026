namespace Api.DTOs;

public class CidadesReadDto
{
    public int CodCidade { get; set; }
    public string Cidade { get; set; } = string.Empty;
    public int? CodEstado { get; set; }
    public EstadosReadDto? Estado { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class CidadesCreateDto
{
    public string Cidade { get; set; } = string.Empty;
    public int? CodEstado { get; set; }
}

public class CidadesUpdateDto
{
    public string? Cidade { get; set; }
    public int? CodEstado { get; set; }
}
