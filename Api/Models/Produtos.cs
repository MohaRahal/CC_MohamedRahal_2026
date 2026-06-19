namespace Api.Models;

public class Produtos
{
    public int codProd { get; set; }
    public string produto { get; set; } = string.Empty;
    public int codMarca { get; set; }
    public int codGrupo { get; set; }
    public int codUnidade { get; set; }
    public string codigoBarras { get; set; } = string.Empty;
    public string undProd { get; set; } = string.Empty;
    public decimal? pesoBruto { get; set; }
    public decimal? pesoLiq { get; set; }
    public decimal? saldoProd { get; set; }
    public decimal precoVenda { get; set; }
    public decimal precoCompra { get; set; }
    public decimal? custoMedioProd { get; set; }
    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios Usuario { get; set; } = null!;
    public Marcas? Marca { get; set; }
    public Grupos? Grupo { get; set; }
    public UnidadesMedidas Unidade { get; set; } = null!;
}

