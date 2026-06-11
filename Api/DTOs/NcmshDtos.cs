namespace Api.DTOs;

public class NcmshReadDto
{
    public string Codigo { get; set; } = string.Empty;
    public decimal AliqIcmsProdNfe { get; set; }
    public decimal AliqIpiProdNfe { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}

public class NcmshCreateDto
{
    public string Codigo { get; set; } = string.Empty;
    public decimal? AliqIcmsProdNfe { get; set; }
    public decimal? AliqIpiProdNfe { get; set; }
}

public class NcmshUpdateDto
{
    public decimal? AliqIcmsProdNfe { get; set; }
    public decimal? AliqIpiProdNfe { get; set; }
}
