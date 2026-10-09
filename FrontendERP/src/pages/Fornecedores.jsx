import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import EntityDetailsModal from '../components/EntityDetailsModal';
import { fornecedoresService } from '../services/fornecedoresService';
import { confirmAction } from '../components/feedback';

export default function Fornecedores() {
  const navigate = useNavigate();
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedForn, setSelectedForn] = useState(null);

  useEffect(() => {
    // Initial request only; the loader is also reused after mutations.
    // eslint-disable-next-line react-hooks/immutability
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
    if (await confirmAction("Tem certeza que deseja excluir este fornecedor?")) {
      try {
        await fornecedoresService.deleteFornecedor(id);
        setFornecedores((atuais) => atuais.filter(f => f.codForn !== id));
      } catch (error) {
        console.error("Erro ao excluir fornecedor:", error);
        alert("Erro ao excluir fornecedor.");
      }
    }
  };
  const filtered = fornecedores.filter(f =>
    f.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.cpf_cnpj?.includes(searchTerm) ||
    f.apelido_NomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-2 sm:px-4 text-gray-800 font-sans">
        <div className="w-full">
          
          <div className="mb-8 flex justify-end">
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
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Fornecedor</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nome Fantasia</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tipo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">CPF/CNPJ</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-16 text-center text-sm text-gray-500">
                        Nenhum fornecedor encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(f => (
                      <tr key={f.codForn} onClick={() => setSelectedForn(f)} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
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
                          {f.tipoPessoa}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.cpf_cnpj}
                        </td>
                        <td className="py-4 px-6 text-[13px] whitespace-nowrap">
                          <div className="flex gap-2">
                            <Link to={`/Fornecedores/editar/${f.codForn}`} onClick={(event) => event.stopPropagation()} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors">
                              <Edit size={16} />
                            </Link>
                            <button onClick={(event) => { event.stopPropagation(); handleDelete(f.codForn); }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
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

      {selectedForn && (
        <EntityDetailsModal
          title={selectedForn.fornecedor}
          subtitle="Detalhes do fornecedor"
          onClose={() => setSelectedForn(null)}
          onEdit={() => navigate(`/Fornecedores/editar/${selectedForn.codForn}`)}
          fields={[
            { label: 'Código', value: `#${selectedForn.codForn}` },
            { label: 'Nome fantasia', value: selectedForn.apelido_NomeFantasia },
            { label: 'Tipo de pessoa', value: selectedForn.tipoPessoa === 'J' ? 'Jurídica' : 'Física' },
            { label: 'CPF / CNPJ', value: selectedForn.cpf_cnpj },
            { label: 'Telefone', value: selectedForn.fone },
            { label: 'E-mail', value: selectedForn.email },
            { label: 'Site', value: selectedForn.site, fullWidth: true },
            { label: 'Endereço', value: selectedForn.ender, fullWidth: true },
            { label: 'Número', value: selectedForn.numero },
            { label: 'Complemento', value: selectedForn.complemento },
            { label: 'Bairro', value: selectedForn.bairro },
            { label: 'CEP', value: selectedForn.cep },
            { label: 'Cidade', value: selectedForn.cidade?.cidade },
            { label: 'Condição de pagamento', value: selectedForn.condicaoPagamento?.condPagamento },
            { label: 'Limite de crédito', value: selectedForn.limiteCredito?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
            { label: 'Cadastrado por', value: selectedForn.usuario?.usuario },
            { label: 'Cadastrado em', value: selectedForn.criado_em ? new Date(selectedForn.criado_em).toLocaleDateString('pt-BR') : null },
            { label: 'Atualizado em', value: selectedForn.atualizado_em ? new Date(selectedForn.atualizado_em).toLocaleDateString('pt-BR') : null, fullWidth: true },
          ]}
        />
      )}
    </AnimatedPage>
  );
}
