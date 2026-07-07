import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit, Trash2, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import { marcasService } from '../services/marcasService';

export default function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarca, setSelectedMarca] = useState(null);

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta marca?")) {
      try {
        await marcasService.deleteMarca(id);
        setMarcas(marcas.filter(m => m.codMarca !== id));
      } catch (error) {
        console.error("Erro ao excluir marca:", error);
        alert("Erro ao excluir marca.");
      }
    }
  };

  const filtered = marcas.filter(m =>
    m.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-2 sm:px-4 text-gray-800 font-sans">
        <div className="w-full max-w-full mx-auto">

          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Marcas</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie as marcas de produtos</p>
            </div>
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
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-x-auto">
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
                      <tr key={m.codMarca} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-[13px] text-gray-400 font-mono">
                          #{m.codMarca?.toString().padStart(4, '0')}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium">
                          {m.marca}
                        </td>
                        <td className="py-4 px-6 text-[13px] whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedMarca(m)}
                              className="cursor-pointer p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                              title="Visualizar detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            <Link
                              to={`/Marcas/editar/${m.codMarca}`}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(m.codMarca)}
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

      {/* Modal de Detalhes */}
      {selectedMarca && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <p className="text-xs text-gray-400 font-mono mb-1">#{selectedMarca.codMarca?.toString().padStart(4, '0')}</p>
                <h3 className="text-xl font-medium text-gray-900">{selectedMarca.marca}</h3>
              </div>
              <button
                onClick={() => setSelectedMarca(null)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1.5 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-32 text-gray-500 text-sm font-medium">Marca:</div>
                <div className="text-gray-800 font-medium">{selectedMarca.marca}</div>
              </div>
            </div>

            <div className="flex justify-end px-6 pb-6">
              <button
                onClick={() => setSelectedMarca(null)}
                className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
