namespace Api.Models;

public class Grupos
{
    public int codGrupo { get; set; }
    public string grupo { get; set; } = string.Empty;
    public int codUsuario { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    public Usuarios Usuario { get; set; } = null!;
    
}