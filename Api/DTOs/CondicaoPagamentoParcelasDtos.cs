namespace Api.DTOs;

public class CondicaoPagamentoParcelasReadDto
{
    public int codCondPagamento { get; set; }
    public int numeroParcela { get; set; }
    public int diasVencimento { get; set; }
    public int codFormaPagamento { get; set; }
    public decimal percentual { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}

public class CondicaoPagamentoParcelasCreateDto
{
    public int codCondPagamento { get; set; }
    public int numeroParcela { get; set; }
    public int diasVencimento { get; set; }
    public int codFormaPagamento { get; set; }
    public decimal? percentual { get; set; }
}

public class CondicaoPagamentoParcelasUpdateDto
{
    public int? codCondPagamento { get; set; }
    public int? numeroParcela { get; set; }
    public int? diasVencimento { get; set; }
    public int? codFormaPagamento { get; set; }
    public decimal? percentual { get; set; }
}

