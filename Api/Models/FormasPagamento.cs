namespace Api.Models;

public class FormasPagamento
{
    public int codFormaPagamento { get; set; }
    public string formaPagamento { get; set; } = string.Empty;
    public bool ativo { get; set; } = true;
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios Usuario { get; set; } = null!;
}

