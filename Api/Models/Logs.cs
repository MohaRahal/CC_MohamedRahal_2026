namespace Api.Models;

public class Logs
{
    public int Id { get; set; }
    public int IdUser { get; set; }
    public string Acao { get; set; } = string.Empty;
    public string Tabela { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public Users? User { get; set; }
}