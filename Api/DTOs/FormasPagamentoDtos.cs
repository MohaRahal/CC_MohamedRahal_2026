namespace Api.DTOs;

public class FormasPagamentoReadDto
{
    public int CodFormaPagamento { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class FormasPagamentoCreateDto
{
    public string Descricao { get; set; } = string.Empty;
    public bool? Ativo { get; set; }
}

public class FormasPagamentoUpdateDto
{
    public string? Descricao { get; set; }
    public bool? Ativo { get; set; }
}
