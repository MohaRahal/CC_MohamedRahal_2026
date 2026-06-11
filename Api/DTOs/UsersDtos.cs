namespace Api.DTOs;

public class UsersReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class UsersCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public int RoleId { get; set; }
}

public class UsersUpdateDto
{
    public string? Name { get; set; }
    public string? Senha { get; set; }
    public int? RoleId { get; set; }
}
