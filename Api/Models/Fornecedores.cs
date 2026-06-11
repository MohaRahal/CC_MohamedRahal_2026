namespace Api.Models;

public class Fornecedores
{
    public int CodFor { get; set; }
    public string RazaoSocial { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public int CodCidade { get; set; }
    public string Cep { get; set; } = string.Empty;
    public string Fone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string InscEst { get; set; } = string.Empty;
    public string InscEstSubTrib { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public Cidades? Cidade { get; set; }
}
