import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import EntityDetailsModal from '../components/EntityDetailsModal';
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
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    // Initial request only; the loader is also reused after mutations.
    // eslint-disable-next-line react-hooks/immutability
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
    const tableName = l.tabela || l.nomeTabela || '';
    const action = l.acao || l.tipo || '';
    const matchesSearch = tableName.toLowerCase().includes(searchTerm.toLowerCase()) || action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="w-full">
          
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

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-16 text-center text-sm text-gray-500">
                        Nenhum log encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => {
                      const action = log.acao || log.tipo || '—';
                      return (
                      <tr key={log.id || log.codLog} onClick={() => setSelectedLog(log)} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                        <td className="py-4 px-6 text-[13px] text-gray-600 whitespace-nowrap">
                          {new Date(log.createdAt || log.criado_em).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium">
                          {log.user?.name || log.user?.usuario || 'Sistema / Removido'}
                        </td>
                        <td className="py-4 px-6 text-[13px]">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                            action === 'INSERT' ? 'bg-green-50 text-green-700' :
                            action === 'UPDATE' ? 'bg-blue-50 text-blue-700' :
                            action === 'DELETE' ? 'bg-red-50 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {action}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600 font-medium">
                          {log.tabela || log.nomeTabela || '—'}
                        </td>
                      </tr>
                    );})
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
      {selectedLog && (
        <EntityDetailsModal
          title={`Log #${selectedLog.id || selectedLog.codLog}`}
          subtitle="Detalhes da auditoria"
          onClose={() => setSelectedLog(null)}
          fields={[
            { label: 'Código', value: `#${selectedLog.id || selectedLog.codLog}` },
            { label: 'Data', value: new Date(selectedLog.createdAt || selectedLog.criado_em).toLocaleString('pt-BR') },
            { label: 'Usuário', value: selectedLog.user?.name || selectedLog.user?.usuario || 'Sistema / Removido' },
            { label: 'Ação', value: selectedLog.acao || selectedLog.tipo },
            { label: 'Tabela', value: selectedLog.tabela || selectedLog.nomeTabela },
            { label: 'Registro', value: selectedLog.codRegistro },
            { label: 'Novo registro', value: selectedLog.novoRegistro, fullWidth: true },
          ]}
        />
      )}
    </AnimatedPage>
  );
}
