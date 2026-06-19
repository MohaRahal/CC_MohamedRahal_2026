namespace Api.DTOs;

public class FormasPagamentoReadDto
{
    public int codFormaPagamento { get; set; }
    public string formaPagamento { get; set; } = string.Empty;
    public bool ativo { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}

public class FormasPagamentoCreateDto
{
    public string formaPagamento { get; set; } = string.Empty;
    public bool? ativo { get; set; }
}

public class FormasPagamentoUpdateDto
{
    public string? formaPagamento { get; set; }
    public bool? ativo { get; set; }
}

