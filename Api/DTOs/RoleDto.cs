namespace Api.DTOs;

public class RoleCreateDto
{
    public string Name { get; set; } = string.Empty;
}
public class RoleReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime created_at { get; set; }
    public DateTime updated_at { get; set; }

}
public class RoleUpdateDto
{
    public string? Name { get; set; } 
}
