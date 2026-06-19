namespace Api.DTOs;

public class ModeloCreateDto
{
    public string modelo { get; set; } = string.Empty;
    public int codMarca { get; set; }
}
public class ModeloReadDto
{
    public int codModelo { get; set; }
    public string modelo { get; set; } = string.Empty;
    public int codMarca { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}
public class ModeloUpdateDto
{
    public string? modelo { get; set; } 
    public int? codMarca { get; set; }
}