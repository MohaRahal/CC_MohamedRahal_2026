import { Search, Plus, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AnimatedPage from './AnimatedPage';

export default function Financeiro() {
  // Tela de Interface (Sem conexão com API ainda pois o Controller não existe)
  const stats = [
    { label: "Receita (Mês)", value: "R$ 45.231,00", icon: <ArrowUpRight size={20} className="text-green-500" />, trend: "+12.5%" },
    { label: "Despesas (Mês)", value: "R$ 12.054,00", icon: <ArrowDownRight size={20} className="text-red-500" />, trend: "-2.4%" },
    { label: "Saldo Previsto", value: "R$ 33.177,00", icon: <DollarSign size={20} className="text-blue-500" />, trend: "+8.1%" },
  ];

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Financeiro</h1>
              <p className="text-sm text-gray-500 mt-1">Contas a pagar, a receber e fluxo de caixa</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 text-sm rounded hover:bg-gray-50 transition-colors shadow-sm">
                Nova Despesa
              </button>
              <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm">
                <Plus size={16} />
                Nova Receita
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-light tracking-tight text-gray-900">{stat.value}</span>
                  <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col items-center justify-center py-24">
            <DollarSign size={48} className="text-gray-200 mb-4" strokeWidth={1} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Módulo em Desenvolvimento</h3>
            <p className="text-sm text-gray-500 max-w-sm text-center">
              A integração com as tabelas de Contas a Pagar, Contas a Receber, Formas e Condições de pagamento será implementada em breve.
            </p>
          </div>

        </div>
      </div>
    </AnimatedPage>
  );
}
