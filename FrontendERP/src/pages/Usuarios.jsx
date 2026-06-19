import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit2, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import { usersService } from '../services/usersService';
import { cargosService } from '../services/cargosService';

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [cargos, setCargos] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsuarios();
    fetchCargos();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usersService.getUsers();
      setUsuarios(data || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCargos = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await cargosService.getCargos(token);
      // build a lookup map: { codCargo: nomeCargo }
      const map = {};
      (data || []).forEach(c => { map[c.codCargo] = c.cargo; });
      setCargos(map);
    } catch (error) {
      console.error("Erro ao carregar cargos:", error);
    }
  };

  const handleDeleteClick = async (id, nome) => {
    const confirmou = window.confirm(`Tem certeza que deseja excluir o usuário "${nome}"?`);
    if (confirmou) {
      try {
        setDeletingId(id);
        await usersService.deleteUser(id);
        setUsuarios(usuarios.filter(u => u.codUsuario !== id));
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Não foi possível excluir o usuário.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.usuario?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Usuários</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie os acessos, senhas e permissões da equipe</p>
            </div>
            <Link to="/Usuarios/AddUser" className="flex items-center gap-2 bg-ink-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md">
              <Plus size={16} />
              Novo Usuário
            </Link>
          </div>

          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por usuário..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
            />
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
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">ID</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Status</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Cadastrado em</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Atualizado em</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsuarios.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-16 text-center text-sm text-gray-500">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredUsuarios.map(usuario => (
                      <tr key={usuario.codUsuario} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-[13px] text-gray-400 font-mono">
                          #{usuario.codUsuario.toString().padStart(3, '0')}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium">
                          {usuario.usuario}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600">
                          {cargos[usuario.codCargo] ?? `#${usuario.codCargo}`}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600">
                          {usuario.codFuncionario}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            usuario.ativo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {usuario.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-500 text-right">
                          {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-500 text-right">
                          {new Date(usuario.atualizado_em).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => navigate(`/Usuarios/editar/${usuario.codUsuario}`)}
                              className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer" title="Editar">
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(usuario.codUsuario, usuario.usuario)}
                              disabled={deletingId === usuario.codUsuario}
                              className={`transition-colors cursor-pointer ${deletingId === usuario.codUsuario ? 'text-gray-300' : 'text-gray-400 hover:text-red-600'}`} 
                              title="Excluir">
                              {deletingId === usuario.codUsuario ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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
    </AnimatedPage>
  );
}
