namespace Api.DTOs;

public class GrupoCreateDto
{
    public string grupo { get; set; } = string.Empty;
}
public class GrupoReadDto
{
    public int codGrupo { get; set; }
    public string grupo { get; set; } = string.Empty;
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}
public class GrupoUpdateDto
{
    public string? grupo { get; set; } 
}