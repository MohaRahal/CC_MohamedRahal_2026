namespace Api.Models;

public class Usuarios
{
    public int codUsuario { get; set; }
    public string usuario { get; set; } = string.Empty;
    public string senha { get; set; } = string.Empty;
    public int codFuncionario { get; set; }
    public int codCargo { get; set; }
    public bool ativo { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Cargos? Cargo { get; set; }
    public Funcionarios? Funcionario { get; set; }
}

