namespace Api.Models;

public class UnidadesMedidas
{
    public int codUnidade { get; set; }
    public string unidade { get; set; } = string.Empty;
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios Usuario { get; set; } = null!;
    
}