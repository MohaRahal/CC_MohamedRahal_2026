namespace Api.DTOs;

public class UnidadeMedidaReadDto
{
    public int codUnidade { get; set; }
    public string unidade { get; set; } = string.Empty;
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}

public class UnidadeMedidaCreateDto
{
    public string unidade { get; set; } = string.Empty;
}

public class UnidadeMedidaUpdateDto
{
    public string? unidade { get; set; }
}
