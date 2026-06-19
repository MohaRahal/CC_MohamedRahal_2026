namespace Api.DTOs;

public class MarcaCreateDto
{
    public string marca { get; set; } = string.Empty;
}
public class MarcaReadDto
{
    public int codMarca { get; set; }
    public string marca { get; set; } = string.Empty;
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}
public class MarcaUpdateDto
{
    public string? marca { get; set; } 
}