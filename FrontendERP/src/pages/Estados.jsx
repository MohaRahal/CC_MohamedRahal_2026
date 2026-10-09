import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import AnimatedPage from './AnimatedPage';
import EntityDetailsModal from '../components/EntityDetailsModal';
import { estadosService } from '../services/estadosService';
import { confirmAction } from '../components/feedback';

export default function Estados() {
  const navigate = useNavigate();
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState(null);

  useEffect(() => {
    let isActive = true;

    const loadEstados = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await estadosService.getEstados(token);
        if (isActive) setEstados(data || []);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadEstados();
    return () => { isActive = false; };
  }, []);

  const handleDeleteClick = async (id, nome) => {
    if (!await confirmAction(`Tem certeza que deseja excluir o estado "${nome}"?`)) return;

    try {
      setDeletingId(id);
      const token = localStorage.getItem('token');
      await estadosService.deleteEstado(token, id);
      setEstados((current) => current.filter((estado) => estado.codEstado !== id));
      if (selectedEstado?.codEstado === id) setSelectedEstado(null);
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Não foi possível excluir o estado. Ele pode estar sendo usado em outros registros.');
    } finally {
      setDeletingId(null);
    }
  };

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase('pt-BR');
  const filteredEstados = estados.filter((estado) =>
    (estado.estado || '').toLocaleLowerCase('pt-BR').includes(normalizedSearch)
    || (estado.uf || '').toLocaleLowerCase('pt-BR').includes(normalizedSearch)
    || (estado.pais?.pais || '').toLocaleLowerCase('pt-BR').includes(normalizedSearch)
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const stateInitials = (estado) => (estado.uf || estado.estado || '--').slice(0, 2).toUpperCase();

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] px-8 pb-12 pt-24 font-sans text-gray-800">
        <div className="w-full">
          <div className="mb-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/estados/novo')}
              className="flex items-center gap-2 rounded-full bg-ink-black px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:scale-105 hover:bg-carbon"
            >
              <Plus size={16} /> Novo Estado
            </button>
          </div>

          <div className="mb-6">
            <div className="relative w-full md:w-2/3">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por estado, UF ou país..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Código</th>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">UF</th>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">País</th>
                      <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredEstados.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-16 text-center text-sm text-gray-500">
                          Nenhum estado encontrado.
                        </td>
                      </tr>
                    ) : filteredEstados.map((estado) => (
                      <tr
                        key={estado.codEstado}
                        onClick={() => setSelectedEstado(estado)}
                        className="group cursor-pointer transition-colors hover:bg-gray-50/80"
                        title="Clique para ver os detalhes"
                      >
                        <td className="px-6 py-4 text-[13px] font-medium text-gray-500">#{estado.codEstado}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                              {stateInitials(estado)}
                            </div>
                            <span className="text-[14px] font-medium text-gray-800">
                              {estado.estado || 'Não informado'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-gray-600">
                          <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 font-medium uppercase">
                            {estado.uf || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-medium text-gray-600">
                          {estado.pais?.pais || 'Não vinculado'}
                        </td>
                        <td className="px-6 py-4 text-right text-[13px]">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/estados/editar/${estado.codEstado}`);
                              }}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                              title="Editar"
                              aria-label={`Editar ${estado.estado}`}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteClick(estado.codEstado, estado.estado);
                              }}
                              disabled={deletingId === estado.codEstado}
                              className={`rounded-lg p-2 transition-colors ${deletingId === estado.codEstado ? 'text-gray-300' : 'text-gray-400 hover:bg-red-50 hover:text-red-600'}`}
                              title="Excluir"
                              aria-label={`Excluir ${estado.estado}`}
                            >
                              {deletingId === estado.codEstado
                                ? <Loader2 size={16} className="animate-spin" />
                                : <Trash2 size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedEstado && (
        <EntityDetailsModal
          title={selectedEstado.estado}
          subtitle="Detalhes do estado"
          onClose={() => setSelectedEstado(null)}
          onEdit={() => navigate(`/estados/editar/${selectedEstado.codEstado}`)}
          fields={[
            { label: 'Código', value: `#${selectedEstado.codEstado}` },
            { label: 'Estado', value: selectedEstado.estado },
            { label: 'UF', value: selectedEstado.uf },
            { label: 'País', value: selectedEstado.pais?.pais },
            { label: 'Cadastrado por', value: selectedEstado.usuario?.usuario },
            { label: 'Criado em', value: formatDate(selectedEstado.criado_em) },
            { label: 'Atualizado em', value: formatDate(selectedEstado.atualizado_em), fullWidth: true },
          ]}
        />
      )}
    </AnimatedPage>
  );
}
