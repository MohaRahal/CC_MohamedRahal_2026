import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import EntityDetailsModal from '../components/EntityDetailsModal';
import Toast from '../components/Toast';
import { confirmAction } from '../components/feedback';
import { marcasService } from '../services/marcasService';

export default function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Initial request only; the loader is also reused after mutations.
    // eslint-disable-next-line react-hooks/immutability
    fetchMarcas();
  }, []);

  const fetchMarcas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await marcasService.getMarcas(token);
      setMarcas(data || []);
    } catch (error) {
      console.error("Erro ao carregar marcas:", error);
      setToast({ type: 'error', message: error.message || 'Não foi possível carregar as marcas.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (await confirmAction("Tem certeza que deseja excluir esta marca?")) {
      try {
        await marcasService.deleteMarca(id);
        setMarcas((atuais) => atuais.filter(m => m.codMarca !== id));
        setSelectedMarca(null);
        setToast({ type: 'success', message: 'Marca excluída com sucesso.' });
      } catch (error) {
        console.error("Erro ao excluir marca:", error);
        setToast({
          type: 'error',
          message: error.message || 'Esta marca não pode ser excluída porque está sendo usada em outro cadastro.',
        });
      }
    }
  };

  const filtered = marcas.filter(m =>
    m.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-2 sm:px-4 text-gray-800 font-sans">
        <div className="w-full">

          <div className="mb-8 flex justify-end">
            <Link
              to="/Marcas/novo"
              className="cursor-pointer flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Plus size={16} /> Nova Marca
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Cód</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-16 text-center text-sm text-gray-500">
                        Nenhuma marca encontrada.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(m => (
                      <tr key={m.codMarca} onClick={() => setSelectedMarca(m)} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                        <td className="py-4 px-6 text-[13px] text-gray-400 font-mono">
                          #{m.codMarca?.toString().padStart(4, '0')}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium">
                          {m.marca}
                        </td>
                        <td className="py-4 px-6 text-[13px] whitespace-nowrap">
                          <div className="flex gap-2">
                            <Link
                              to={`/Marcas/editar/${m.codMarca}`}
                              onClick={(event) => event.stopPropagation()}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={(event) => { event.stopPropagation(); handleDelete(m.codMarca); }}
                              className="cursor-pointer p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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

      {selectedMarca && (
        <EntityDetailsModal
          title={selectedMarca.marca}
          subtitle="Detalhes da marca"
          onClose={() => setSelectedMarca(null)}
          fields={[
            { label: 'Código', value: `#${selectedMarca.codMarca}` },
            { label: 'Marca', value: selectedMarca.marca },
          ]}
        />
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </AnimatedPage>
  );
}
