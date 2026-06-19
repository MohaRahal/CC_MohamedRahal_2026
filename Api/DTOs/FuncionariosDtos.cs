namespace Api.DTOs;

public class FuncionarioCreateDto
{
    public string funcionario { get; set; } = string.Empty;
    public string cpf { get; set; } = string.Empty;
    public DateOnly data_nascimento { get; set; }
    public string sexo { get; set; } = string.Empty;
    public int codCargo { get; set; }
    public string? ender { get; set; }
    public string? numero { get; set; }
    public string? complemento { get; set; }
    public string? bairro { get; set; }
    public int? codCidade { get; set; }
    public string? cep { get; set; }
    public string? fone { get; set; }
}
public class FuncionarioReadDto
{
    public int codFuncionario { get; set; }
    public string funcionario { get; set; } = string.Empty;
    public string cpf { get; set; } = string.Empty;
    public DateOnly data_nascimento { get; set; }
    public string sexo { get; set; } = string.Empty;
    public int codCargo { get; set; }
    public string? ender { get; set; }
    public string? numero { get; set; }
    public string? complemento { get; set; }
    public string? bairro { get; set; }
    public int? codCidade { get; set; }
    public string? cep { get; set; }
    public string? fone { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}
public class FuncionarioUpdateDto
{
    public string? funcionario { get; set; } 
    public string? cpf { get; set; }
    public DateOnly? data_nascimento { get; set; }
    public string? sexo { get; set; }
    public int? codCargo { get; set; }
    public string? ender { get; set; }
    public string? numero { get; set; }
    public string? complemento { get; set; }
    public string? bairro { get; set; }
    public int? codCidade { get; set; }
    public string? cep { get; set; }
    public string? fone { get; set; }
}