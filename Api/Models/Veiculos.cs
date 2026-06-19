namespace Api.Models;

public class Veiculos
{
   public int codVeiculo { get; set; }
   public string? placaVeiculo { get; set; }
   public string? placaMercosul { get; set; }
   public string? chassi { get; set; }
   public int codModelo { get; set; }
   public int codTransportador { get; set; }
   public int? codEstado { get; set; }
   public string? codANTT { get; set; }
   public int codUsuario { get; set; }
   public DateTime criado_em { get; set; }
   public DateTime atualizado_em { get; set; }

   public Modelos Modelo { get; set; } = null!;
   public Transportadores Transportador { get; set; } = null!;
   public Estados? Estado { get; set; }
   public Usuarios Usuario { get; set; } = null!;
}

