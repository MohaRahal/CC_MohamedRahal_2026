import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Loader2, Check } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { produtosService } from '../../services/produtosService';
import { marcasService } from '../../services/marcasService';
import { gruposService } from '../../services/gruposService';
import { unidadeMedidasService } from '../../services/unidadeMedidasService';

export default function EditProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Lists for dropdowns
  const [marcas, setMarcas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [unidades, setUnidades] = useState([]);

  // Main Form Data
  const [formData, setFormData] = useState({
    produto: '',
    codMarca: '',
    codGrupo: '',
    codUnidade: '',
    codigoBarras: '',
    undProd: '',
    pesoBruto: '',
    pesoLiq: '',
    saldoProd: '',
    precoVenda: '',
    precoCompra: '',
    custoMedioProd: ''
  });

  // Modal Marca state
  const [isMarcaModalOpen, setIsMarcaModalOpen] = useState(false);
  const [loadingMarca, setLoadingMarca] = useState(false);
  const [marcaName, setMarcaName] = useState('');

  // Modal Grupo state
  const [isGrupoModalOpen, setIsGrupoModalOpen] = useState(false);
  const [loadingGrupo, setLoadingGrupo] = useState(false);
  const [grupoName, setGrupoName] = useState('');

  // Modal Unidade state
  const [isUnidadeModalOpen, setIsUnidadeModalOpen] = useState(false);
  const [loadingUnidade, setLoadingUnidade] = useState(false);
  const [unidadeName, setUnidadeName] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [produtoData, marcasData, gruposData, unidadesData] = await Promise.all([
        produtosService.getProdutoById(id),
        marcasService.getMarcas(token).catch(() => []),
        gruposService.getGrupos(token).catch(() => []),
        unidadeMedidasService.getUnidades(token).catch(() => [])
      ]);

      setFormData({
        produto: produtoData.produto || '',
        codMarca: produtoData.codMarca?.toString() || '',
        codGrupo: produtoData.codGrupo?.toString() || '',
        codUnidade: produtoData.codUnidade?.toString() || '',
        codigoBarras: produtoData.codigoBarras || '',
        undProd: produtoData.undProd || '',
        pesoBruto: produtoData.pesoBruto || '',
        pesoLiq: produtoData.pesoLiq || '',
        saldoProd: produtoData.saldoProd || '',
        precoVenda: produtoData.precoVenda || '',
        precoCompra: produtoData.precoCompra || '',
        custoMedioProd: produtoData.custoMedioProd || ''
      });

      setMarcas(marcasData || []);
      setGrupos(gruposData || []);
      setUnidades(unidadesData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados do produto.");
      navigate('/Estoque');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const compraValue = formData.precoCompra ? parseFloat(formData.precoCompra) : 0;
      
      const payload = {
        produto: formData.produto,
        codMarca: formData.codMarca ? parseInt(formData.codMarca, 10) : null,
        codGrupo: formData.codGrupo ? parseInt(formData.codGrupo, 10) : null,
        codUnidade: formData.codUnidade ? parseInt(formData.codUnidade, 10) : null,
        codigoBarras: formData.codigoBarras || '',
        pesoBruto: formData.pesoBruto ? parseFloat(formData.pesoBruto) : null,
        pesoLiq: formData.pesoLiq ? parseFloat(formData.pesoLiq) : null,
        saldoProd: formData.saldoProd ? parseFloat(formData.saldoProd) : 0,
        precoVenda: formData.precoVenda ? parseFloat(formData.precoVenda) : 0,
        precoCompra: compraValue,
        custoMedioProd: formData.custoMedioProd ? parseFloat(formData.custoMedioProd) : compraValue
      };

      await produtosService.updateProduto(id, payload);
      navigate('/Estoque');
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar produto. Verifique se os dados estão preenchidos corretamente.");
    } finally {
      setLoading(false);
    }
  };

  // Handlers for Marca modal
  const handleCreateMarca = async (e) => {
    e.preventDefault();
    if (!marcaName.trim()) return;
    setLoadingMarca(true);
    try {
      const token = localStorage.getItem('token');
      const novaMarca = await marcasService.createMarca({ marca: marcaName });
      const data = await marcasService.getMarcas(token);
      setMarcas(data || []);
      if (novaMarca && novaMarca.codMarca) {
        setFormData(prev => ({ ...prev, codMarca: novaMarca.codMarca.toString() }));
      }
      setIsMarcaModalOpen(false);
      setMarcaName('');
    } catch (error) {
      console.error("Erro ao cadastrar marca:", error);
      alert("Erro ao cadastrar marca.");
    } finally {
      setLoadingMarca(false);
    }
  };

  // Handlers for Grupo modal
  const handleCreateGrupo = async (e) => {
    e.preventDefault();
    if (!grupoName.trim()) return;
    setLoadingGrupo(true);
    try {
      const token = localStorage.getItem('token');
      const novoGrupo = await gruposService.createGrupo({ grupo: grupoName });
      const data = await gruposService.getGrupos(token);
      setGrupos(data || []);
      if (novoGrupo && novoGrupo.codGrupo) {
        setFormData(prev => ({ ...prev, codGrupo: novoGrupo.codGrupo.toString() }));
      }
      setIsGrupoModalOpen(false);
      setGrupoName('');
    } catch (error) {
      console.error("Erro ao cadastrar grupo:", error);
      alert("Erro ao cadastrar grupo.");
    } finally {
      setLoadingGrupo(false);
    }
  };

  // Handlers for Unidade modal
  const handleCreateUnidade = async (e) => {
    e.preventDefault();
    if (!unidadeName.trim()) return;
    setLoadingUnidade(true);
    try {
      const token = localStorage.getItem('token');
      const novaUnidade = await unidadeMedidasService.createUnidade(token, { unidade: unidadeName });
      const data = await unidadeMedidasService.getUnidades(token);
      setUnidades(data || []);
      if (novaUnidade && novaUnidade.codUnidade) {
        setFormData(prev => ({ ...prev, codUnidade: novaUnidade.codUnidade.toString() }));
      }
      setIsUnidadeModalOpen(false);
      setUnidadeName('');
    } catch (error) {
      console.error("Erro ao cadastrar unidade:", error);
      alert("Erro ao cadastrar unidade.");
    } finally {
      setLoadingUnidade(false);
    }
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 flex justify-center items-center">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/Estoque"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Voltar para Estoque
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Editar Produto</h1>
            <p className="text-sm text-gray-500 mt-1">Atualize os dados do produto no estoque.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h2 className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Descrição do Produto <span className="text-red-500">*</span></label>
                <input 
                  name="produto" value={formData.produto} onChange={handleChange} required placeholder="Ex: Cimento CP II 50kg"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Código de Barras</label>
                <input 
                  name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} placeholder="Ex: 7891234567890"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              {/* Marca */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Marca <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select 
                    name="codMarca" value={formData.codMarca} onChange={handleChange} required
                    className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="">Selecione...</option>
                    {marcas.map(m => (
                      <option key={m.codMarca} value={m.codMarca}>{m.marca}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsMarcaModalOpen(true)}
                    className="px-3 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Grupo */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Grupo <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select 
                    name="codGrupo" value={formData.codGrupo} onChange={handleChange} required
                    className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="">Selecione...</option>
                    {grupos.map(g => (
                      <option key={g.codGrupo} value={g.codGrupo}>{g.grupo}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsGrupoModalOpen(true)}
                    className="px-3 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Unidade */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Unidade Medida <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select 
                    name="codUnidade" value={formData.codUnidade} onChange={handleChange} required
                    className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="">Selecione...</option>
                    {unidades.map(u => (
                      <option key={u.codUnidade} value={u.codUnidade}>{u.unidade}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsUnidadeModalOpen(true)}
                    className="px-3 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Peso Bruto (kg)</label>
                <input 
                  type="number" step="0.001" name="pesoBruto" value={formData.pesoBruto} onChange={handleChange} placeholder="0.000"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Peso Líquido (kg)</label>
                <input 
                  type="number" step="0.001" name="pesoLiq" value={formData.pesoLiq} onChange={handleChange} placeholder="0.000"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
            </div>

            <h2 className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2 mt-4">Preços e Estoque</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Preço de Compra (R$) <span className="text-red-500">*</span></label>
                <input 
                  type="number" step="0.01" name="precoCompra" value={formData.precoCompra} onChange={handleChange} required placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Preço de Venda (R$) <span className="text-red-500">*</span></label>
                <input 
                  type="number" step="0.01" name="precoVenda" value={formData.precoVenda} onChange={handleChange} required placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Custo Médio (R$)</label>
                <input 
                  type="number" step="0.01" name="custoMedioProd" value={formData.custoMedioProd} onChange={handleChange} placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Saldo Inicial</label>
                <input 
                  type="number" step="0.01" name="saldoProd" value={formData.saldoProd} onChange={handleChange} placeholder="0"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end border-t border-gray-100 pt-6">
              <Link
                to="/Estoque"
                className="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
              <button 
                type="submit" disabled={loading}
                className="cursor-pointer flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
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

      {/* Modal Nova Unidade */}
      {isUnidadeModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium text-gray-900">Nova Unidade</h2>
              <button onClick={() => setIsUnidadeModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUnidade} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Nome da Unidade <span className="text-red-500">*</span></label>
                <input 
                  value={unidadeName} onChange={(e) => setUnidadeName(e.target.value)} required placeholder="Ex: Unidade, Kilograma"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <div className="mt-4 flex justify-end gap-3 pt-2">
                <button 
                  type="button" onClick={() => setIsUnidadeModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" disabled={loadingUnidade}
                  className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Save size={16} /> {loadingUnidade ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
