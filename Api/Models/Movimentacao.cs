namespace Api.Models;

public class Movimentacao
{
    public int Id { get; set; }
    public int CodProduto { get; set; }
    public int IdUser { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public decimal Quantidade { get; set; }
    public decimal SaldoAnterior { get; set; }
    public decimal SaldoAtual { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public int? NumNfe { get; set; }
    public int? Serie { get; set; }
    public int? Modelo { get; set; }
    public DateTime CreatedAt { get; set; }

    public Produtos? Produto { get; set; }
    public Users? User { get; set; }
}
