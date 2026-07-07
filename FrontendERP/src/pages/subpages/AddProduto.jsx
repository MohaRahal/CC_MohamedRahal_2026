import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Edit2, Search, Check } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { produtosService } from '../../services/produtosService';
import { marcasService } from '../../services/marcasService';
import { gruposService } from '../../services/gruposService';
import { unidadeMedidasService } from '../../services/unidadeMedidasService';

export default function AddProduto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Lists for dropdowns
  const [marcas, setMarcas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [unidades, setUnidades] = useState([]);

  // Main Form Data
  const [formData, setFormData] = useState({
    produto: '', codMarca: '', codGrupo: '', codUnidade: '',
    codigoBarras: '', undProd: '', pesoBruto: '', pesoLiq: '',
    saldoProd: '', precoVenda: '', precoCompra: '', custoMedioProd: ''
  });

  // --- MARCA MANAGER ---
  const [isMarcaSelectorOpen, setIsMarcaSelectorOpen] = useState(false);
  const [marcaModalMode, setMarcaModalMode] = useState('list');
  const [editingMarcaId, setEditingMarcaId] = useState(null);
  const [marcaSearchTerm, setMarcaSearchTerm] = useState('');
  const [loadingMarca, setLoadingMarca] = useState(false);
  const [marcaData, setMarcaData] = useState({ marca: '' });

  // --- GRUPO MANAGER ---
  const [isGrupoSelectorOpen, setIsGrupoSelectorOpen] = useState(false);
  const [grupoModalMode, setGrupoModalMode] = useState('list');
  const [editingGrupoId, setEditingGrupoId] = useState(null);
  const [grupoSearchTerm, setGrupoSearchTerm] = useState('');
  const [loadingGrupo, setLoadingGrupo] = useState(false);
  const [grupoData, setGrupoData] = useState({ grupo: '' });

  // --- UNIDADE MANAGER ---
  const [isUnidadeSelectorOpen, setIsUnidadeSelectorOpen] = useState(false);
  const [unidadeModalMode, setUnidadeModalMode] = useState('list');
  const [editingUnidadeId, setEditingUnidadeId] = useState(null);
  const [unidadeSearchTerm, setUnidadeSearchTerm] = useState('');
  const [loadingUnidade, setLoadingUnidade] = useState(false);
  const [unidadeData, setUnidadeData] = useState({ unidade: '' });

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const token = localStorage.getItem('token');
      const [marcasData, gruposData, unidadesData] = await Promise.all([
        marcasService.getMarcas(token).catch(() => []),
        gruposService.getGrupos(token).catch(() => []),
        unidadeMedidasService.getUnidades(token).catch(() => [])
      ]);
      setMarcas(marcasData || []);
      setGrupos(gruposData || []);
      setUnidades(unidadesData || []);
    } catch (error) {
      console.error("Erro ao carregar dados do formulário:", error);
    }
  };

  const loadMarcas = async () => {
    const token = localStorage.getItem('token');
    const data = await marcasService.getMarcas(token).catch(() => []);
    setMarcas(data || []);
  };
  const loadGrupos = async () => {
    const token = localStorage.getItem('token');
    const data = await gruposService.getGrupos(token).catch(() => []);
    setGrupos(data || []);
  };
  const loadUnidades = async () => {
    const token = localStorage.getItem('token');
    const data = await unidadeMedidasService.getUnidades(token).catch(() => []);
    setUnidades(data || []);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      await produtosService.createProduto(payload);
      navigate('/Estoque');
    } catch (error) {
      alert("Erro ao cadastrar produto. Verifique se os dados estão preenchidos corretamente.");
    } finally { setLoading(false); }
  };

  // --- MARCA ACTIONS ---
  const handleOpenMarcaSelector = () => { loadMarcas(); setMarcaSearchTerm(''); setMarcaModalMode('list'); setIsMarcaSelectorOpen(true); };
  const handleOpenCreateMarca = () => { setMarcaData({ marca: '' }); setMarcaModalMode('create'); };
  const handleOpenEditMarca = (m) => { setMarcaData({ marca: m.marca || '' }); setEditingMarcaId(m.codMarca); setMarcaModalMode('edit'); };
  const handleSelectMarca = (id) => { setFormData({ ...formData, codMarca: id.toString() }); setIsMarcaSelectorOpen(false); };
  const handleMarcaSubmit = async (e) => {
    e.preventDefault(); setLoadingMarca(true);
    try {
      if (marcaModalMode === 'create') {
        const res = await marcasService.createMarca({ marca: marcaData.marca });
        await loadMarcas();
        if (res && res.codMarca) setFormData({ ...formData, codMarca: res.codMarca.toString() });
        setIsMarcaSelectorOpen(false);
      } else {
        await marcasService.updateMarca(editingMarcaId, { marca: marcaData.marca });
        await loadMarcas();
        setMarcaModalMode('list');
      }
    } catch (e) { alert("Erro ao salvar marca."); } finally { setLoadingMarca(false); }
  };

  // --- GRUPO ACTIONS ---
  const handleOpenGrupoSelector = () => { loadGrupos(); setGrupoSearchTerm(''); setGrupoModalMode('list'); setIsGrupoSelectorOpen(true); };
  const handleOpenCreateGrupo = () => { setGrupoData({ grupo: '' }); setGrupoModalMode('create'); };
  const handleOpenEditGrupo = (g) => { setGrupoData({ grupo: g.grupo || '' }); setEditingGrupoId(g.codGrupo); setGrupoModalMode('edit'); };
  const handleSelectGrupo = (id) => { setFormData({ ...formData, codGrupo: id.toString() }); setIsGrupoSelectorOpen(false); };
  const handleGrupoSubmit = async (e) => {
    e.preventDefault(); setLoadingGrupo(true);
    try {
      if (grupoModalMode === 'create') {
        const res = await gruposService.createGrupo({ grupo: grupoData.grupo });
        await loadGrupos();
        if (res && res.codGrupo) setFormData({ ...formData, codGrupo: res.codGrupo.toString() });
        setIsGrupoSelectorOpen(false);
      } else {
        await gruposService.updateGrupo(editingGrupoId, { grupo: grupoData.grupo });
        await loadGrupos();
        setGrupoModalMode('list');
      }
    } catch (e) { alert("Erro ao salvar grupo."); } finally { setLoadingGrupo(false); }
  };

  // --- UNIDADE ACTIONS ---
  const handleOpenUnidadeSelector = () => { loadUnidades(); setUnidadeSearchTerm(''); setUnidadeModalMode('list'); setIsUnidadeSelectorOpen(true); };
  const handleOpenCreateUnidade = () => { setUnidadeData({ unidade: '' }); setUnidadeModalMode('create'); };
  const handleOpenEditUnidade = (u) => { setUnidadeData({ unidade: u.unidade || '' }); setEditingUnidadeId(u.codUnidade); setUnidadeModalMode('edit'); };
  const handleSelectUnidade = (id) => { setFormData({ ...formData, codUnidade: id.toString() }); setIsUnidadeSelectorOpen(false); };
  const handleUnidadeSubmit = async (e) => {
    e.preventDefault(); setLoadingUnidade(true);
    try {
      const token = localStorage.getItem('token');
      if (unidadeModalMode === 'create') {
        const res = await unidadeMedidasService.createUnidade(token, { unidade: unidadeData.unidade });
        await loadUnidades();
        if (res && res.codUnidade) setFormData({ ...formData, codUnidade: res.codUnidade.toString() });
        setIsUnidadeSelectorOpen(false);
      } else {
        await unidadeMedidasService.updateUnidade(token, editingUnidadeId, { unidade: unidadeData.unidade });
        await loadUnidades();
        setUnidadeModalMode('list');
      }
    } catch (e) { alert("Erro ao salvar unidade."); } finally { setLoadingUnidade(false); }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/Estoque')} className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6 cursor-pointer">
            <ArrowLeft size={16} /> Voltar para Estoque
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Novo Produto</h1>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo para cadastrar um novo produto no estoque.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <h2 className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Descrição do Produto <span className="text-red-500">*</span></label>
                <input name="produto" value={formData.produto} onChange={handleChange} required placeholder="Ex: Cimento CP II 50kg"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Código de Barras</label>
                <input name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} placeholder="Ex: 7891234567890"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              {/* Marca */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Marca <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select name="codMarca" value={formData.codMarca} onChange={handleChange} required
                    className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all">
                    <option value="">Selecione...</option>
                    {marcas.map(m => <option key={m.codMarca} value={m.codMarca}>{m.marca}</option>)}
                  </select>
                  <button type="button" onClick={handleOpenMarcaSelector} className="px-3 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors" title="Selecionar/Gerenciar Marcas">
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Grupo */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Grupo <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select name="codGrupo" value={formData.codGrupo} onChange={handleChange} required
                    className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all">
                    <option value="">Selecione...</option>
                    {grupos.map(g => <option key={g.codGrupo} value={g.codGrupo}>{g.grupo}</option>)}
                  </select>
                  <button type="button" onClick={handleOpenGrupoSelector} className="px-3 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors" title="Selecionar/Gerenciar Grupos">
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Unidade */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Unidade Medida <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select name="codUnidade" value={formData.codUnidade} onChange={handleChange} required
                    className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all">
                    <option value="">Selecione...</option>
                    {unidades.map(u => <option key={u.codUnidade} value={u.codUnidade}>{u.unidade}</option>)}
                  </select>
                  <button type="button" onClick={handleOpenUnidadeSelector} className="px-3 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors" title="Selecionar/Gerenciar Unidades">
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Peso Bruto (kg)</label>
                <input type="number" step="0.001" name="pesoBruto" value={formData.pesoBruto} onChange={handleChange} placeholder="0.000"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Peso Líquido (kg)</label>
                <input type="number" step="0.001" name="pesoLiq" value={formData.pesoLiq} onChange={handleChange} placeholder="0.000"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
            </div>

            <h2 className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2 mt-4">Preços e Estoque</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Preço de Compra (R$) <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" name="precoCompra" value={formData.precoCompra} onChange={handleChange} required placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Preço de Venda (R$) <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" name="precoVenda" value={formData.precoVenda} onChange={handleChange} required placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Custo Médio (R$)</label>
                <input type="number" step="0.01" name="custoMedioProd" value={formData.custoMedioProd} onChange={handleChange} placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Saldo Inicial</label>
                <input type="number" step="0.01" name="saldoProd" value={formData.saldoProd} onChange={handleChange} placeholder="0"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-gray-100 pt-6">
              <button type="submit" disabled={loading} className="cursor-pointer flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-gray-800 transition-all shadow-md disabled:opacity-50">
                <Save size={16} /> {loading ? 'Salvando...' : 'Salvar Produto'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- MODAL MARCA --- */}
      {isMarcaSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-medium text-gray-900">
                {marcaModalMode === 'list' && 'Marcas Cadastradas'}
                {marcaModalMode === 'create' && 'Nova Marca'}
                {marcaModalMode === 'edit' && 'Editar Marca'}
              </h2>
              <button onClick={() => marcaModalMode === 'list' ? setIsMarcaSelectorOpen(false) : setMarcaModalMode('list')} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {marcaModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={marcaSearchTerm} onChange={(e) => setMarcaSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
                  <button type="button" onClick={handleOpenCreateMarca} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    <Plus size={16} /> Nova
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                  {marcas.filter(m => m.marca?.toLowerCase().includes(marcaSearchTerm.toLowerCase())).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">Nenhuma marca encontrada.</div>
                  ) : (
                    marcas.filter(m => m.marca?.toLowerCase().includes(marcaSearchTerm.toLowerCase())).map(m => (
                      <div key={m.codMarca} className="py-3 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                        <div className="font-medium text-sm text-gray-900">{m.marca}</div>
                        <div className="flex gap-2 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleOpenEditMarca(m)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all">
                            <Edit2 size={15} />
                          </button>
                          <button type="button" onClick={() => handleSelectMarca(m.codMarca)} className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium">
                            <Check size={14} /> Selecionar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {(marcaModalMode === 'create' || marcaModalMode === 'edit') && (
              <form onSubmit={handleMarcaSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome da Marca <span className="text-red-500">*</span></label>
                  <input name="marca" value={marcaData.marca} onChange={(e) => setMarcaData({...marcaData, marca: e.target.value})} required placeholder="Ex: Coral, Tramontina"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button type="button" onClick={() => setMarcaModalMode('list')} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Voltar</button>
                  <button type="submit" disabled={loadingMarca} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                    <Save size={16} /> {loadingMarca ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL GRUPO --- */}
      {isGrupoSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-medium text-gray-900">
                {grupoModalMode === 'list' && 'Grupos Cadastrados'}
                {grupoModalMode === 'create' && 'Novo Grupo'}
                {grupoModalMode === 'edit' && 'Editar Grupo'}
              </h2>
              <button onClick={() => grupoModalMode === 'list' ? setIsGrupoSelectorOpen(false) : setGrupoModalMode('list')} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {grupoModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={grupoSearchTerm} onChange={(e) => setGrupoSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
                  <button type="button" onClick={handleOpenCreateGrupo} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    <Plus size={16} /> Novo
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                  {grupos.filter(g => g.grupo?.toLowerCase().includes(grupoSearchTerm.toLowerCase())).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">Nenhum grupo encontrado.</div>
                  ) : (
                    grupos.filter(g => g.grupo?.toLowerCase().includes(grupoSearchTerm.toLowerCase())).map(g => (
                      <div key={g.codGrupo} className="py-3 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                        <div className="font-medium text-sm text-gray-900">{g.grupo}</div>
                        <div className="flex gap-2 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleOpenEditGrupo(g)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all">
                            <Edit2 size={15} />
                          </button>
                          <button type="button" onClick={() => handleSelectGrupo(g.codGrupo)} className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium">
                            <Check size={14} /> Selecionar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {(grupoModalMode === 'create' || grupoModalMode === 'edit') && (
              <form onSubmit={handleGrupoSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome do Grupo <span className="text-red-500">*</span></label>
                  <input name="grupo" value={grupoData.grupo} onChange={(e) => setGrupoData({...grupoData, grupo: e.target.value})} required placeholder="Ex: Ferramentas"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button type="button" onClick={() => setGrupoModalMode('list')} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Voltar</button>
                  <button type="submit" disabled={loadingGrupo} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                    <Save size={16} /> {loadingGrupo ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL UNIDADE --- */}
      {isUnidadeSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-medium text-gray-900">
                {unidadeModalMode === 'list' && 'Unidades Cadastradas'}
                {unidadeModalMode === 'create' && 'Nova Unidade'}
                {unidadeModalMode === 'edit' && 'Editar Unidade'}
              </h2>
              <button onClick={() => unidadeModalMode === 'list' ? setIsUnidadeSelectorOpen(false) : setUnidadeModalMode('list')} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {unidadeModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={unidadeSearchTerm} onChange={(e) => setUnidadeSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
                  <button type="button" onClick={handleOpenCreateUnidade} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    <Plus size={16} /> Nova
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                  {unidades.filter(u => u.unidade?.toLowerCase().includes(unidadeSearchTerm.toLowerCase())).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">Nenhuma unidade encontrada.</div>
                  ) : (
                    unidades.filter(u => u.unidade?.toLowerCase().includes(unidadeSearchTerm.toLowerCase())).map(u => (
                      <div key={u.codUnidade} className="py-3 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                        <div className="font-medium text-sm text-gray-900">{u.unidade}</div>
                        <div className="flex gap-2 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleOpenEditUnidade(u)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all">
                            <Edit2 size={15} />
                          </button>
                          <button type="button" onClick={() => handleSelectUnidade(u.codUnidade)} className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium">
                            <Check size={14} /> Selecionar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {(unidadeModalMode === 'create' || unidadeModalMode === 'edit') && (
              <form onSubmit={handleUnidadeSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome da Unidade <span className="text-red-500">*</span></label>
                  <input name="unidade" value={unidadeData.unidade} onChange={(e) => setUnidadeData({...unidadeData, unidade: e.target.value})} required placeholder="Ex: Unidade, Kg"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button type="button" onClick={() => setUnidadeModalMode('list')} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Voltar</button>
                  <button type="submit" disabled={loadingUnidade} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                    <Save size={16} /> {loadingUnidade ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
