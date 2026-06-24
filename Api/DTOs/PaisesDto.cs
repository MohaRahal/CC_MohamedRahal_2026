namespace Api.DTOs;

public class PaisesCreateDto
{
    public string pais { get; set; } = string.Empty;
    public string sigla { get; set; } = string.Empty;
    public string ddi { get; set; } = string.Empty;
    public string moeda { get; set; } = string.Empty;
}
public class PaisesReadDto
{
    public int codPais { get; set; }
    public string pais { get; set; } = string.Empty;
    public string sigla { get; set; } = string.Empty;
    public string ddi { get; set; } = string.Empty;
    public string moeda { get; set; } = string.Empty;
    public int codUsuario { get; set; }
    public UsuarioReadDto? Usuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}
public class PaisesUpdateDto
{
    public string? pais { get; set; }
    public string? sigla { get; set; }
    public string? ddi { get; set; }
    public string? moeda { get; set; }
}
