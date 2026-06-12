namespace Api.DTOs;

public class LogReadDto
{
    public int Id { get; set; }
    public int IdUser { get; set; }
    public UserLogDto? User { get; set; }
    public string Acao { get; set; } = string.Empty;
    public string Tabela { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class UserLogDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class LogCreateDto
{
    public int IdUser { get; set; }
    public string Acao { get; set; } = string.Empty;
    public string Tabela { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
}
