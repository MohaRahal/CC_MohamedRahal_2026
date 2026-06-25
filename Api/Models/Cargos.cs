namespace Api.Models;

public class Cargos
{
    public int codCargo { get; set; }
    public string cargo { get; set; } = string.Empty;
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios Usuario { get; set; } = null!;
}

