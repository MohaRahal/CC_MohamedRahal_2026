namespace Api.Models;
public class Clientes{
    public int codCliente { get; set; }
    public string cliente { get; set; }

    public string CodigoTipoPessoa { get; set; }
    public string InscricaoEstadual { get; set; }
    public string InscricaoMunicipal { get; set; }
    public string CpfCnpj { get; set; }
    public string Telefone { get; set; }
    public string Celular { get; set; }
    public string Email { get; set; }
    public string Endereco { get; set; }
    public string Numero { get; set; }
    public string Complemento { get; set; }
    public string Bairro { get; set; }



    public int codUsuario { get; set; }
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Usuarios? Usuario { get; set; }
    public Cidades? Cidade {get;set;}
}