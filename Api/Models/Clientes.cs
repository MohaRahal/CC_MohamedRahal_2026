namespace Api.Models;
public class Clientes
{
    public int codCliente { get; set; }
    public string cliente { get; set; } = string.Empty;
    public string rg_inscEst { get; set; } = string.Empty;
    public string tipoPessoa { get; set; } = string.Empty;
    public string cpf_cnpj { get; set; } = string.Empty;
    public string ender { get; set; } = string.Empty;
    public string numero { get; set; } = string.Empty;
    public string complemento { get; set; } = string.Empty;
    public string bairro { get; set; } = string.Empty;
    public int codCidade { get; set; }
    public string cep { get; set; } = string.Empty;
    public string site { get; set; } = string.Empty;
    public string fone { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public decimal limiteCredito { get; set; }
    public int codCondPagamento { get; set; }
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios? Usuario { get; set; }
    public Cidades? Cidade { get; set; }
    public CondicoesPagamento? CondicaoPagamento { get; set; }
}