import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import { logsService } from '../services/logsService';

const filters = [
  { id: 'ALL', label: 'Todos', activeColor: 'bg-black text-white', defaultColor: 'text-gray-500 hover:text-gray-900 hover:bg-gray-50' },
  { id: 'INSERT', label: 'Inserção', activeColor: 'bg-black text-white', defaultColor: 'text-gray-500 hover:text-gray-900 hover:bg-gray-50' },
  { id: 'UPDATE', label: 'Edição', activeColor: 'bg-black text-white', defaultColor: 'text-gray-500 hover:text-gray-900 hover:bg-gray-50' },
  { id: 'DELETE', label: 'Remoção', activeColor: 'bg-black text-white', defaultColor: 'text-gray-500 hover:text-gray-900 hover:bg-gray-50' },
];

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await logsService.getLogs();
      setLogs(data || []);
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.tabela?.toLowerCase().includes(searchTerm.toLowerCase()) || l.tipo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || l.acao === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Logs de Auditoria</h1>
              <p className="text-sm text-gray-500 mt-1">Acompanhe todas as alterações realizadas no sistema</p>
            </div>
          </div>

          <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-2/3">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar por nome da tabela ou detalhes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
              />
            </div>
            
            <div className="flex w-full md:w-auto bg-white border border-gray-200 rounded-lg p-1.5 shadow-sm overflow-x-auto relative">
              {filters.map((filter) => {
                const isActive = actionFilter === filter.id;
                return (
                  <button 
                    key={filter.id}
                    onClick={() => setActionFilter(filter.id)}
                    className={`relative px-4 py-2 text-[13px] font-medium rounded-md whitespace-nowrap z-10 transition-colors duration-300 ${isActive ? 'text-white' : filter.defaultColor}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFilterLog"
                        className={`absolute inset-0 rounded-md shadow-sm -z-10 ${filter.activeColor.split(' ')[0]}`}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    {filter.label}
                  </button>
                );
              })}
            </div>
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
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Tabela</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-16 text-center text-sm text-gray-500">
                        Nenhum log encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-[13px] text-gray-600 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium">
                          {log.user ? log.user.name : "Sistema / Deletado"}
                        </td>
                        <td className="py-4 px-6 text-[13px]">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                            log.acao === 'INSERT' ? 'bg-green-50 text-green-700' :
                            log.acao === 'UPDATE' ? 'bg-blue-50 text-blue-700' :
                            log.acao === 'DELETE' ? 'bg-red-50 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {log.acao}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600 font-medium">
                          {log.tabela}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-500 max-w-[250px] truncate" title={log.tipo}>
                          {log.tipo.toUpperCase()}
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
