using Api.Models;

namespace Api.DTOs;

public class CondicoesPagamentoReadDto
{
    public int codCondPagamento { get; set; }
    public string condPagamento { get; set; } = string.Empty;
    public int qtdParcelas { get; set; }
    public bool ativo { get; set; }
    public decimal juros { get; set; }
    public decimal multa { get; set; }
    public decimal desconto { get; set; }
    public int codUsuario { get; set; }
    public UsuarioReadDto? Usuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}

public class CondicoesPagamentoCreateDto
{
    public string condPagamento { get; set; } = string.Empty;
    public int qtdParcelas { get; set; }
    public bool? ativo { get; set; }
    public decimal juros { get; set; }
    public decimal multa { get; set; }
    public decimal desconto { get; set; }
}

public class CondicoesPagamentoUpdateDto
{
    public string? condPagamento { get; set; }
    public int? qtdParcelas { get; set; }
    public bool? ativo { get; set; }
    public decimal? juros { get; set; }
    public decimal? multa { get; set; }
    public decimal? desconto { get; set; }
}

