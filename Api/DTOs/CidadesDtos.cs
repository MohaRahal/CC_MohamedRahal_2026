namespace Api.DTOs;

public class CidadesReadDto
{
    public int codCidade { get; set; }
    public string cidade { get; set; } = string.Empty;
    public int? codEstado { get; set; }
    public int codUsuario { get; set; }
    public EstadosReadDto? Estado { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}

public class CidadesCreateDto
{
    public string cidade { get; set; } = string.Empty;
    public int? codEstado { get; set; }
}

public class CidadesUpdateDto
{
    public string? cidade { get; set; }
    public int? codEstado { get; set; }
}

