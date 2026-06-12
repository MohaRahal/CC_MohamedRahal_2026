namespace Api.DTOs;

public class MovimentacaoReadDto
{
    public int Id { get; set; }
    public int CodProduto { get; set; }
    public string ProdutoNome { get; set; } = string.Empty;
    public int IdUser { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public decimal Quantidade { get; set; }
    public decimal SaldoAnterior { get; set; }
    public decimal SaldoAtual { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public int? NumNfe { get; set; }
    public int? Serie { get; set; }
    public int? Modelo { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class MovimentacaoCreateDto
{
    public int CodProduto { get; set; }
    public string Tipo { get; set; } = string.Empty; // Deve ser 'Entrada' ou 'Saida'
    public decimal Quantidade { get; set; }
    public string Motivo { get; set; } = string.Empty;
    // Repare que o Frontend NÃO envia o saldo anterior, atual nem o idUser. 
    // Isso é calculado pela API por segurança.
}
