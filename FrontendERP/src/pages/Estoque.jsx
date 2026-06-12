import { useState, useEffect } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import AnimatedPage from './AnimatedPage';
import { produtosService } from '../services/produtosService';

export default function Estoque() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const data = await produtosService.getProdutos();
      setProdutos(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProdutos = produtos.filter(p => 
    p.descProd?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codProduto?.toString().includes(searchTerm)
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-5xl mx-auto">
          
          {/* Cabeçalho Minimalista */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Estoque</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie seus produtos e acompanhe os saldos</p>
            </div>
            <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm">
              <Plus size={16} />
              Novo Produto
            </button>
          </div>

          {/* Barra de Busca Clean */}
          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou código..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
            />
          </div>

          {/* Tabela Minimalista */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Cód</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Custo Médio</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Saldo Atual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProdutos.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-16 text-center text-sm text-gray-500">
                        Nenhum produto encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredProdutos.map(produto => (
                      <tr key={produto.codProduto} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-sm text-gray-400 font-mono">
                          #{produto.codProduto?.toString().padStart(4, '0')}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                          {produto.descProd}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 text-right">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.custoMedioProd || 0)}
                        </td>
                        <td className="py-4 px-6 text-sm text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                            produto.saldoProd > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {produto.saldoProd || 0} un
                          </span>
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

