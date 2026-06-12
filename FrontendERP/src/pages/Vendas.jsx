import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, FileText } from 'lucide-react';
import AnimatedPage from './AnimatedPage';
import { vendasService } from '../services/vendasService';

export default function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVendas();
  }, []);

  const fetchVendas = async () => {
    try {
      setLoading(true);
      const data = await vendasService.getVendas();
      setVendas(data || []);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = vendas.filter(v => 
    v.chaveAcessoNFe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.numNfe?.toString().includes(searchTerm)
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Vendas / Notas Fiscais</h1>
              <p className="text-sm text-gray-500 mt-1">Acompanhe as vendas e emissões de NFe</p>
            </div>
            <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm">
              <Plus size={16} />
              Nova Venda (NFe)
            </button>
          </div>

          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por Número ou Chave de Acesso..." 
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
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Nº / Série</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Chave de Acesso</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Natureza</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Data Emissão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-16 text-center text-sm text-gray-500">
                        Nenhuma venda encontrada.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(v => (
                      <tr key={`${v.numNfe}-${v.serie}`} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-gray-400" />
                            {v.numNfe.toString().padStart(6, '0')} / {v.serie}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[11px] text-gray-500 font-mono tracking-wide">
                          {v.chaveAcessoNFe || '---'}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600">
                          {v.natOper}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600">
                          {v.fornecedor?.razaoSocial || `Cód: ${v.codFornecedor}`}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-500 text-right">
                          {v.dataEmitNfe ? new Date(v.dataEmitNfe).toLocaleDateString('pt-BR') : '---'}
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
