import { useState, useEffect } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import AnimatedPage from './AnimatedPage';
import { movimentacoesService } from '../services/movimentacoesService';

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovimentacoes();
  }, []);

  const fetchMovimentacoes = async () => {
    try {
      setLoading(true);
      const data = await movimentacoesService.getMovimentacoes();
      setMovimentacoes(data || []);
    } catch (error) {
      console.error("Erro ao carregar movimentações:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovimentacoes = movimentacoes.filter(m => 
    m.produtoNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.motivo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Movimentações de Estoque</h1>
              <p className="text-sm text-gray-500 mt-1">Histórico completo de entradas e saídas de produtos</p>
            </div>
            <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm">
              <Plus size={16} />
              Ajuste Manual
            </button>
          </div>

          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por produto ou motivo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Tipo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Qtd</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">S. Anterior</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">S. Atual</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredMovimentacoes.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-16 text-center text-sm text-gray-500">
                        Nenhuma movimentação encontrada.
                      </td>
                    </tr>
                  ) : (
                    filteredMovimentacoes.map(mov => (
                      <tr key={mov.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-[13px] text-gray-500 whitespace-nowrap">
                          {new Date(mov.createdAt).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium">
                          {mov.produtoNome}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600">
                          {mov.userName}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            mov.tipo === 'Entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {mov.tipo}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 text-right font-medium">
                          {mov.tipo === 'Entrada' ? '+' : '-'}{mov.quantidade}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-500 text-right">
                          {mov.saldoAnterior}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 text-right font-semibold">
                          {mov.saldoAtual}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-500 max-w-[150px] truncate" title={mov.motivo}>
                          {mov.motivo}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </AnimatedPage>
  );
}
