namespace Api.Models;

public class Estados
{
    public int codEstado { get; set; }
    public string UF { get; set; } = string.Empty;
    public string estado { get; set; } = string.Empty;
    public int codPais { get; set; }
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Paises Pais { get; set; } = null!;
    public Usuarios Usuario { get; set; } = null!;
}

