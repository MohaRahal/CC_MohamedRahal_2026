namespace Api.Models;


public class Transportadores
{
    public int codTransp { get; set; }
    public string apelido_NomeFantasia { get; set; } = string.Empty;
    public string transportador { get; set; } = string.Empty;

    public string inscEstTransp {get;set;} = string.Empty;
    public string tipoPessoa {get;set;} = string.Empty;
    public string cpf_cnpjTransp {get;set;} = string.Empty;
    public string ender {get;set;} = string.Empty;
    public string numero {get;set;} = string.Empty;
    public string complemento {get;set;} = string.Empty;
    public string bairro {get;set;} = string.Empty;
    public int codCidade {get;set;}
    public string cep {get;set;} = string.Empty;
    public string site {get;set;} = string.Empty;
    public string fone {get;set;} = string.Empty;
    public string email {get;set;} = string.Empty;
    public bool ativo {get;set;} = true;
    


    public int codUsuario { get; set;}
    public DateTime criado_em { get; set; }
    public DateTime atualizado_em { get; set; }

    public Cidades Cidade { get; set;} = null!;
    public Usuarios Usuario { get; set;} = null!;

}

