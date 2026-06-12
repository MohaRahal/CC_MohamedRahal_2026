namespace Api.DTOs;

public class FornecedoresReadDto
{
    public int CodForn { get; set; }
    public string RazaoSocial { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public int? CodCidade { get; set; }
    public string Cep { get; set; } = string.Empty;
    public string Fone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string InscEst { get; set; } = string.Empty;
    public string InscEstSubTrib { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class FornecedoresCreateDto
{
    public string RazaoSocial { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public int? CodCidade { get; set; }
    public string Cep { get; set; } = string.Empty;
    public string Fone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string InscEst { get; set; } = string.Empty;
    public string InscEstSubTrib { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
}

public class FornecedoresUpdateDto
{
    public string? RazaoSocial { get; set; }
    public string? Endereco { get; set; }
    public string? Bairro { get; set; }
    public int? CodCidade { get; set; }
    public string? Cep { get; set; }
    public string? Fone { get; set; }
    public string? Email { get; set; }
    public string? InscEst { get; set; }
    public string? InscEstSubTrib { get; set; }
    public string? Cnpj { get; set; }
}

