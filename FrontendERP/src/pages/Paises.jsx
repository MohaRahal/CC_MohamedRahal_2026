import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import EntityDetailsModal from '../components/EntityDetailsModal';
import { paisesService } from '../services/paisesService';
import { confirmAction } from '../components/feedback';

export default function Paises() {
  const navigate = useNavigate();
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [selectedPais, setSelectedPais] = useState(null);

  useEffect(() => {
    let isActive = true;

    const loadPaises = async () => {
      try {
        const data = await paisesService.getPaises(localStorage.getItem('token'));
        if (isActive) setPaises(data || []);
      } catch (error) {
        console.error('Erro ao carregar países:', error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadPaises();
    return () => { isActive = false; };
  }, []);

  const handleDeleteClick = async (id, nome) => {
    if (!await confirmAction(`Tem certeza que deseja excluir o país "${nome}"?`)) return;
    try {
      setDeletingId(id);
      await paisesService.deletePais(localStorage.getItem('token'), id);
      setPaises((current) => current.filter((pais) => pais.codPais !== id));
      if (selectedPais?.codPais === id) setSelectedPais(null);
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Não foi possível excluir o país. Ele pode estar sendo usado em outros registros.');
    } finally {
      setDeletingId(null);
    }
  };

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase('pt-BR');
  const filteredPaises = paises.filter((pais) =>
    (pais.pais || '').toLocaleLowerCase('pt-BR').includes(normalizedSearch)
    || (pais.sigla || '').toLocaleLowerCase('pt-BR').includes(normalizedSearch)
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const countryInitials = (country) => (country || '--').slice(0, 2).toUpperCase();

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="w-full">
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => navigate('/paises/novo')}
              className="flex items-center gap-2 bg-ink-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md"
            >
              <Plus size={16} /> Novo País
            </button>
          </div>

          <div className="mb-6">
            <div className="relative w-full md:w-2/3">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou sigla..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
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
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                      <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
                      <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Sigla</th>
                      <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredPaises.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-16 text-center text-sm text-gray-500">Nenhum país encontrado.</td>
                      </tr>
                    ) : filteredPaises.map((pais, index) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        key={pais.codPais}
                        onClick={() => setSelectedPais(pais)}
                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                        title="Clique para ver os detalhes"
                      >
                        <td className="py-4 px-6 text-[13px] text-gray-500 font-medium">#{pais.codPais}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                              {countryInitials(pais.sigla || pais.pais)}
                            </div>
                            <span className="text-[14px] text-gray-800 font-medium">{pais.pais || 'Não informado'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600">
                          <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 font-medium uppercase">
                            {pais.sigla || '—'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[13px] text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/paises/editar/${pais.codPais}`);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteClick(pais.codPais, pais.pais);
                              }}
                              disabled={deletingId === pais.codPais}
                              className={`p-2 rounded-lg transition-colors ${deletingId === pais.codPais ? 'text-gray-300' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                              title="Excluir"
                            >
                              {deletingId === pais.codPais
                                ? <Loader2 size={16} className="animate-spin" />
                                : <Trash2 size={16} />}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedPais && (
        <EntityDetailsModal
          title={selectedPais.pais}
          subtitle="Detalhes do país"
          onClose={() => setSelectedPais(null)}
          onEdit={() => navigate(`/paises/editar/${selectedPais.codPais}`)}
          fields={[
            { label: 'Código', value: `#${selectedPais.codPais}` },
            { label: 'Sigla', value: selectedPais.sigla?.toUpperCase() },
            { label: 'DDI', value: selectedPais.ddi },
            { label: 'Moeda', value: selectedPais.moeda?.toUpperCase() },
            { label: 'Cadastrado por', value: selectedPais.usuario?.usuario },
            { label: 'Criado em', value: formatDate(selectedPais.criado_em) },
            { label: 'Última atualização', value: formatDate(selectedPais.atualizado_em), fullWidth: true },
          ]}
        />
      )}
    </AnimatedPage>
  );
}
