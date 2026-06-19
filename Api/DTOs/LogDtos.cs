namespace Api.DTOs;

public class LogReadDto
{
    public int codLog { get; set; }
    public int codUsuario { get; set; }
    public UserLogDto? User { get; set; }
    public string nomeTabela { get; set; } = string.Empty;
    public int codRegistro { get; set; }
    public int novoRegistro { get; set; }
    public string tipo { get; set; } = string.Empty;
    public DateTime criado_em { get; set; }
}

public class UserLogDto
{
    public int codUsuario { get; set; }
    public string usuario { get; set; } = string.Empty;
}

public class LogCreateDto
{
    public int codUsuario { get; set; }
    public string nomeTabela { get; set; } = string.Empty;
    public int codRegistro { get; set; }
    public int novoRegistro { get; set; }
    public string tipo { get; set; } = string.Empty;
}
