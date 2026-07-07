namespace Api.DTOs;

public class ClientesReadDto
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
    public CidadesReadDto? Cidade { get; set; }
    public string cep { get; set; } = string.Empty;
    public string site { get; set; } = string.Empty;
    public string fone { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public decimal limiteCredito { get; set; }
    public int codCondPagamento { get; set; }
    public CondicoesPagamentoReadDto? CondicaoPagamento { get; set; }
    public int codUsuario { get; set; }
    public UsuarioReadDto? Usuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}

public class ClientesCreateDto
{
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
}

public class ClientesUpdateDto
{
    public string? cliente { get; set; }
    public string? rg_inscEst { get; set; }
    public string? tipoPessoa { get; set; }
    public string? cpf_cnpj { get; set; }
    public string? ender { get; set; }
    public string? numero { get; set; }
    public string? complemento { get; set; }
    public string? bairro { get; set; }
    public int? codCidade { get; set; }
    public string? cep { get; set; }
    public string? site { get; set; }
    public string? fone { get; set; }
    public string? email { get; set; }
    public decimal? limiteCredito { get; set; }
    public int? codCondPagamento { get; set; }
}
