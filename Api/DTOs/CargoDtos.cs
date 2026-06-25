using Api.Models;

namespace Api.DTOs;

public class CargoCreateDto
{
    public string cargo { get; set; } = string.Empty;
}
public class CargoReadDto
{
    public int codCargo { get; set; }
    public string cargo { get; set; } = string.Empty;
    public int? codUsuario { get; set; }
    public UsuarioReadDto? Usuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

}
public class CargoUpdateDto
{
    public string? cargo { get; set; } 
}
