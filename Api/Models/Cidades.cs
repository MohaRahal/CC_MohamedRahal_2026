namespace Api.Models;

public class Cidades
{
    public int codCidade { get; set; }
    public string cidade { get; set; } = string.Empty;
    public int codEstado { get; set; }
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Estados Estado { get; set; } = null!;
    public Usuarios Usuario { get; set; } = null!;
}

