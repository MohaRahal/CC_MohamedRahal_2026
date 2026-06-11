namespace Api.Models;

public class CondicaoPagamentoParcelas
{
    public int CodParcela { get; set; }
    public int CodCondPagamento { get; set; }
    public int NumParcela { get; set; }
    public int DiasVencimento { get; set; }
    public decimal Percentual { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public CondicoesPagamento? CondicaoPagamento { get; set; }
}
