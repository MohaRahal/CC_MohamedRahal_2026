import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, User, Phone, MapPin, Briefcase, CreditCard, Calendar, Plus, X, Save, Edit2, Search } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { funcionariosService } from '../../services/funcionariosService';
import { cargosService } from '../../services/cargosService';
import { cidadesService } from '../../services/cidadesService';
import { estadosService } from '../../services/estadosService';
import { paisesService } from '../../services/paisesService';

export default function AddFuncionario() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [cargos, setCargos] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estados, setEstados] = useState([]);
  const [paises, setPaises] = useState([]);

  const [formData, setFormData] = useState({
    funcionario: '', cpf: '', data_nascimento: '', sexo: '',
    codCargo: '', fone: '', ender: '', numero: '', complemento: '',
    bairro: '', codCidade: '', cep: '',
  });

  // --- CARGO MANAGER ---
  const [isCargoSelectorOpen, setIsCargoSelectorOpen] = useState(false);
  const [cargoModalMode, setCargoModalMode] = useState('list');
  const [editingCargoId, setEditingCargoId] = useState(null);
  const [cargoSearchTerm, setCargoSearchTerm] = useState('');
  const [loadingCargo, setLoadingCargo] = useState(false);
  const [cargoData, setCargoData] = useState({ cargo: '' });

  // --- CIDADE MANAGER ---
  const [isCidadeSelectorOpen, setIsCidadeSelectorOpen] = useState(false);
  const [cidadeModalMode, setCidadeModalMode] = useState('list');
  const [editingCidadeId, setEditingCidadeId] = useState(null);
  const [cidadeSearchTerm, setCidadeSearchTerm] = useState('');
  const [loadingCidade, setLoadingCidade] = useState(false);
  const [cidadeData, setCidadeData] = useState({ cidade: '', codEstado: '' });

  // --- ESTADO MANAGER ---
  const [isEstadoSelectorOpen, setIsEstadoSelectorOpen] = useState(false);
  const [estadoModalMode, setEstadoModalMode] = useState('list');
  const [editingEstadoId, setEditingEstadoId] = useState(null);
  const [estadoSearchTerm, setEstadoSearchTerm] = useState('');
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [estadoData, setEstadoData] = useState({ estado: '', UF: '', codPais: '' });

  // --- PAÍS MANAGER ---
  const [isPaisSelectorOpen, setIsPaisSelectorOpen] = useState(false);
  const [paisModalMode, setPaisModalMode] = useState('list');
  const [editingPaisId, setEditingPaisId] = useState(null);
  const [paisSearchTerm, setPaisSearchTerm] = useState('');
  const [loadingPais, setLoadingPais] = useState(false);
  const [paisData, setPaisData] = useState({ pais: '', sigla: '', ddi: '', moeda: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      cargosService.getCargos(token),
      cidadesService.getCidades(token),
      estadosService.getEstados(token),
      paisesService.getPaises(token)
    ]).then(([cargosData, cidadesData, estadosData, paisesData]) => {
      setCargos(cargosData || []);
      setCidades(cidadesData || []);
      setEstados(estadosData || []);
      setPaises(paisesData || []);
    }).catch(err => console.error(err))
      .finally(() => setLoadingOptions(false));
  }, []);

  const loadCargos = async () => {
    const token = localStorage.getItem('token');
    const data = await cargosService.getCargos(token);
    setCargos(data || []);
  };

  const loadCidades = async () => {
    const token = localStorage.getItem('token');
    const data = await cidadesService.getCidades(token);
    setCidades(data || []);
  };

  const loadEstados = async () => {
    const token = localStorage.getItem('token');
    const data = await estadosService.getEstados(token);
    setEstados(data || []);
  };

  const loadPaises = async () => {
    const token = localStorage.getItem('token');
    const data = await paisesService.getPaises(token);
    setPaises(data || []);
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await funcionariosService.createFuncionario({
        ...formData,
        codCargo: Number(formData.codCargo),
        codCidade: formData.codCidade ? Number(formData.codCidade) : null,
      });
      navigate('/funcionarios');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- CARGO ACTIONS ---
  const handleOpenCargoSelector = () => { loadCargos(); setCargoSearchTerm(''); setCargoModalMode('list'); setIsCargoSelectorOpen(true); };
  const handleOpenCreateCargo = () => { setCargoData({ cargo: '' }); setCargoModalMode('create'); };
  const handleOpenEditCargo = (c) => { setCargoData({ cargo: c.cargo || '' }); setEditingCargoId(c.codCargo); setCargoModalMode('edit'); };
  const handleSelectCargo = (id) => { setFormData({ ...formData, codCargo: id.toString() }); setIsCargoSelectorOpen(false); };
  const handleCargoSubmit = async (e) => {
    e.preventDefault(); setLoadingCargo(true);
    try {
      const token = localStorage.getItem('token');
      if (cargoModalMode === 'create') {
        const res = await cargosService.createCargo(token, cargoData);
        await loadCargos();
        if (res && res.codCargo) setFormData({ ...formData, codCargo: res.codCargo.toString() });
        setIsCargoSelectorOpen(false);
      } else {
        await cargosService.updateCargo(token, editingCargoId, cargoData);
        await loadCargos();
        setCargoModalMode('list');
      }
    } catch (e) { alert("Erro ao salvar cargo."); } finally { setLoadingCargo(false); }
  };

  // --- CIDADE ACTIONS ---
  const handleOpenCidadeSelector = () => { loadCidades(); setCidadeSearchTerm(''); setCidadeModalMode('list'); setIsCidadeSelectorOpen(true); };
  const handleOpenCreateCidade = () => { loadEstados(); setCidadeData({ cidade: '', codEstado: '' }); setCidadeModalMode('create'); };
  const handleOpenEditCidade = (c) => { loadEstados(); setCidadeData({ cidade: c.cidade || '', codEstado: c.codEstado?.toString() || '' }); setEditingCidadeId(c.codCidade); setCidadeModalMode('edit'); };
  const handleSelectCidade = (id) => { setFormData({ ...formData, codCidade: id.toString() }); setIsCidadeSelectorOpen(false); };
  const handleCidadeSubmit = async (e) => {
    e.preventDefault(); setLoadingCidade(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { cidade: cidadeData.cidade, codEstado: parseInt(cidadeData.codEstado) };
      if (cidadeModalMode === 'create') {
        const res = await cidadesService.createCidade(token, payload);
        await loadCidades();
        if (res && res.codCidade) setFormData({ ...formData, codCidade: res.codCidade.toString() });
        setIsCidadeSelectorOpen(false);
      } else {
        await cidadesService.updateCidade(token, editingCidadeId, payload);
        await loadCidades();
        setCidadeModalMode('list');
      }
    } catch (e) { alert("Erro ao salvar cidade."); } finally { setLoadingCidade(false); }
  };

  // --- ESTADO ACTIONS ---
  const handleOpenEstadoSelector = () => { loadEstados(); setEstadoSearchTerm(''); setEstadoModalMode('list'); setIsEstadoSelectorOpen(true); };
  const handleOpenCreateEstado = () => { loadPaises(); setEstadoData({ estado: '', UF: '', codPais: '' }); setEstadoModalMode('create'); };
  const handleOpenEditEstado = (e) => { loadPaises(); setEstadoData({ estado: e.estado || '', UF: e.uf || e.UF || '', codPais: e.codPais?.toString() || '' }); setEditingEstadoId(e.codEstado); setEstadoModalMode('edit'); };
  const handleSelectEstado = (id) => { setCidadeData({ ...cidadeData, codEstado: id.toString() }); setIsEstadoSelectorOpen(false); };
  const handleEstadoSubmit = async (e) => {
    e.preventDefault(); setLoadingEstado(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { estado: estadoData.estado, UF: estadoData.UF, codPais: parseInt(estadoData.codPais) };
      if (estadoModalMode === 'create') {
        const res = await estadosService.createEstado(token, payload);
        await loadEstados();
        if (res && res.codEstado) setCidadeData({ ...cidadeData, codEstado: res.codEstado.toString() });
        setIsEstadoSelectorOpen(false);
      } else {
        await estadosService.updateEstado(token, editingEstadoId, payload);
        await loadEstados();
        setEstadoModalMode('list');
      }
    } catch (e) { alert("Erro ao salvar estado."); } finally { setLoadingEstado(false); }
  };

  // --- PAÍS ACTIONS ---
  const handleOpenPaisSelector = () => { loadPaises(); setPaisSearchTerm(''); setPaisModalMode('list'); setIsPaisSelectorOpen(true); };
  const handleOpenCreatePais = () => { setPaisData({ pais: '', sigla: '', ddi: '', moeda: '' }); setPaisModalMode('create'); };
  const handleOpenEditPais = (p) => { setPaisData({ pais: p.pais || '', sigla: p.sigla || '', ddi: p.ddi || '', moeda: p.moeda || '' }); setEditingPaisId(p.codPais); setPaisModalMode('edit'); };
  const handleSelectPais = (id) => { setEstadoData({ ...estadoData, codPais: id.toString() }); setIsPaisSelectorOpen(false); };
  const handlePaisSubmit = async (e) => {
    e.preventDefault(); setLoadingPais(true);
    try {
      const token = localStorage.getItem('token');
      if (paisModalMode === 'create') {
        const res = await paisesService.createPais(token, paisData);
        await loadPaises();
        if (res && res.codPais) setEstadoData({ ...estadoData, codPais: res.codPais.toString() });
        setIsPaisSelectorOpen(false);
      } else {
        await paisesService.updatePais(token, editingPaisId, paisData);
        await loadPaises();
        setPaisModalMode('list');
      }
    } catch (e) { alert("Erro ao salvar país."); } finally { setLoadingPais(false); }
  };

  const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all';
  const selectClass = `${inputClass} appearance-none`;

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-3xl mx-auto">
          <Link to="/funcionarios" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
            <ArrowLeft size={16} /> Voltar para Funcionários
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Novo Funcionário</h1>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados do novo funcionário.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Dados pessoais */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                <User size={14} className="text-gray-400" /> Dados Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome Completo <span className="text-red-500">*</span></label>
                  <input name="funcionario" required value={formData.funcionario} onChange={handleChange}
                    placeholder="Ex: João da Silva" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><CreditCard size={13} className="text-gray-400" />CPF</label>
                  <input name="cpf" value={formData.cpf} onChange={handleChange}
                    placeholder="000.000.000-00" maxLength={14} className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Calendar size={13} className="text-gray-400" />Data de Nascimento</label>
                  <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Sexo</label>
                  <select name="sexo" value={formData.sexo} onChange={handleChange} className={selectClass}>
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Briefcase size={13} className="text-gray-400" />Cargo <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select name="codCargo" required value={formData.codCargo} onChange={handleChange}
                        disabled={loadingOptions}
                        className={`${selectClass} pr-10 ${loadingOptions ? 'opacity-60 cursor-not-allowed' : ''}`}>
                        <option value="" disabled>{loadingOptions ? 'Carregando...' : 'Selecione um cargo'}</option>
                        {cargos.map(c => <option key={c.codCargo} value={c.codCargo}>{c.cargo}</option>)}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        {loadingOptions ? <Loader2 size={13} className="animate-spin text-gray-400" /> : <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenCargoSelector}
                      className="px-4 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200"
                      title="Selecionar/Gerenciar Cargos"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Phone size={13} className="text-gray-400" />Telefone</label>
                  <input name="fone" value={formData.fone} onChange={handleChange}
                    placeholder="(00) 90000-0000" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                <MapPin size={14} className="text-gray-400" /> Endereço
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Logradouro</label>
                  <input name="ender" value={formData.ender} onChange={handleChange} placeholder="Rua, Av..." className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Número</label>
                  <input name="numero" value={formData.numero} onChange={handleChange} placeholder="123" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Complemento</label>
                  <input name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto, Sala..." className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Bairro</label>
                  <input name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Bairro" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">CEP</label>
                  <input name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" maxLength={9} className={inputClass} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Cidade</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select name="codCidade" value={formData.codCidade} onChange={handleChange}
                        disabled={loadingOptions}
                        className={`${selectClass} pr-10 ${loadingOptions ? 'opacity-60 cursor-not-allowed' : ''}`}>
                        <option value="">{loadingOptions ? 'Carregando...' : 'Selecione uma cidade'}</option>
                        {cidades.map(c => <option key={c.codCidade} value={c.codCidade}>{c.cidade}{c.estado?.UF ? ` - ${c.estado.UF}` : ''}</option>)}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenCidadeSelector}
                      className="px-4 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200"
                      title="Selecionar/Gerenciar Cidades"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link to="/funcionarios" className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-center">
                Cancelar
              </Link>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {isSubmitting ? 'Salvando...' : 'Cadastrar Funcionário'}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* --- MODAL CARGO --- */}
      {isCargoSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-medium text-gray-900">
                {cargoModalMode === 'list' && 'Cargos Cadastrados'}
                {cargoModalMode === 'create' && 'Novo Cargo'}
                {cargoModalMode === 'edit' && 'Editar Cargo'}
              </h2>
              <button onClick={() => cargoModalMode === 'list' ? setIsCargoSelectorOpen(false) : setCargoModalMode('list')} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {cargoModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={cargoSearchTerm} onChange={(e) => setCargoSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
                  <button type="button" onClick={handleOpenCreateCargo} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    <Plus size={16} /> Novo
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                  {cargos.filter(c => c.cargo?.toLowerCase().includes(cargoSearchTerm.toLowerCase())).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">Nenhum cargo encontrado.</div>
                  ) : (
                    cargos.filter(c => c.cargo?.toLowerCase().includes(cargoSearchTerm.toLowerCase())).map(c => (
                      <div key={c.codCargo} className="py-3 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                        <div className="font-medium text-sm text-gray-900">{c.cargo}</div>
                        <div className="flex gap-2 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleOpenEditCargo(c)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all">
                            <Edit2 size={15} />
                          </button>
                          <button type="button" onClick={() => handleSelectCargo(c.codCargo)} className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium">
                            <Check size={14} /> Selecionar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {(cargoModalMode === 'create' || cargoModalMode === 'edit') && (
              <form onSubmit={handleCargoSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome do Cargo <span className="text-red-500">*</span></label>
                  <input name="cargo" value={cargoData.cargo} onChange={(e) => setCargoData({...cargoData, cargo: e.target.value})} required placeholder="Ex: Vendedor"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button type="button" onClick={() => setCargoModalMode('list')} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Voltar</button>
                  <button type="submit" disabled={loadingCargo} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                    <Save size={16} /> {loadingCargo ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL CIDADE --- */}
      {isCidadeSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-medium text-gray-900">
                {cidadeModalMode === 'list' && 'Cidades Cadastradas'}
                {cidadeModalMode === 'create' && 'Nova Cidade'}
                {cidadeModalMode === 'edit' && 'Editar Cidade'}
              </h2>
              <button onClick={() => cidadeModalMode === 'list' ? setIsCidadeSelectorOpen(false) : setCidadeModalMode('list')} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {cidadeModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={cidadeSearchTerm} onChange={(e) => setCidadeSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
                  <button type="button" onClick={handleOpenCreateCidade} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    <Plus size={16} /> Nova
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                  {cidades.filter(c => c.cidade?.toLowerCase().includes(cidadeSearchTerm.toLowerCase())).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">Nenhuma cidade encontrada.</div>
                  ) : (
                    cidades.filter(c => c.cidade?.toLowerCase().includes(cidadeSearchTerm.toLowerCase())).map(c => (
                      <div key={c.codCidade} className="py-3 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{c.cidade}</div>
                          <div className="text-xs text-gray-400 mt-0.5">Estado: {c.estado?.estado || 'Não informado'}</div>
                        </div>
                        <div className="flex gap-2 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleOpenEditCidade(c)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all">
                            <Edit2 size={15} />
                          </button>
                          <button type="button" onClick={() => handleSelectCidade(c.codCidade)} className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium">
                            <Check size={14} /> Selecionar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {(cidadeModalMode === 'create' || cidadeModalMode === 'edit') && (
              <form onSubmit={handleCidadeSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome da Cidade <span className="text-red-500">*</span></label>
                  <input name="cidade" value={cidadeData.cidade} onChange={(e) => setCidadeData({...cidadeData, cidade: e.target.value})} required placeholder="Ex: Campinas"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Estado <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <select required name="codEstado" value={cidadeData.codEstado} onChange={(e) => setCidadeData({...cidadeData, codEstado: e.target.value})}
                      className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all">
                      <option value="">Selecione um estado...</option>
                      {estados.map(e => <option key={e.codEstado} value={e.codEstado}>{e.estado} ({e.uf || e.UF || ''})</option>)}
                    </select>
                    <button type="button" onClick={handleOpenEstadoSelector} className="px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button type="button" onClick={() => setCidadeModalMode('list')} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Voltar</button>
                  <button type="submit" disabled={loadingCidade} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                    <Save size={16} /> {loadingCidade ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL ESTADO --- */}
      {isEstadoSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-medium text-gray-900">
                {estadoModalMode === 'list' && 'Estados Cadastrados'}
                {estadoModalMode === 'create' && 'Novo Estado'}
                {estadoModalMode === 'edit' && 'Editar Estado'}
              </h2>
              <button onClick={() => estadoModalMode === 'list' ? setIsEstadoSelectorOpen(false) : setEstadoModalMode('list')} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {estadoModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={estadoSearchTerm} onChange={(e) => setEstadoSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
                  <button type="button" onClick={handleOpenCreateEstado} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    <Plus size={16} /> Novo
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                  {estados.filter(e => e.estado?.toLowerCase().includes(estadoSearchTerm.toLowerCase())).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">Nenhum estado encontrado.</div>
                  ) : (
                    estados.filter(e => e.estado?.toLowerCase().includes(estadoSearchTerm.toLowerCase())).map(e => (
                      <div key={e.codEstado} className="py-3 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{e.estado} ({e.uf || e.UF || ''})</div>
                        </div>
                        <div className="flex gap-2 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleOpenEditEstado(e)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all">
                            <Edit2 size={15} />
                          </button>
                          <button type="button" onClick={() => handleSelectEstado(e.codEstado)} className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium">
                            <Check size={14} /> Selecionar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {(estadoModalMode === 'create' || estadoModalMode === 'edit') && (
              <form onSubmit={handleEstadoSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome do Estado <span className="text-red-500">*</span></label>
                  <input name="estado" value={estadoData.estado} onChange={(e) => setEstadoData({...estadoData, estado: e.target.value})} required placeholder="Ex: São Paulo"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">UF <span className="text-red-500">*</span></label>
                  <input name="UF" value={estadoData.UF} onChange={(e) => setEstadoData({...estadoData, UF: e.target.value})} required maxLength={2} placeholder="Ex: SP"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all uppercase"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">País <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <select required name="codPais" value={estadoData.codPais} onChange={(e) => setEstadoData({...estadoData, codPais: e.target.value})}
                      className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all">
                      <option value="">Selecione um país...</option>
                      {paises.map(p => <option key={p.codPais} value={p.codPais}>{p.pais}</option>)}
                    </select>
                    <button type="button" onClick={handleOpenPaisSelector} className="px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button type="button" onClick={() => setEstadoModalMode('list')} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Voltar</button>
                  <button type="submit" disabled={loadingEstado} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                    <Save size={16} /> {loadingEstado ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL PAÍS --- */}
      {isPaisSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-medium text-gray-900">
                {paisModalMode === 'list' && 'Países Cadastrados'}
                {paisModalMode === 'create' && 'Novo País'}
                {paisModalMode === 'edit' && 'Editar País'}
              </h2>
              <button onClick={() => paisModalMode === 'list' ? setIsPaisSelectorOpen(false) : setPaisModalMode('list')} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {paisModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={paisSearchTerm} onChange={(e) => setPaisSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
                  <button type="button" onClick={handleOpenCreatePais} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    <Plus size={16} /> Novo
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                  {paises.filter(p => p.pais?.toLowerCase().includes(paisSearchTerm.toLowerCase())).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">Nenhum país encontrado.</div>
                  ) : (
                    paises.filter(p => p.pais?.toLowerCase().includes(paisSearchTerm.toLowerCase())).map(p => (
                      <div key={p.codPais} className="py-3 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{p.pais}</div>
                          <div className="text-xs text-gray-400 mt-0.5">DDI: {p.ddi} | Moeda: {p.moeda}</div>
                        </div>
                        <div className="flex gap-2 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleOpenEditPais(p)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all">
                            <Edit2 size={15} />
                          </button>
                          <button type="button" onClick={() => handleSelectPais(p.codPais)} className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium">
                            <Check size={14} /> Selecionar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {(paisModalMode === 'create' || paisModalMode === 'edit') && (
              <form onSubmit={handlePaisSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome do País <span className="text-red-500">*</span></label>
                  <input name="pais" value={paisData.pais} onChange={(e) => setPaisData({...paisData, pais: e.target.value})} required placeholder="Ex: Brasil"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Sigla <span className="text-red-500">*</span></label>
                    <input name="sigla" value={paisData.sigla} onChange={(e) => setPaisData({...paisData, sigla: e.target.value})} required maxLength={3} placeholder="Ex: BRA"
                      className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all uppercase"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">DDI <span className="text-red-500">*</span></label>
                    <input name="ddi" value={paisData.ddi} onChange={(e) => setPaisData({...paisData, ddi: e.target.value})} required placeholder="Ex: +55"
                      className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Moeda <span className="text-red-500">*</span></label>
                  <input name="moeda" value={paisData.moeda} onChange={(e) => setPaisData({...paisData, moeda: e.target.value})} required placeholder="Ex: BRL"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all uppercase"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button type="button" onClick={() => setPaisModalMode('list')} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Voltar</button>
                  <button type="submit" disabled={loadingPais} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                    <Save size={16} /> {loadingPais ? 'Salvando...' : 'Salvar'}
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
