namespace Api.DTOs;

public class TransportadoresReadDto
{
    public int CodTransp { get; set; }
    public string CpfCnpjTransp { get; set; } = string.Empty;
    public string EndTransp { get; set; } = string.Empty;
    public int? CodCidade { get; set; }
    public string RazaoSocTransp { get; set; } = string.Empty;
    public string InscEstTransp { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class TransportadoresCreateDto
{
    public string CpfCnpjTransp { get; set; } = string.Empty;
    public string EndTransp { get; set; } = string.Empty;
    public int? CodCidade { get; set; }
    public string RazaoSocTransp { get; set; } = string.Empty;
    public string InscEstTransp { get; set; } = string.Empty;
}

public class TransportadoresUpdateDto
{
    public string? CpfCnpjTransp { get; set; }
    public string? EndTransp { get; set; }
    public int? CodCidade { get; set; }
    public string? RazaoSocTransp { get; set; }
    public string? InscEstTransp { get; set; }
}
