namespace Api.Models;

public class CondicoesPagamento
{
    public int codCondPagamento { get; set; }
    public string condPagamento { get; set; } = string.Empty;
    public int qtdParcelas { get; set; }
    public bool ativo { get; set; } = true;
    public decimal juros { get; set; }
    public decimal multa { get; set; }
    public decimal desconto { get; set; }
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios Usuario { get; set; } = null!;

}

