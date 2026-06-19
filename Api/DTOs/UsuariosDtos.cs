namespace Api.DTOs;

public class UsuarioReadDto
{
    public int codUsuario { get; set; }
    public string usuario { get; set; } = string.Empty;
    public int codFuncionario { get; set; }
    public int codCargo { get; set; }
    public bool ativo { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}

public class UsuarioCreateDto
{
    public string usuario { get; set; } = string.Empty;
    public string senha { get; set; } = string.Empty;
    public int codFuncionario { get; set; }
    public int codCargo { get; set; }
    public bool ativo { get; set; } = true;
}

public class UsuarioUpdateDto
{
    public string? usuario { get; set; }
    public string? senha { get; set; }
    public int? codFuncionario { get; set; }
    public int? codCargo { get; set; }
    public bool? ativo { get; set; }
}

