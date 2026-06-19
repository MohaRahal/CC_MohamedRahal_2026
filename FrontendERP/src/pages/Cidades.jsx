import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import { cidadesService } from '../services/cidadesService';

export default function Cidades() {
  const navigate = useNavigate();
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCidades();
  }, []);

  const fetchCidades = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await cidadesService.getCidades(token);
      setCidades(data || []);
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id, nome) => {
    const confirmou = window.confirm(`Tem certeza que deseja excluir a cidade "${nome}"?`);
    if (confirmou) {
      try {
        setDeletingId(id);
        const token = localStorage.getItem('token');
        await cidadesService.deleteCidade(token, id);
        setCidades(cidades.filter(c => c.codCidade !== id));
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Não foi possível excluir a cidade. Ela pode estar sendo usada em outros registros.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredCidades = cidades.filter(cidade => {
    const nomeCidade = cidade.cidade ? cidade.cidade.toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    return nomeCidade.includes(search);
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Cidades</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie as cidades cadastradas no sistema</p>
            </div>
            
            <button 
              onClick={() => navigate('/cidades/novo')}
              className="flex items-center gap-2 bg-ink-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md">
              <Plus size={16} />
              Nova Cidade
            </button>
          </div>

          <div className="mb-6">
            <div className="relative w-full md:w-2/3">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar por nome da cidade..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Cód</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado / UF</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Atualizado em</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCidades.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-16 text-center text-sm text-gray-500">
                        Nenhuma cidade encontrada.
                      </td>
                    </tr>
                  ) : (
                    filteredCidades.map((cidade, idx) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={cidade.codCidade} 
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        <td className="py-4 px-6 text-[13px] text-gray-500 font-medium">
                          #{cidade.codCidade}
                        </td>
                        <td className="py-4 px-6 text-[14px] text-gray-800 font-medium">
                          {cidade.cidade}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600">
                          {cidade.estado ? `${cidade.estado.estado} (${cidade.estado.uf || cidade.estado.UF || '-'})` : '-'}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600">
                          {formatDate(cidade.criado_em)}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600">
                          {formatDate(cidade.atualizado_em)}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => navigate(`/cidades/editar/${cidade.codCidade}`)}
                              className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer" title="Editar">
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(cidade.codCidade, cidade.cidade)}
                              disabled={deletingId === cidade.codCidade}
                              className={`transition-colors cursor-pointer ${deletingId === cidade.codCidade ? 'text-gray-300' : 'text-gray-400 hover:text-red-600'}`} 
                              title="Excluir">
                              {deletingId === cidade.codCidade ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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
    </AnimatedPage>
  );
}
