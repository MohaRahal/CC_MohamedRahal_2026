namespace Api.Models;

public class CondicaoPagamentoParcelas
{
    public int codCondPagamento { get; set; }
    public int numeroParcela { get; set; }
    public int diasVencimento { get; set; }
    public int codFormaPagamento { get; set; }
    public decimal percentual { get; set; }
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios? Usuario { get; set; }
    public CondicoesPagamento? CondicaoPagamento { get; set; }
}

