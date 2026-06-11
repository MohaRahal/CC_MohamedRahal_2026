namespace Api.Models;

public class CondicoesPagamento
{
    public int CodCondPagamento { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public int QtdParcelas { get; set; }
    public bool Ativo { get; set; } = true;
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}
