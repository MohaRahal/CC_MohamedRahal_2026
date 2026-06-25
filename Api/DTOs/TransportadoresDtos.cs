namespace Api.DTOs;

public class TransportadoresReadDto
{
    public int codTransp { get; set; }
    public string apelido_NomeFantasia { get; set; } = string.Empty;
    public string transportador { get; set; } = string.Empty;
    public string inscEstTransp { get; set; } = string.Empty;
    public string tipoPessoa { get; set; } = string.Empty;
    public string cpf_cnpjTransp { get; set; } = string.Empty;
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
    public bool ativo { get; set; }
    public int codUsuario { get; set; }
    public UsuarioReadDto? Usuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}

public class TransportadoresCreateDto
{
    public string apelido_NomeFantasia { get; set; } = string.Empty;
    public string transportador { get; set; } = string.Empty;
    public string inscEstTransp { get; set; } = string.Empty;
    public string tipoPessoa { get; set; } = string.Empty;
    public string cpf_cnpjTransp { get; set; } = string.Empty;
    public string ender { get; set; } = string.Empty;
    public string numero { get; set; } = string.Empty;
    public string complemento { get; set; } = string.Empty;
    public string bairro { get; set; } = string.Empty;
    public int codCidade { get; set; }
    public string cep { get; set; } = string.Empty;
    public string site { get; set; } = string.Empty;
    public string fone { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public bool ativo { get; set; }
}

public class TransportadoresUpdateDto
{
    public string? apelido_NomeFantasia { get; set; }
    public string? transportador { get; set; }
    public string? inscEstTransp { get; set; }
    public string? tipoPessoa { get; set; }
    public string? cpf_cnpjTransp { get; set; }
    public string? ender { get; set; }
    public string? numero { get; set; }
    public string? complemento { get; set; }
    public string? bairro { get; set; }
    public int? codCidade { get; set; }
    public string? cep { get; set; }
    public string? site { get; set; }
    public string? fone { get; set; }
    public string? email { get; set; }
    public bool? ativo { get; set; }
}

