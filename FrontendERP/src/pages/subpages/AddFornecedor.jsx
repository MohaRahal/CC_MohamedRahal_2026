import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, User, Phone, MapPin, Building, CreditCard, Mail, Globe, Plus, X, Save, Edit2, Search, Trash2 } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { fornecedoresService } from '../../services/fornecedoresService';
import { cidadesService } from '../../services/cidadesService';
import { estadosService } from '../../services/estadosService';
import { condicoesPagamentosService } from '../../services/condicoesPagamentosService';
import { paisesService } from '../../services/paisesService';
import { formasPagamentoService } from '../../services/formasPagamentoService';

export default function AddFornecedor() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [cidades, setCidades] = useState([]);
  const [estados, setEstados] = useState([]);
  const [paises, setPaises] = useState([]);
  const [condicoesPagamento, setCondicoesPagamento] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);

  const [formData, setFormData] = useState({
    fornecedor: '',
    apelido_NomeFantasia: '',
    ender: '',
    numero: '',
    complemento: '',
    bairro: '',
    cep: '',
    codCidade: '',
    site: '',
    fone: '',
    email: '',
    codCondPagamento: '',
    limiteCredito: '',
    rg_inscEst: '',
    tipoPessoa: '',
    cpf_cnpj: '',
  });

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

  // --- CONDICAO MANAGER ---
  const [isCondicaoSelectorOpen, setIsCondicaoSelectorOpen] = useState(false);
  const [condicaoModalMode, setCondicaoModalMode] = useState('list');
  const [editingCondicaoId, setEditingCondicaoId] = useState(null);
  const [condicaoSearchTerm, setCondicaoSearchTerm] = useState('');
  const [loadingCondicao, setLoadingCondicao] = useState(false);
  const [condicaoData, setCondicaoData] = useState({ condPagamento: '', juros: 0, multa: 0, desconto: 0 });
  const [condicaoParcelas, setCondicaoParcelas] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [cidadesData, estadosData, paisesData, condicoesData, formasData] = await Promise.all([
        cidadesService.getCidades(token).catch(() => []),
        estadosService.getEstados(token).catch(() => []),
        paisesService.getPaises(token).catch(() => []),
        condicoesPagamentosService.getCondicoesPagamentos(token).catch(() => []),
        formasPagamentoService.getFormasPagamento(token).catch(() => [])
      ]);
      setCidades(cidadesData || []);
      setEstados(estadosData || []);
      setPaises(paisesData || []);
      setCondicoesPagamento(condicoesData || []);
      setFormasPagamento(formasData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadCidades = async () => { const token = localStorage.getItem('token'); const data = await cidadesService.getCidades(token).catch(() => []); setCidades(data || []); };
  const loadEstados = async () => { const token = localStorage.getItem('token'); const data = await estadosService.getEstados(token).catch(() => []); setEstados(data || []); };
  const loadPaises = async () => { const token = localStorage.getItem('token'); const data = await paisesService.getPaises(token).catch(() => []); setPaises(data || []); };
  const loadCondicoes = async () => { const token = localStorage.getItem('token'); const data = await condicoesPagamentosService.getCondicoesPagamentos(token).catch(() => []); setCondicoesPagamento(data || []); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await fornecedoresService.createFornecedor({
        ...formData,
        codCidade: formData.codCidade ? Number(formData.codCidade) : null,
        codCondPagamento: formData.codCondPagamento ? Number(formData.codCondPagamento) : null,
        limiteCredito: formData.limiteCredito ? Number(formData.limiteCredito) : 0,
      });
      navigate('/Fornecedores');
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
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

  // --- CONDICAO ACTIONS ---
  const recalculatePercentages = (listaParcelas) => {
    if (listaParcelas.length === 0) return;
    const manuallyEditedParcelas = listaParcelas.filter(p => p.manuallyEdited);
    const nonEditedCount = listaParcelas.length - manuallyEditedParcelas.length;
    
    const totalManuallyEdited = manuallyEditedParcelas.reduce((acc, p) => acc + (parseFloat(p.percentual) || 0), 0);
    const remainingPercent = Math.max(0, 100 - totalManuallyEdited);
    
    if (nonEditedCount > 0) {
      const per = (remainingPercent / nonEditedCount).toFixed(2);
      listaParcelas.forEach(p => {
        if (!p.manuallyEdited) {
          p.percentual = per;
        }
      });
    }
  };

  const handleAddParcela = () => {
    const novasParcelas = [...condicaoParcelas, { diasVencimento: '', formaPagamentoId: '', percentual: '', manuallyEdited: false }];
    recalculatePercentages(novasParcelas);
    setCondicaoParcelas(novasParcelas);
  };

  const handleParcelaChange = (index, field, value) => {
    const novasParcelas = [...condicaoParcelas];
    novasParcelas[index][field] = value;
    if (field === 'percentual') {
      novasParcelas[index].manuallyEdited = true;
    }
    setCondicaoParcelas(novasParcelas);
  };

  const handleRemoveParcela = (index) => {
    const novasParcelas = condicaoParcelas.filter((_, i) => i !== index);
    recalculatePercentages(novasParcelas);
    setCondicaoParcelas(novasParcelas);
  };

  const handleOpenCondicaoSelector = () => { loadCondicoes(); setCondicaoSearchTerm(''); setCondicaoModalMode('list'); setIsCondicaoSelectorOpen(true); };
  
  const handleOpenCreateCondicao = () => { 
    setCondicaoData({ condPagamento: '', juros: 0, multa: 0, desconto: 0 }); 
    setCondicaoParcelas([]);
    setCondicaoModalMode('create'); 
  };

  const handleOpenEditCondicao = async (c) => { 
    setLoadingCondicao(true);
    try {
      const token = localStorage.getItem('token');
      // fetch full details to get parcelas
      const fullC = await condicoesPagamentosService.getCondicaoPagamento(token, c.codCondPagamento);
      
      setCondicaoData({ 
        condPagamento: fullC.condPagamento || '', 
        juros: fullC.juros || 0, 
        multa: fullC.multa || 0, 
        desconto: fullC.desconto || 0 
      }); 
      setEditingCondicaoId(c.codCondPagamento); 
      setCondicaoModalMode('edit'); 
      
      if (fullC.parcelas && fullC.parcelas.length > 0) {
        setCondicaoParcelas(fullC.parcelas.map(p => ({
          diasVencimento: p.diasVencimento.toString(),
          formaPagamentoId: p.codFormaPagamento.toString(),
          percentual: p.percentual.toString(),
          manuallyEdited: true
        })));
      } else {
        setCondicaoParcelas([]);
      }
    } catch (e) {
      alert("Erro ao carregar detalhes da condição.");
    } finally {
      setLoadingCondicao(false);
    }
  };

  const handleSelectCondicao = (id) => { setFormData({ ...formData, codCondPagamento: id.toString() }); setIsCondicaoSelectorOpen(false); };
  
  const handleCondicaoSubmit = async (e) => {
    e.preventDefault(); 
    
    if (condicaoParcelas.length === 0) {
      alert("Adicione pelo menos uma parcela para a condição de pagamento.");
      return;
    }

   const totalPercentual = condicaoParcelas.reduce(
  (acc, p) => acc + (parseFloat(p.percentual) || 0),
  0
);

if (totalPercentual < 99) {
  alert(
    `A soma dos percentuais das parcelas deve ser maior ou igual a 99%. O total atual é ${totalPercentual.toFixed(2)}%.`
  );
  return;
}

    // Validar se os dias de vencimento são crescentes
    for (let i = 1; i < condicaoParcelas.length; i++) {
      const diasAtual = parseInt(condicaoParcelas[i].diasVencimento, 10);
      const diasAnterior = parseInt(condicaoParcelas[i - 1].diasVencimento, 10);
      
      if (isNaN(diasAtual) || isNaN(diasAnterior)) {
        alert("Preencha todos os campos de dias para vencimento.");
        return;
      }
      
      if (diasAtual <= diasAnterior) {
        alert(`O prazo de vencimento da parcela ${i + 1} (${diasAtual} dias) não pode ser menor ou igual ao da parcela ${i} (${diasAnterior} dias).`);
        return;
      }
    }

    setLoadingCondicao(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        condPagamento: condicaoData.condPagamento,
        qtdParcelas: condicaoParcelas.length,
        juros: parseFloat(condicaoData.juros) || 0,
        multa: parseFloat(condicaoData.multa) || 0,
        desconto: parseFloat(condicaoData.desconto) || 0,
        ativo: true,
        parcelas: condicaoParcelas.map(p => ({
          diasVencimento: parseInt(p.diasVencimento, 10) || 0,
          codFormaPagamento: parseInt(p.formaPagamentoId, 10),
          percentual: parseFloat(p.percentual) || 0
        }))
      };

      if (condicaoModalMode === 'create') {
        const res = await condicoesPagamentosService.createCondicaoPagamento(token, payload);
        await loadCondicoes();
        if (res && res.codCondPagamento) setFormData({ ...formData, codCondPagamento: res.codCondPagamento.toString() });
        setIsCondicaoSelectorOpen(false);
      } else {
        await condicoesPagamentosService.updateCondicaoPagamento(token, editingCondicaoId, payload);
        await loadCondicoes();
        setCondicaoModalMode('list');
      }
    } catch (e) { 
      alert("Erro ao salvar condição de pagamento."); 
    } finally { 
      setLoadingCondicao(false); 
    }
  };

  const totalPercentualCalc = condicaoParcelas.reduce((acc, p) => acc + (parseFloat(p.percentual) || 0), 0);

  const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all';
  const selectClass = `${inputClass} appearance-none`;

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-4xl mx-auto">
          <Link to="/Fornecedores" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
            <ArrowLeft size={16} /> Voltar para Fornecedores
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Novo Fornecedor</h1>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados do novo parceiro ou fornecedor.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                <Building size={14} className="text-gray-400" /> Dados Principais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Fornecedor <span className="text-red-500">*</span></label>
                  <input name="fornecedor" required value={formData.fornecedor} onChange={handleChange} placeholder="Ex: Fornecedor Ltda" className={inputClass} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome Fantasia<span className="text-red-500">*</span></label>
                  <input required name="apelido_NomeFantasia" value={formData.apelido_NomeFantasia} onChange={handleChange} placeholder="Ex: Fornecedor" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Tipo de Pessoa<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select name="tipoPessoa" required value={formData.tipoPessoa} onChange={handleChange} className={selectClass}>
                      <option value="">Selecione</option>
                      <option value="F">Física</option>
                      <option value="J">Jurídica</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">CPF / CNPJ<span className="text-red-500">*</span></label>
                  <input required name="cpf_cnpj" value={formData.cpf_cnpj} onChange={handleChange} placeholder="000.000.000-00 ou 00.000.000/0000-00" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">RG / Insc. Estadual<span className="text-red-500">*</span></label>
                  <input required name="rg_inscEst" value={formData.rg_inscEst} onChange={handleChange} placeholder="654" className={inputClass} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                <Phone size={14} className="text-gray-400" /> Contato
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Mail size={13} className="text-gray-400" />Email<span className="text-red-500">*</span></label>
                  <input type="email" required name="email" value={formData.email} onChange={handleChange} placeholder="contato@empresa.com" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Phone size={13} className="text-gray-400" />Telefone<span className="text-red-500">*</span></label>
                  <input required name="fone" value={formData.fone} onChange={handleChange} placeholder="(00) 90000-0000" className={inputClass} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Globe size={13} className="text-gray-400" />Site</label>
                  <input name="site" value={formData.site} onChange={handleChange} placeholder="https://www.empresa.com.br" className={inputClass} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                <MapPin size={14} className="text-gray-400" /> Endereço
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Logradouro<span className="text-red-500">*</span></label>
                  <input required name="ender" value={formData.ender} onChange={handleChange} placeholder="Rua, Av..." className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Número</label>
                  <input required name="numero" value={formData.numero} onChange={handleChange} placeholder="123" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Complemento</label>
                  <input name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto, Sala..." className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Bairro<span className="text-red-500">*</span></label>
                  <input required name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Bairro" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">CEP<span className="text-red-500">*</span></label>
                  <input required name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" maxLength={9} className={inputClass} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Cidade<span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <select required name="codCidade" value={formData.codCidade} onChange={handleChange}
                      disabled={loadingOptions} className={`${selectClass} flex-1 pr-10 ${loadingOptions ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      <option value="">{loadingOptions ? 'Carregando...' : 'Selecione uma cidade'}</option>
                      {cidades.map(c => <option key={c.codCidade} value={c.codCidade}>{c.cidade}{c.estado?.UF ? ` - ${c.estado.UF}` : ''}</option>)}
                    </select>
                    <button type="button" onClick={handleOpenCidadeSelector} className="px-4 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                <CreditCard size={14} className="text-gray-400" /> Comercial
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Condição de Pagamento<span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <select required name="codCondPagamento" value={formData.codCondPagamento} onChange={handleChange}
                      disabled={loadingOptions} className={`${selectClass} flex-1 pr-10 ${loadingOptions ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      <option value="">{loadingOptions ? 'Carregando...' : 'Selecione uma condição'}</option>
                      {condicoesPagamento.map(c => <option key={c.codCondPagamento} value={c.codCondPagamento}>{c.condPagamento}</option>)}
                    </select>
                    <button type="button" onClick={handleOpenCondicaoSelector} className="px-4 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Limite de Crédito<span className="text-red-500">*</span></label>
                  <input required type="number" step="0.01" name="limiteCredito" value={formData.limiteCredito} onChange={handleChange} placeholder="0.00" className={inputClass} />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link to="/Fornecedores" className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-center">
                Cancelar
              </Link>
              <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {isSubmitting ? 'Salvando...' : 'Cadastrar Fornecedor'}
              </button>
            </div>
          </form>
        </div>
      </div>

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
              <button onClick={() => cidadeModalMode === 'list' ? setIsCidadeSelectorOpen(false) : setCidadeModalMode('list')} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>
            {cidadeModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={cidadeSearchTerm} onChange={(e) => setCidadeSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                  </div>
                  <button type="button" onClick={handleOpenCreateCidade} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"><Plus size={16} /> Nova</button>
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
                          <button type="button" onClick={() => handleOpenEditCidade(c)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all"><Edit2 size={15} /></button>
                          <button type="button" onClick={() => handleSelectCidade(c.codCidade)} className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium"><Check size={14} /> Selecionar</button>
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
                  <input name="cidade" value={cidadeData.cidade} onChange={(e) => setCidadeData({...cidadeData, cidade: e.target.value})} required placeholder="Ex: Campinas" className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Estado <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <select required name="codEstado" value={cidadeData.codEstado} onChange={(e) => setCidadeData({...cidadeData, codEstado: e.target.value})} className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all">
                      <option value="">Selecione um estado...</option>
                      {estados.map(e => <option key={e.codEstado} value={e.codEstado}>{e.estado} ({e.uf || e.UF || ''})</option>)}
                    </select>
                    <button type="button" onClick={handleOpenEstadoSelector} className="px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200"><Plus size={18} /></button>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button type="button" onClick={() => setCidadeModalMode('list')} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Voltar</button>
                  <button type="submit" disabled={loadingCidade} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"><Save size={16} /> {loadingCidade ? 'Salvando...' : 'Salvar'}</button>
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
              <button onClick={() => estadoModalMode === 'list' ? setIsEstadoSelectorOpen(false) : setEstadoModalMode('list')} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>
            {estadoModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={estadoSearchTerm} onChange={(e) => setEstadoSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                  </div>
                  <button type="button" onClick={handleOpenCreateEstado} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"><Plus size={16} /> Novo</button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                  {estados.filter(e => e.estado?.toLowerCase().includes(estadoSearchTerm.toLowerCase())).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">Nenhum estado encontrado.</div>
                  ) : (
                    estados.filter(e => e.estado?.toLowerCase().includes(estadoSearchTerm.toLowerCase())).map(e => (
                      <div key={e.codEstado} className="py-3 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                        <div className="font-medium text-sm text-gray-900">{e.estado} ({e.uf || e.UF || ''})</div>
                        <div className="flex gap-2 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleOpenEditEstado(e)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all"><Edit2 size={15} /></button>
                          <button type="button" onClick={() => handleSelectEstado(e.codEstado)} className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium"><Check size={14} /> Selecionar</button>
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
                  <input name="estado" value={estadoData.estado} onChange={(e) => setEstadoData({...estadoData, estado: e.target.value})} required placeholder="Ex: São Paulo" className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">UF <span className="text-red-500">*</span></label>
                  <input name="UF" value={estadoData.UF} onChange={(e) => setEstadoData({...estadoData, UF: e.target.value})} required maxLength={2} placeholder="Ex: SP" className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all uppercase" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">País <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <select required name="codPais" value={estadoData.codPais} onChange={(e) => setEstadoData({...estadoData, codPais: e.target.value})} className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all">
                      <option value="">Selecione um país...</option>
                      {paises.map(p => <option key={p.codPais} value={p.codPais}>{p.pais}</option>)}
                    </select>
                    <button type="button" onClick={handleOpenPaisSelector} className="px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200"><Plus size={18} /></button>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button type="button" onClick={() => setEstadoModalMode('list')} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Voltar</button>
                  <button type="submit" disabled={loadingEstado} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"><Save size={16} /> {loadingEstado ? 'Salvando...' : 'Salvar'}</button>
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
              <button onClick={() => paisModalMode === 'list' ? setIsPaisSelectorOpen(false) : setPaisModalMode('list')} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>
            {paisModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={paisSearchTerm} onChange={(e) => setPaisSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                  </div>
                  <button type="button" onClick={handleOpenCreatePais} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"><Plus size={16} /> Novo</button>
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
                          <button type="button" onClick={() => handleOpenEditPais(p)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all"><Edit2 size={15} /></button>
                          <button type="button" onClick={() => handleSelectPais(p.codPais)} className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium"><Check size={14} /> Selecionar</button>
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
                  <input name="pais" value={paisData.pais} onChange={(e) => setPaisData({...paisData, pais: e.target.value})} required placeholder="Ex: Brasil" className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Sigla <span className="text-red-500">*</span></label>
                    <input name="sigla" value={paisData.sigla} onChange={(e) => setPaisData({...paisData, sigla: e.target.value})} required maxLength={3} placeholder="Ex: BRA" className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all uppercase" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">DDI <span className="text-red-500">*</span></label>
                    <input name="ddi" value={paisData.ddi} onChange={(e) => setPaisData({...paisData, ddi: e.target.value})} required placeholder="Ex: +55" className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Moeda <span className="text-red-500">*</span></label>
                  <input name="moeda" value={paisData.moeda} onChange={(e) => setPaisData({...paisData, moeda: e.target.value})} required placeholder="Ex: BRL" className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all uppercase" />
                </div>
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button type="button" onClick={() => setPaisModalMode('list')} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Voltar</button>
                  <button type="submit" disabled={loadingPais} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"><Save size={16} /> {loadingPais ? 'Salvando...' : 'Salvar'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL CONDIÇÃO DE PAGAMENTO --- */}
      {isCondicaoSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-medium text-gray-900">
                {condicaoModalMode === 'list' && 'Condições Cadastradas'}
                {condicaoModalMode === 'create' && 'Nova Condição'}
                {condicaoModalMode === 'edit' && 'Editar Condição'}
              </h2>
              <button onClick={() => condicaoModalMode === 'list' ? setIsCondicaoSelectorOpen(false) : setCondicaoModalMode('list')} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>
            
            {condicaoModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={condicaoSearchTerm} onChange={(e) => setCondicaoSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                  </div>
                  <button type="button" onClick={handleOpenCreateCondicao} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"><Plus size={16} /> Nova</button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                  {condicoesPagamento.filter(c => c.condPagamento?.toLowerCase().includes(condicaoSearchTerm.toLowerCase())).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">Nenhuma condição encontrada.</div>
                  ) : (
                    condicoesPagamento.filter(c => c.condPagamento?.toLowerCase().includes(condicaoSearchTerm.toLowerCase())).map(c => (
                      <div key={c.codCondPagamento} className="py-3 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{c.condPagamento}</div>
                          <div className="text-xs text-gray-400 mt-0.5">Parcelas: {c.qtdParcelas}</div>
                        </div>
                        <div className="flex gap-2 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleOpenEditCondicao(c)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all"><Edit2 size={15} /></button>
                          <button type="button" onClick={() => handleSelectCondicao(c.codCondPagamento)} className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium"><Check size={14} /> Selecionar</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {(condicaoModalMode === 'create' || condicaoModalMode === 'edit') && (
              <form onSubmit={handleCondicaoSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
                {loadingCondicao && condicaoModalMode === 'edit' && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur flex items-center justify-center z-10">
                    <Loader2 className="animate-spin text-gray-500" size={32} />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex flex-col gap-2 md:col-span-4">
                    <label className="text-sm font-medium text-gray-700">Nome da Condição de Pagamento <span className="text-red-500">*</span></label>
                    <input name="condPagamento" value={condicaoData.condPagamento} onChange={(e) => setCondicaoData({...condicaoData, condPagamento: e.target.value})} required placeholder="Ex: 30/60/90 Dias" className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Juros (%)</label>
                    <input type="number" step="0.01" name="juros" value={condicaoData.juros} onChange={(e) => setCondicaoData({...condicaoData, juros: e.target.value})} className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Multa (%)</label>
                    <input type="number" step="0.01" name="multa" value={condicaoData.multa} onChange={(e) => setCondicaoData({...condicaoData, multa: e.target.value})} className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Desconto (%)</label>
                    <input type="number" step="0.01" name="desconto" value={condicaoData.desconto} onChange={(e) => setCondicaoData({...condicaoData, desconto: e.target.value})} className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium text-gray-800">Configuração de Parcelas</h3>
                    <button type="button" onClick={handleAddParcela} className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all cursor-pointer">
                      <Plus size={16} /> Nova Parcela
                    </button>
                  </div>
                  {condicaoParcelas.length === 0 ? (
                    <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg text-center border border-dashed border-gray-200">
                      Nenhuma parcela adicionada. Clique em "Nova Parcela" para começar.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {condicaoParcelas.map((parcela, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row gap-4 items-end bg-[#fafafa] p-4 rounded-lg border border-gray-100">
                          <div className="flex flex-col gap-2 flex-1 w-full md:w-auto">
                            <label className="text-sm font-medium text-gray-700">Dias p/ Vencimento <span className="text-red-500">*</span></label>
                            <input type="number" value={parcela.diasVencimento} onChange={(e) => handleParcelaChange(idx, 'diasVencimento', e.target.value)} required min="0" placeholder="Ex: 30" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                          </div>
                          <div className="flex flex-col gap-2 flex-1 w-full md:w-auto">
                            <label className="text-sm font-medium text-gray-700">Forma de Pagamento <span className="text-red-500">*</span></label>
                            <select value={parcela.formaPagamentoId} onChange={(e) => handleParcelaChange(idx, 'formaPagamentoId', e.target.value)} required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all">
                              <option value="">Selecione...</option>
                              {formasPagamento.map(fp => <option key={fp.codFormaPagamento || fp.id} value={fp.codFormaPagamento || fp.id}>{fp.formaPagamento || fp.descricao}</option>)}
                            </select>
                          </div>
                          <div className="flex flex-col gap-2 flex-1 w-full md:w-auto">
                            <label className="text-sm font-medium text-gray-700">Percentual (%) <span className="text-red-500">*</span></label>
                            <input type="number" step="0.01" value={parcela.percentual} onChange={(e) => handleParcelaChange(idx, 'percentual', e.target.value)} required min="0" max="100" placeholder="33.33" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                          </div>
                          <button type="button" onClick={() => handleRemoveParcela(idx)} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0 mb-px cursor-pointer" title="Remover Parcela">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm mt-2">
                        <span className="font-medium text-gray-700">Total dos Percentuais:</span>
                        <span className={`font-semibold text-base ${Math.abs(totalPercentualCalc - 100) < 0.01 ? 'text-green-600' : 'text-amber-600'}`}>
                          {totalPercentualCalc.toFixed(2)}% {Math.abs(totalPercentualCalc - 100) >= 0.01 && '(Deve somar mais que 99.00%)'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button type="button" onClick={() => setCondicaoModalMode('list')} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Voltar</button>
                  <button type="submit" disabled={loadingCondicao} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"><Save size={16} /> {loadingCondicao ? 'Salvando...' : 'Salvar Condição'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
