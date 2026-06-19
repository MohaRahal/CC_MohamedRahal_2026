namespace Api.Models;

public class Logs
{
    public int codLog { get; set; }
    public int codUsuario { get; set; }
    public string nomeTabela { get; set; } = string.Empty;
    public int codRegistro { get; set; }
    public int novoRegistro { get; set; }
    public string tipo { get; set; } = string.Empty;
    public DateTime criado_em { get; set; }

    public Usuarios? User { get; set; }
}
