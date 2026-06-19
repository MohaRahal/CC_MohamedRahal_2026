namespace Api.Models;

public class Marcas
{
    public int codMarca { get; set; }
    public string marca { get; set; } = string.Empty;
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios Usuario { get; set; } = null!;
    
}