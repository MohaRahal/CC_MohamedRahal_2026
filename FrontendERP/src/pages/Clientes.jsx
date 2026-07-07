import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit, Trash2, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import { clientesService } from '../services/clientesService';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesService.getClientes();
      setClientes(data || []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await clientesService.deleteCliente(id);
        setClientes(clientes.filter(c => c.codCliente !== id));
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        alert("Erro ao excluir cliente.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  const filtered = clientes.filter(c =>
    c.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.CpfCnpj?.includes(searchTerm) ||
    c.Email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-2 sm:px-4 text-gray-800 font-sans">
        <div className="w-full max-w-full mx-auto">

          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Clientes</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie seus clientes e histórico comercial</p>
            </div>
            <Link
              to="/Clientes/novo"
              className="cursor-pointer flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Plus size={16} /> Novo Cliente
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF/CNPJ ou email..."
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
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cliente</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tipo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">CPF/CNPJ</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Telefone</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cidade</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cond. Pagamento</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Lim. Crédito</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cadastrado em</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="py-16 text-center text-sm text-gray-500">
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(c => (
                      <tr key={c.codCliente} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-[13px] text-gray-400 font-mono">
                          #{c.codCliente?.toString().padStart(4, '0')}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {c.cliente}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600 whitespace-nowrap">
                          {c.tipoPessoa}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600 whitespace-nowrap font-mono">
                          {c.cpf_cnpj || '—'}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600 whitespace-nowrap">
                          {c.fone }
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600 whitespace-nowrap">
                          {c.email || '—'}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600 whitespace-nowrap">
                          {c.cidade.cidade}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600 whitespace-nowrap">
                          {c.condicaoPagamento?.condPagamento}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600 whitespace-nowrap font-mono">
                          {formatCurrency(c.limiteCredito)}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-600 whitespace-nowrap">
                          {formatDate(c.criado_em)}
                        </td>
                        <td className="py-4 px-6 text-[13px] whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedCliente(c)}
                              className="cursor-pointer p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                              title="Visualizar detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            <Link
                              to={`/Clientes/editar/${c.codCliente}`}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(c.codCliente)}
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
      {selectedCliente && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ minHeight: '100vh' }}>
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 sticky top-0">
              <div>
                <p className="text-xs text-gray-400 font-mono mb-1">#{selectedCliente.codCliente?.toString().padStart(4, '0')}</p>
                <h3 className="text-xl font-medium text-gray-900">{selectedCliente.cliente}</h3>
              </div>
              <button
                onClick={() => setSelectedCliente(null)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1.5 rounded transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Dados Pessoais */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Dados Pessoais</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {[
                    { label: 'Tipo', value: selectedCliente.tipoPessoa},
                    { label: 'CPF/CNPJ', value: selectedCliente.cpf_cnpj },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-gray-500 text-xs font-medium mb-1">{label}</div>
                      <div className="text-gray-800 font-medium break-words">{value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Contato</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {[
                    { label: 'Telefone', value: selectedCliente.fone },
                    { label: 'Email', value: selectedCliente.email },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-gray-500 text-xs font-medium mb-1">{label}</div>
                      <div className="text-gray-800 break-words">{value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Endereço</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {[
                    { label: 'Logradouro', value: selectedCliente.ender },
                    { label: 'Número', value: selectedCliente.numero },
                    { label: 'Complemento', value: selectedCliente.complemento },
                    { label: 'Bairro', value: selectedCliente.bairro },
                    { label: 'Cidade', value: selectedCliente.cidade?.cidade },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-gray-500 text-xs font-medium mb-1">{label}</div>
                      <div className="text-gray-800 break-words">{value || 'n/a'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financeiro */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Financeiro</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 text-xs font-medium mb-1">Condição de Pagamento</div>
                    <div className="text-gray-800 break-words">{selectedCliente.condicaoPagamento?.condPagamento || '—'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 text-xs font-medium mb-1">Limite de Crédito</div>
                    <div className="text-gray-800 font-semibold break-words">{formatCurrency(selectedCliente.limiteCredito)}</div>
                  </div>
                </div>
              </div>

              {/* Sistema */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Sistema</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {[
                    { label: 'Usuário', value: selectedCliente.usuario?.usuario },
                    { label: 'Cadastrado em', value: formatDate(selectedCliente.criado_em) },
                    { label: 'Atualizado em', value: formatDate(selectedCliente.atualizado_em) },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-gray-500 text-xs font-medium mb-1">{label}</div>
                      <div className="text-gray-800 break-words">{value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end px-6 py-6 border-t border-gray-100 bg-gray-50/50 sticky bottom-0">
              <button
                onClick={() => setSelectedCliente(null)}
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
