namespace Api.Models;

public class Modelos
{
    public int codModelo { get; set; }
    public string modelo { get; set; } = string.Empty;
    public int codMarca { get; set; }
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios Usuario { get; set; } = null!;
    public Marcas Marca { get; set; } = null!;
}