import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit, Trash2,Truck,ExternalLink,Eye,X } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import { transportadoresService } from '../services/transportadoresService';

export default function Transportadores() {
  const [transportadores, setTransportadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);
  const [selectedTransp, setSelectedTransp] = useState(null);

  useEffect(() => {
    fetchTransportadores();
  }, []);

  const fetchTransportadores = async () => {
    try {
      setLoading(true);
      const data = await transportadoresService.getTransportadores();
      setTransportadores(data || []);
    } catch (error) {
      console.error("Erro ao carregar transportadores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este transportador?")) {
      try {
        await transportadoresService.deleteTransportador(id);
        setTransportadores(transportadores.filter(t => t.codTrans !== id));
      } catch (error) {
        console.error("Erro ao excluir transportador:", error);
        alert("Erro ao excluir transportador.");
      }
    }
  };
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

  const filtered = transportadores.filter(t =>
    t.transportador?.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-2 sm:px-4 text-gray-800 font-sans">
        <div className="w-full max-w-full mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Transportadores</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie seus transportadores</p>
            </div>
            <div className="flex gap-2">
              <Link to="/Transportadores/novo" className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm">
                <Plus size={16} />
                Novo Transportador
              </Link>
            </div>
          </div>

          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type="text"
              placeholder="Buscar por razão social ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm "
            />
          </div>

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
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Transportador</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nome Fantasia</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">CPF/CNPJ</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tipo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Insc. Estd Transp</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ativo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Usuario</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Criado em</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Atualizado em</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="21" className="py-16 text-center text-sm text-gray-500">
                        Nenhum transportador encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(f => (
                      <tr key={f.codTransp} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-[13px] text-gray-400 font-mono">
                          #{f.codTransp}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.transportador}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.apelido_NomeFantasia}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.cpf_cnpjTransp}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.tipoPessoa}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.inscEstTransp}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            f.ativo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {f.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                         <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.usuario?.usuario || '-'}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {formatDate(f.criado_em)}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {formatDate(f.atualizado_em)}
                        </td>
                        <td className="py-4 px-6 text-[13px] whitespace-nowrap">
                          <div className="flex gap-2">
                            <Link to={`/Transportadores/editar/${f.codTransp}`} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                              <Edit size={16} />
                            </Link>
                            <button onClick={() => handleDelete(f.codTransp)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTransp(f);
                                setIsDetalhesOpen(true);
                              }}
                              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Eye size={16} />
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
      {selectedTransp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-mono mb-1">#{selectedTransp.codTransp?.toString().padStart(4, '0')}</p>
                <h2 className="text-xl font-medium text-gray-900">{selectedTransp.transportador}</h2>
              </div>
              <button onClick={() => setSelectedTransp(null)} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors mt-1">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Endereço</p>
                <p className="text-sm font-medium text-gray-800">
                  {selectedTransp.ender}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Número</p>
                <p className="text-sm font-medium text-gray-800">
                  {selectedTransp.numero}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Complemento</p>
                <p className="text-sm font-medium text-gray-800">
                  {selectedTransp.complemento}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bairro</p>
                <p className="text-sm font-medium text-gray-800">
                  {selectedTransp.bairro}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ativo</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                  selectedTransp.ativo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                }`}>
                  {selectedTransp.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cep</p>
                <p className="text-sm font-medium text-gray-800">{selectedTransp.cep || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cidade</p>
                <p className="text-sm font-mono text-gray-800">{selectedTransp.cidade.cidade || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Telefone</p>
                <p className="text-sm font-medium text-gray-800">{selectedTransp.fone != null ? `${selectedTransp.fone}` : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm font-medium text-gray-800">{selectedTransp.email != null ? `${selectedTransp.email}` : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Site</p>
                <p className="text-sm font-medium text-gray-800">{selectedTransp.site != null ? `${selectedTransp.site}` : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Inscrição Estadual</p>
                <p className="text-sm font-medium text-gray-800">{selectedTransp.inscEstTransp != null ? `${selectedTransp.inscEstTransp}` : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cadastrado por</p>
                <p className="text-sm font-medium text-gray-800">{selectedTransp.usuario?.usuario || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cadastrado em</p>
                <p className="text-sm font-medium text-gray-800">
                  {selectedTransp.criado_em ? new Date(selectedTransp.criado_em).toLocaleDateString('pt-BR') : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
