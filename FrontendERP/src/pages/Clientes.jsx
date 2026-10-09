import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import EntityDetailsModal from '../components/EntityDetailsModal';
import { clientesService } from '../services/clientesService';
import { confirmAction } from '../components/feedback';

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);

  useEffect(() => {
    let isActive = true;

    const loadClientes = async () => {
      try {
        const data = await clientesService.getClientes();
        if (isActive) setClientes(data || []);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadClientes();
    return () => { isActive = false; };
  }, []);

  const handleDelete = async (id) => {
    if (await confirmAction("Tem certeza que deseja excluir este cliente?")) {
      try {
        await clientesService.deleteCliente(id);
        setClientes((atuais) => atuais.filter(c => c.codCliente !== id));
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
    c.cpf_cnpj?.includes(searchTerm) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-2 sm:px-4 text-gray-800 font-sans">
        <div className="w-full">

          <div className="mb-8 flex justify-end">
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
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cliente</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tipo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">CPF/CNPJ</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-16 text-center text-sm text-gray-500">
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(c => (
                      <tr key={c.codCliente} onClick={() => setSelectedCliente(c)} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
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
                        <td className="py-4 px-6 text-[13px] whitespace-nowrap">
                          <div className="flex gap-2">
                            <Link
                              to={`/Clientes/editar/${c.codCliente}`}
                              onClick={(event) => event.stopPropagation()}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={(event) => { event.stopPropagation(); handleDelete(c.codCliente); }}
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

      {selectedCliente && (
        <EntityDetailsModal
          title={selectedCliente.cliente}
          subtitle="Detalhes do cliente"
          onClose={() => setSelectedCliente(null)}
          onEdit={() => navigate(`/Clientes/editar/${selectedCliente.codCliente}`)}
          fields={[
            { label: 'Código', value: `#${selectedCliente.codCliente?.toString().padStart(4, '0')}` },
            { label: 'Tipo de pessoa', value: selectedCliente.tipoPessoa },
            { label: 'CPF / CNPJ', value: selectedCliente.cpf_cnpj },
            { label: 'Telefone', value: selectedCliente.fone },
            { label: 'E-mail', value: selectedCliente.email, fullWidth: true },
            { label: 'Endereço', value: selectedCliente.ender, fullWidth: true },
            { label: 'Número', value: selectedCliente.numero },
            { label: 'Complemento', value: selectedCliente.complemento },
            { label: 'Bairro', value: selectedCliente.bairro },
            { label: 'Cidade', value: selectedCliente.cidade?.cidade },
            { label: 'Condição de pagamento', value: selectedCliente.condicaoPagamento?.condPagamento },
            { label: 'Limite de crédito', value: formatCurrency(selectedCliente.limiteCredito) },
            { label: 'Cadastrado por', value: selectedCliente.usuario?.usuario },
            { label: 'Cadastrado em', value: formatDate(selectedCliente.criado_em) },
            { label: 'Atualizado em', value: formatDate(selectedCliente.atualizado_em), fullWidth: true },
          ]}
        />
      )}
    </AnimatedPage>
  );
}
