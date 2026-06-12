namespace Api.DTOs;

public class CondicaoPagamentoParcelasReadDto
{
    public int CodParcela { get; set; }
    public int CodCondPagamento { get; set; }
    public int NumParcela { get; set; }
    public int DiasVencimento { get; set; }
    public decimal Percentual { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class CondicaoPagamentoParcelasCreateDto
{
    public int CodCondPagamento { get; set; }
    public int NumParcela { get; set; }
    public int DiasVencimento { get; set; }
    public decimal? Percentual { get; set; }
}

public class CondicaoPagamentoParcelasUpdateDto
{
    public int? CodCondPagamento { get; set; }
    public int? NumParcela { get; set; }
    public int? DiasVencimento { get; set; }
    public decimal? Percentual { get; set; }
}

