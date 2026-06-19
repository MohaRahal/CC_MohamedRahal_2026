namespace Api.Models;

public class Paises
{
    public int codPais { get; set; }
    public string pais { get; set; } = string.Empty;
    public string sigla { get; set; } = string.Empty;
    public string ddi { get; set; } = string.Empty;
    public string moeda { get; set; } = string.Empty;
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios Usuario { get; set; } = null!;
}
