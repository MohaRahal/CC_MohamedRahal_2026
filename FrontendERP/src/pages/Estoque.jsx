import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Loader2, X, Save, Eye, Edit,Trash } from 'lucide-react';
import AnimatedPage from './AnimatedPage';
import { produtosService } from '../services/produtosService';
import { marcasService } from '../services/marcasService';
import { gruposService } from '../services/gruposService';

export default function Estoque() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isMarcaModalOpen, setIsMarcaModalOpen] = useState(false);
  const [loadingMarca, setLoadingMarca] = useState(false);
  const [marcaName, setMarcaName] = useState('');

  const [isGrupoModalOpen, setIsGrupoModalOpen] = useState(false);
  const [loadingGrupo, setLoadingGrupo] = useState(false);
  const [grupoName, setGrupoName] = useState('');

  const [selectedProduto, setSelectedProduto] = useState(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const data = await produtosService.getProdutos();
      setProdutos(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMarca = async (e) => {
    e.preventDefault();
    if (!marcaName.trim()) return;
    setLoadingMarca(true);
    try {
      await marcasService.createMarca({ marca: marcaName });
      setIsMarcaModalOpen(false);
      setMarcaName('');
      alert("Marca criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar marca:", error);
      alert("Erro ao criar marca.");
    } finally {
      setLoadingMarca(false);
    }
  };

  const handleCreateGrupo = async (e) => {
    e.preventDefault();
    if (!grupoName.trim()) return;
    setLoadingGrupo(true);
    try {
      await gruposService.createGrupo({ grupo: grupoName });
      setIsGrupoModalOpen(false);
      setGrupoName('');
      alert("Grupo criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      alert("Erro ao criar grupo.");
    } finally {
      setLoadingGrupo(false);
    }
  };

  const filteredProdutos = produtos.filter(p => 
    p.produto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codProd?.toString().includes(searchTerm)
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Estoque</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie seus produtos e acompanhe os saldos</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
               
              <button 
                onClick={() => navigate('/Marcas')}
                className="cursor-pointer flex items-center gap-2 bg-white text-red px-5 py-2.5 text-sm rounded hover:bg-white-800 transition-colors shadow-sm font-medium"
              >
                <Plus size={16} /> Nova Marca
              </button>
              <button 
                onClick={() => navigate('/Grupos')}
                className="cursor-pointer flex items-center gap-2 bg-white text-green px-5 py-2.5 text-sm rounded hover:bg-white-800 transition-colors shadow-sm font-medium"
              >
                <Plus size={16} /> Novo Grupo
              </button>
              <button 
                onClick={() => navigate('/Estoque/novo')}
                className="cursor-pointer flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm font-medium"
              >
                <Plus size={16} /> Novo Produto
              </button>
            </div>
          </div>

          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou código..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
            />
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
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Cód</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider ">Produto</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Marca</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Grupo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Quantidade Atual</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-center w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProdutos.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-16 text-center text-sm text-gray-500">
                        Nenhum produto encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredProdutos.map(produto => (
                      <tr key={produto.codProd} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-sm text-gray-400 font-mono">
                          #{produto.codProd?.toString().padStart(4, '0')}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                          {produto.produto}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 text-right">
                          {produto.marca?.marca || '—'}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 text-right">
                          {produto.grupo?.grupo || '—'}
                        </td>
                        <td className="py-4 px-6 text-sm text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                            (produto.saldoProd || 0) > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {produto.saldoProd || 0}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedProduto(produto)}
                              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Ver detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => navigate(`/Estoque/editar/${produto.codProd}`)}
                              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Tem certeza que deseja deletar este produto?")) {
                                  produtosService.deleteProduto(produto.codProd).then(() => {
                                    fetchProdutos();
                                    alert("Produto deletado com sucesso!");
                                  }).catch(() => alert("Erro ao deletar produto."));
                                }
                              }}
                              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Excluir"
                            >
                              <Trash size={16} />
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

      {/* Modal Nova Marca */}
      {isMarcaModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium text-gray-900">Nova Marca</h2>
              <button onClick={() => setIsMarcaModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateMarca} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Nome da Marca <span className="text-red-500">*</span></label>
                <input 
                  value={marcaName} onChange={(e) => setMarcaName(e.target.value)} required placeholder="Ex: Coral, Tramontina"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <div className="mt-4 flex justify-end gap-3 pt-2">
                <button 
                  type="button" onClick={() => setIsMarcaModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" disabled={loadingMarca}
                  className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Save size={16} /> {loadingMarca ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Grupo */}
      {isGrupoModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium text-gray-900">Novo Grupo</h2>
              <button onClick={() => setIsGrupoModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateGrupo} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Nome do Grupo <span className="text-red-500">*</span></label>
                <input 
                  value={grupoName} onChange={(e) => setGrupoName(e.target.value)} required placeholder="Ex: Ferramentas, Elétrica"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <div className="mt-4 flex justify-end gap-3 pt-2">
                <button 
                  type="button" onClick={() => setIsGrupoModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" disabled={loadingGrupo}
                  className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Save size={16} /> {loadingGrupo ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Detalhes do Produto */}
      {selectedProduto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-mono mb-1">#{selectedProduto.codProd?.toString().padStart(4, '0')}</p>
                <h2 className="text-xl font-medium text-gray-900">{selectedProduto.produto}</h2>
              </div>
              <button onClick={() => setSelectedProduto(null)} className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors mt-1">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Preço de Compra</p>
                <p className="text-sm font-medium text-gray-800">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedProduto.precoCompra || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Preço de Venda</p>
                <p className="text-sm font-medium text-gray-800">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedProduto.precoVenda || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Custo Médio</p>
                <p className="text-sm font-medium text-gray-800">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedProduto.custoMedioProd || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Saldo em Estoque</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                  (selectedProduto.saldoProd || 0) > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                }`}>
                  {selectedProduto.saldoProd || 0} {selectedProduto.unidade?.unidade || 'un'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Unidade</p>
                <p className="text-sm font-medium text-gray-800">{selectedProduto.unidade?.unidade || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cód. Barras</p>
                <p className="text-sm font-mono text-gray-800">{selectedProduto.codigoBarras || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Peso Bruto</p>
                <p className="text-sm font-medium text-gray-800">{selectedProduto.pesoBruto != null ? `${selectedProduto.pesoBruto} kg` : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Peso Líquido</p>
                <p className="text-sm font-medium text-gray-800">{selectedProduto.pesoLiq != null ? `${selectedProduto.pesoLiq} kg` : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Marca</p>
                <p className="text-sm font-medium text-gray-800">{selectedProduto.marca?.marca || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Grupo</p>
                <p className="text-sm font-medium text-gray-800">{selectedProduto.grupo?.grupo || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cadastrado por</p>
                <p className="text-sm font-medium text-gray-800">{selectedProduto.usuario?.usuario || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cadastrado em</p>
                <p className="text-sm font-medium text-gray-800">
                  {selectedProduto.criado_em ? new Date(selectedProduto.criado_em).toLocaleDateString('pt-BR') : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}

