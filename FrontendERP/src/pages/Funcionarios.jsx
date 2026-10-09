import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Plus, Edit2, Trash2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import EntityDetailsModal from '../components/EntityDetailsModal';
import { funcionariosService } from '../services/funcionariosService';
import { confirmAction } from '../components/feedback';
import { cargosService } from '../services/cargosService';

export default function Funcionarios() {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [cargosMap, setCargosMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);

  useEffect(() => {
    // Initial request only; the loader is also reused after mutations.
    // eslint-disable-next-line react-hooks/immutability
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [funcs, cargos] = await Promise.all([
        funcionariosService.getFuncionarios(),
        cargosService.getCargos(token),
      ]);
      setFuncionarios(funcs || []);
      const map = {};
      (cargos || []).forEach(c => { map[c.codCargo] = c.cargo; });
      setCargosMap(map);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (!await confirmAction(`Tem certeza que deseja excluir o funcionário "${nome}"?`)) return;
    try {
      setDeletingId(id);
      await funcionariosService.deleteFuncionario(id);
      setFuncionarios(prev => prev.filter(f => f.codFuncionario !== id));
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Não foi possível excluir. O funcionário pode estar vinculado a um usuário.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (str) => {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('pt-BR');
  };

  const filtered = funcionarios.filter(f =>
    f.funcionario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.cpf?.includes(searchTerm)
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="w-full">

          <div className="mb-8 flex justify-end">
            <button
              onClick={() => navigate('/funcionarios/novo')}
              className="flex items-center gap-2 bg-ink-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md"
            >
              <Plus size={16} />
              Novo Funcionário
            </button>
          </div>

          {/* Search */}
          <div className="mb-6 relative w-full md:w-2/3">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
            />
          </div>

          {/* Table */}
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
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-16 text-center text-sm text-gray-500">
                        <Users size={32} className="mx-auto mb-3 text-gray-300" />
                        Nenhum funcionário encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((f, idx) => (
                      <motion.tr
                        key={f.codFuncionario}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => setSelectedFuncionario(f)}
                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-6 text-[13px] text-gray-400 font-mono">
                          #{f.codFuncionario.toString().padStart(3, '0')}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium">
                          {f.funcionario}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600">
                          {cargosMap[f.codCargo] ?? `#${f.codCargo}`}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-3 transition-opacity">
                            <button
                              onClick={(event) => { event.stopPropagation(); navigate(`/funcionarios/editar/${f.codFuncionario}`); }}
                              className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={(event) => { event.stopPropagation(); handleDelete(f.codFuncionario, f.funcionario); }}
                              disabled={deletingId === f.codFuncionario}
                              className={`transition-colors cursor-pointer ${deletingId === f.codFuncionario ? 'text-gray-300' : 'text-gray-400 hover:text-red-600'}`}
                              title="Excluir"
                            >
                              {deletingId === f.codFuncionario
                                ? <Loader2 size={16} className="animate-spin" />
                                : <Trash2 size={16} />}
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
      {selectedFuncionario && (
        <EntityDetailsModal
          title={selectedFuncionario.funcionario}
          subtitle="Detalhes do funcionário"
          onClose={() => setSelectedFuncionario(null)}
          onEdit={() => navigate(`/funcionarios/editar/${selectedFuncionario.codFuncionario}`)}
          fields={[
            { label: 'Código', value: `#${selectedFuncionario.codFuncionario}` },
            { label: 'Cargo', value: cargosMap[selectedFuncionario.codCargo] || `#${selectedFuncionario.codCargo}` },
            { label: 'CPF', value: selectedFuncionario.cpf },
            { label: 'Nascimento', value: selectedFuncionario.data_nascimento },
            { label: 'Sexo', value: selectedFuncionario.sexo },
            { label: 'Telefone', value: selectedFuncionario.fone },
            { label: 'Endereço', value: selectedFuncionario.ender, fullWidth: true },
            { label: 'Número', value: selectedFuncionario.numero },
            { label: 'Complemento', value: selectedFuncionario.complemento },
            { label: 'Bairro', value: selectedFuncionario.bairro },
            { label: 'CEP', value: selectedFuncionario.cep },
            { label: 'Criado em', value: formatDate(selectedFuncionario.criado_em) },
            { label: 'Atualizado em', value: formatDate(selectedFuncionario.atualizado_em) },
          ]}
        />
      )}
    </AnimatedPage>
  );
}
