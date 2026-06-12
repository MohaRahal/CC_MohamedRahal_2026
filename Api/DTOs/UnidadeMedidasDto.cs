namespace Api.DTOs;

public class UnidadeMedidaReadDto
{
    public int Id { get; set; }
    public string Sigla { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class UnidadeMedidaCreateDto
{
    public string Sigla { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
}

public class UnidadeMedidaUpdateDto
{
    public string? Sigla { get; set; } = string.Empty;
    public string? Descricao { get; set; } = string.Empty;
}
