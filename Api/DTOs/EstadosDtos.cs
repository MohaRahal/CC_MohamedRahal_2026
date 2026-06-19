namespace Api.DTOs;

public class EstadosReadDto
{
    public int codEstado { get; set; }
    public string UF { get; set; } = string.Empty;
    public string estado { get; set; } = string.Empty;
    public int? codPais { get; set; }
    public PaisesReadDto? Pais { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}

public class EstadosCreateDto
{
    public string UF { get; set; } = string.Empty;
    public string estado { get; set; } = string.Empty;
    public int? codPais { get; set; }
}

public class EstadosUpdateDto
{
    public string? UF { get; set; }
    public string? estado { get; set; }
    public int? codPais { get; set; }
}

