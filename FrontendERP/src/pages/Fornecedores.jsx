import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit, Trash2,Eye,X } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import { fornecedoresService } from '../services/fornecedoresService';

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);
  const [selectedForn, setSelectedForn] = useState(null);

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const data = await fornecedoresService.getFornecedores();
      setFornecedores(data || []);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este fornecedor?")) {
      try {
        await fornecedoresService.deleteFornecedor(id);
        setFornecedores(fornecedores.filter(f => f.codForn !== id));
      } catch (error) {
        console.error("Erro ao excluir fornecedor:", error);
        alert("Erro ao excluir fornecedor.");
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

  const filtered = fornecedores.filter(f =>
    f.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.cpf_cnpj?.includes(searchTerm) ||
    f.apelido_NomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-2 sm:px-4 text-gray-800 font-sans">
        <div className="w-full max-w-full mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Fornecedores</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie seus parceiros e fornecedores de produtos</p>
            </div>
            <Link to="/Fornecedores/novo" className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm">
              <Plus size={16} />
              Novo Fornecedor
            </Link>
          </div>

          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por razão social ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
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
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Fornecedor</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nome Fantasia</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Fone</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cond. Pagamento</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Lim. Crédito</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">RG/Insc. Estadual</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tipo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">CPF/CNPJ</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Atualizado em</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="21" className="py-16 text-center text-sm text-gray-500">
                        Nenhum fornecedor encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(f => (
                      <tr key={f.codForn} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-[13px] text-gray-400 font-mono">
                          #{f.codForn}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.fornecedor}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.apelido_NomeFantasia}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.fone}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.email}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.condicaoPagamento.condPagamento}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          R$ {f.limiteCredito}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.rg_inscEst}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.tipoPessoa}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.cpf_cnpj}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {formatDate(f.atualizado_em)}
                        </td>
                        <td className="py-4 px-6 text-[13px] whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedForn(f);
                                setIsDetalhesOpen(true);
                              }}
                              className="cursor-pointer p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                              title="Visualizar detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            <Link to={`/Fornecedores/editar/${f.codForn}`} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors">
                              <Edit size={16} />
                            </Link>
                            <button onClick={() => handleDelete(f.codForn)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
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
      {isDetalhesOpen && selectedForn && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-light text-gray-800 flex items-center gap-3">
                <Eye size={20} className="text-gray-600" />
                Detalhes do Fornecedor
              </h3>
              <button
                onClick={() => setIsDetalhesOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-8">
              {/* Dados Principais */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Dados Principais</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Código:</div>
                    <div className="text-gray-800 font-mono font-bold">#{selectedForn.codForn}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Fornecedor:</div>
                    <div className="text-gray-800 font-medium truncate">{selectedForn.fornecedor}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Nome Fantasia:</div>
                    <div className="text-gray-800 font-medium truncate">{selectedForn.apelido_NomeFantasia}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Tipo:</div>
                    <div className="text-gray-800 font-medium">
                      {selectedForn.tipoPessoa === 'J' ? 'Jurídica' : 'Física'}
                      {selectedForn.tipoPessoa === 'J' ? ` (${selectedForn.cpf_cnpj})` : ` (${selectedForn.cpf_cnpj})`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Contato</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Telefone:</div>
                    <div className="text-gray-800">{selectedForn.fone}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Email:</div>
                    <div className="text-gray-800 break-all">{selectedForn.email}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded sm:col-span-2">
                    <div className="w-32 text-gray-500 text-sm font-medium">Site:</div>
                    <div className="text-gray-800 break-all">{selectedForn.site}</div>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Endereço</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Logradouro:</div>
                    <div className="text-gray-800">{selectedForn.ender}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Número:</div>
                    <div className="text-gray-800">{selectedForn.numero}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Complemento:</div>
                    <div className="text-gray-800">{selectedForn.complemento}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Bairro:</div>
                    <div className="text-gray-800">{selectedForn.bairro}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">CEP:</div>
                    <div className="text-gray-800">{selectedForn.cep}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Cidade:</div>
                    <div className="text-gray-800 font-medium truncate">{selectedForn.cidade?.cidade}</div>
                  </div>
                </div>
              </div>

              {/* Financeiro */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Financeiro</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Cond. Pagamento:</div>
                    <div className="text-gray-800 font-medium truncate">{selectedForn.condicaoPagamento?.condPagamento}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Limite de Crédito:</div>
                    <div className="text-gray-800 font-bold">
                      {selectedForn.limiteCredito?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Sistema */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Informações do Sistema</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Usuário:</div>
                    <div className="text-gray-800 font-medium truncate">{selectedForn.usuario?.usuario}</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Data de Cadastro:</div>
                    <div className="text-gray-800">
                      {selectedForn.criado_em ? new Date(selectedForn.criado_em).toLocaleDateString('pt-BR') : 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-32 text-gray-500 text-sm font-medium">Última Atualização:</div>
                    <div className="text-gray-800">
                      {selectedForn.atualizado_em ? new Date(selectedForn.atualizado_em).toLocaleDateString('pt-BR') : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
