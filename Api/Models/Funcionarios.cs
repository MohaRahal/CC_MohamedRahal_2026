namespace Api.Models;
public class Funcionarios{
    public int codFuncionario { get; set; }
    public string funcionario { get; set; } = string.Empty;
    public string cpf {get; set;} = string.Empty;
    public DateOnly data_nascimento { get; set;}
    public string sexo { get; set;} = string.Empty;
    public int codCargo { get; set;}
    
    public string ender { get; set;} = string.Empty;
    public string complemento { get; set;} = string.Empty;
    public string numero { get; set;} = string.Empty;
    public string bairro { get; set;} = string.Empty;
    public int codCidade { get; set;}
    public string cep { get; set;} = string.Empty;

    public string fone { get; set;} = string.Empty;
    
    public int codUsuario { get; set;}
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios Usuario { get; set;} = null!;
    public Cidades Cidade { get; set;} = null!;
    public Cargos Cargo { get; set;} = null!;
}