namespace Api.Models;

public class Fornecedores
{
    public int codForn { get; set; }
    public string fornecedor { get; set; } = string.Empty;
    public string apelido_NomeFantasia { get; set; } = string.Empty;
    public string ender { get; set; } = string.Empty;
    public string numero { get; set; } = string.Empty;
    public string complemento { get; set; } = string.Empty;
    public string bairro { get; set; } = string.Empty;
    public int codCidade { get; set; }
    public string cep { get; set; } = string.Empty;
    public string site { get; set; } = string.Empty;
    public string fone { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public int codCondPagamento { get; set; }
    public decimal limiteCredito { get; set; }
    public string rg_inscEst { get; set; } = string.Empty;
    public string tipoPessoa { get; set; } = string.Empty;
    public string cpf_cnpj { get; set; } = string.Empty;

    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Cidades? Cidade { get; set; }
    public Usuarios? Usuario { get; set; }
}

