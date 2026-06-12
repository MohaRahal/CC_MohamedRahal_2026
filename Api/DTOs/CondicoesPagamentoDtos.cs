namespace Api.DTOs;

public class CondicoesPagamentoReadDto
{
    public int CodCondPagamento { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public int QtdParcelas { get; set; }
    public bool Ativo { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class CondicoesPagamentoCreateDto
{
    public string Descricao { get; set; } = string.Empty;
    public int QtdParcelas { get; set; }
    public bool? Ativo { get; set; }
}

public class CondicoesPagamentoUpdateDto
{
    public string? Descricao { get; set; }
    public int? QtdParcelas { get; set; }
    public bool? Ativo { get; set; }
}

