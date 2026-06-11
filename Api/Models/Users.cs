namespace Api.Models;

public class Users
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public Role? Role { get; set; }
}
