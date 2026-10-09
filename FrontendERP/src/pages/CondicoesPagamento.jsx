import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import EntityDetailsModal from '../components/EntityDetailsModal';
import { condicoesPagamentosService } from '../services/condicoesPagamentosService';
import { confirmAction } from '../components/feedback';

export default function CondicoesPagamento() {
  const navigate = useNavigate();
  const [condicoesPagamento, setCondicoesPagamento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCondicao, setSelectedCondicao] = useState(null);

  useEffect(() => {
    // Initial request only; the loader is also reused after mutations.
    // eslint-disable-next-line react-hooks/immutability
    fetchCondicoesPagamento();
  }, []);

  const fetchCondicoesPagamento = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await condicoesPagamentosService.getCondicoesPagamentos(token);
      setCondicoesPagamento(data || []);
    } catch (error) {
      console.error("Erro ao carregar formas de pagamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id, nome) => {
    const confirmou = await confirmAction(`Tem certeza que deseja excluir a condição de pagamento "${nome}"?`);
    if (confirmou) {
      try {
        setDeletingId(id);
        const token = localStorage.getItem('token');
        await condicoesPagamentosService.deleteCondicoesPagamento(token, id);
        setCondicoesPagamento(condicoesPagamento.filter(c => c.codCondPagamento !== id));
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Não foi possível excluir a condição de pagamento.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const condicoesPagamentoFiltradas = condicoesPagamento.filter(condicao => 
    condicao.condPagamento.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const formatDate = (dateString) => {
  if (!dateString) return '-';

  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="w-full">
          
          <div className="mb-8 flex justify-end">
            <button 
              onClick={() => navigate('/condicoes-pagamento/novo')}
              className="flex items-center gap-2 bg-ink-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md">
              <Plus size={16} />
              Nova Condição de Pagamento
            </button>
          </div>

          <div className="mb-6">
            <div className="relative w-full md:w-2/3">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar por nome ou sigla..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Cód</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Condição de Pagamento</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Total de Parcelas</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {condicoesPagamentoFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-16 text-center text-sm text-gray-500">
                        Nenhuma forma de pagamento encontrada.
                      </td>
                    </tr>
                  ) : (
                    condicoesPagamentoFiltradas.map((condicao, idx) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={condicao.codCondPagamento} 
                        onClick={() => setSelectedCondicao(condicao)}
                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-6 text-[13px] text-gray-500 font-medium">
                          #{condicao.codCondPagamento}
                        </td>
                        <td className="py-4 px-6 text-[14px] text-gray-800 font-medium">
                          {condicao.condPagamento}
                        </td>
                        <td className="py-4 px-6 text-[14px] text-gray-800 font-medium">
                          {condicao.qtdParcelas}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            condicao.ativo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {condicao.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[13px] text-right">
                          <div className="flex items-center justify-end gap-3 transition-opacity">
                            <button 
                              onClick={(event) => { event.stopPropagation(); navigate(`/condicoes-pagamento/editar/${condicao.codCondPagamento}`); }}
                              className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer" title="Editar">
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={(event) => { event.stopPropagation(); handleDeleteClick(condicao.codCondPagamento, condicao.condPagamento); }}
                              disabled={deletingId === condicao.codCondPagamento}
                              className={`transition-colors cursor-pointer ${deletingId === condicao.codCondPagamento ? 'text-gray-300' : 'text-gray-400 hover:text-red-600'}`} 
                              title="Excluir">
                              {deletingId === condicao.codCondPagamento ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
      {selectedCondicao && (
        <EntityDetailsModal
          title={selectedCondicao.condPagamento}
          subtitle="Detalhes da condição de pagamento"
          onClose={() => setSelectedCondicao(null)}
          onEdit={() => navigate(`/condicoes-pagamento/editar/${selectedCondicao.codCondPagamento}`)}
          fields={[
            { label: 'Código', value: `#${selectedCondicao.codCondPagamento}` },
            { label: 'Status', value: selectedCondicao.ativo ? 'Ativo' : 'Inativo' },
            { label: 'Total de parcelas', value: selectedCondicao.qtdParcelas },
            { label: 'Juros', value: `${selectedCondicao.juros || 0}%` },
            { label: 'Multa', value: `${selectedCondicao.multa || 0}%` },
            { label: 'Desconto', value: `${selectedCondicao.desconto || 0}%` },
            { label: 'Criado em', value: formatDate(selectedCondicao.criado_em) },
            { label: 'Atualizado em', value: formatDate(selectedCondicao.atualizado_em) },
          ]}
        />
      )}
    </AnimatedPage>
  );
}
