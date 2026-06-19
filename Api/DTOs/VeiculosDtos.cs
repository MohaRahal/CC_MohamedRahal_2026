namespace Api.DTOs;

public class VeiculosReadDto
{
    public int codVeiculo { get; set; }
    public string? placaVeiculo { get; set; }
    public string? placaMercosul { get; set; }
    public string? chassi { get; set; }
    public int codModelo { get; set; }
    public int codTransportador { get; set; }
    public int? codEstado { get; set; }
    public string? codANTT { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }
}

public class VeiculosCreateDto
{
    public string? placaVeiculo { get; set; }
    public string? placaMercosul { get; set; }
    public string? chassi { get; set; }
    public int codModelo { get; set; }
    public int codTransportador { get; set; }
    public int? codEstado { get; set; }
    public string? codANTT { get; set; }
}

public class VeiculosUpdateDto
{
    public string? placaVeiculo { get; set; }
    public string? placaMercosul { get; set; }
    public string? chassi { get; set; }
    public int? codModelo { get; set; }
    public int? codTransportador { get; set; }
    public int? codEstado { get; set; }
    public string? codANTT { get; set; }
}

