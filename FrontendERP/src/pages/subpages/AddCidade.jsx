import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Edit2, Search, Check } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { cidadesService } from '../../services/cidadesService';
import { estadosService } from '../../services/estadosService';
import { paisesService } from '../../services/paisesService';

export default function AddCidade() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  
  const [estados, setEstados] = useState([]);
  const [formData, setFormData] = useState({
    cidade: '',
    codEstado: ''
  });


  const [isEstadoSelectorOpen, setIsEstadoSelectorOpen] = useState(false);
  const [estadoModalMode, setEstadoModalMode] = useState('list');
  const [editingEstadoId, setEditingEstadoId] = useState(null);
  const [estadoSearchTerm, setEstadoSearchTerm] = useState('');
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [paises, setPaises] = useState([]);
  const [estadoData, setEstadoData] = useState({
    estado: '',
    UF: '',
    codPais: ''
  });

  const [isPaisModalOpen, setIsPaisModalOpen] = useState(false);
  const [loadingPais, setLoadingPais] = useState(false);
  const [paisData, setPaisData] = useState({
    pais: '',
    sigla: '',
    ddi: '',
    moeda: ''
  });

  useEffect(() => {
    loadEstados();
  }, []);

  const loadEstados = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await estadosService.getEstados(token);
      setEstados(data || []);
    } catch (error) {
      console.error("Erro ao buscar estados:", error);
    }
  };

  const loadPaises = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await paisesService.getPaises(token);
      setPaises(data || []);
    } catch (error) {
      console.error("Erro ao buscar países:", error);
    }
  };

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        cidade: formData.cidade,
        codEstado: formData.codEstado ? parseInt(formData.codEstado) : null
      };
      await cidadesService.createCidade(token, payload);
      navigate('/cidades');
    } catch (error) {
      console.error("Erro ao criar cidade:", error);
      alert("Erro ao criar cidade. Verifique se os dados estão corretos.");
    } finally {
      setLoading(false);
    }
  };  
  const handleOpenEstadoSelector = () => {
    loadPaises();
    setEstadoSearchTerm('');
    setEstadoModalMode('list');
    setIsEstadoSelectorOpen(true);
  };

  const handleOpenCreateEstado = () => {
    setEstadoData({ estado: '', UF: '', codPais: '' });
    setEstadoModalMode('create');
  };

  const handleOpenEditEstado = (est) => {
    setEstadoData({
      estado: est.estado || '',
      UF: est.uf || est.UF || '',
      codPais: est.codPais ? est.codPais.toString() : ''
    });
    setEditingEstadoId(est.codEstado);
    setEstadoModalMode('edit');
  };

  const handleEstadoChange = (e) => {
    setEstadoData({ ...estadoData, [e.target.name]: e.target.value });
  };

  const handleEstadoSubmit = async (e) => {
    e.preventDefault();
    setLoadingEstado(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        estado: estadoData.estado,
        UF: estadoData.UF,
        codPais: estadoData.codPais ? parseInt(estadoData.codPais) : null
      };

      if (estadoModalMode === 'create') {
        const novoEstado = await estadosService.createEstado(token, payload);
        await loadEstados();
        if (novoEstado && novoEstado.codEstado) {
          setFormData({ ...formData, codEstado: novoEstado.codEstado.toString() });
        }
        setIsEstadoSelectorOpen(false);
      } else if (estadoModalMode === 'edit') {
        await estadosService.updateEstado(token, editingEstadoId, payload);
        await loadEstados();
        setEstadoModalMode('list');
      }
    } catch (error) {
      console.error(`Erro ao ${estadoModalMode === 'create' ? 'criar' : 'atualizar'} estado:`, error);
      alert(`Erro ao ${estadoModalMode === 'create' ? 'salvar' : 'atualizar'} estado.`);
    } finally {
      setLoadingEstado(false);
    }
  };

  const handleSelectEstado = (codEstado) => {
    setFormData({ ...formData, codEstado: codEstado.toString() });
    setIsEstadoSelectorOpen(false);
  };

  // Handlers para o Modal Pais
  const handleOpenPaisModal = () => {
    setPaisData({ pais: '', sigla: '', ddi: '', moeda: '' });
    setIsPaisModalOpen(true);
  };

  const handlePaisChange = (e) => {
    setPaisData({ ...paisData, [e.target.name]: e.target.value });
  };

  const handlePaisSubmit = async (e) => {
    e.preventDefault();
    setLoadingPais(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { ...paisData };
      const novoPais = await paisesService.createPais(token, payload);
      await loadPaises();
      if (novoPais && novoPais.codPais) {
        setEstadoData({ ...estadoData, codPais: novoPais.codPais.toString() });
      }
      setIsPaisModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar país:", error);
      alert("Erro ao criar país.");
    } finally {
      setLoadingPais(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => navigate('/cidades')}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Voltar para Cidades
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Nova Cidade</h1>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo para cadastrar.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Nome da Cidade <span className="text-red-500">*</span></label>
                <input 
                  name="cidade" value={formData.cidade} onChange={handleChange} required placeholder="Ex: Campinas"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <div className="flex gap-2">
                  <select 
                  required
                    name="codEstado" value={formData.codEstado} onChange={handleChange}
                    className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="">Selecione um estado...</option>
                    {estados.map(e => (
                      <option key={e.codEstado} value={e.codEstado}>
                        {e.estado} ({e.uf || e.UF || ''})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleOpenEstadoSelector}
                    className="px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200"
                    title="Selecionar/Gerenciar Estados"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-gray-100 pt-6">
              <button 
                type="submit" disabled={loading}
                className="flex items-center gap-2 bg-ink-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md disabled:opacity-50"
              >
                <Save size={16} /> {loading ? 'Salvando...' : 'Salvar Cidade'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isEstadoSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-medium text-gray-900">
                {estadoModalMode === 'list' && 'Estados Cadastrados'}
                {estadoModalMode === 'create' && 'Novo Estado'}
                {estadoModalMode === 'edit' && 'Editar Estado'}
              </h2>
              <button 
                type="button"
                onClick={() => {
                  if (estadoModalMode === 'list') {
                    setIsEstadoSelectorOpen(false);
                  } else {
                    setEstadoModalMode('list');
                  }
                }} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {estadoModalMode === 'list' && (
              <>
                <div className="p-6 border-b border-gray-100 bg-[#fafafa] flex gap-3 items-center flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Pesquisar por estado ou UF..." 
                      value={estadoSearchTerm}
                      onChange={(e) => setEstadoSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenCreateEstado}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    <Plus size={16} /> Novo
                  </button>
                </div>

                
                <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                  {estados.filter(est => 
                    est.estado?.toLowerCase().includes(estadoSearchTerm.toLowerCase()) || 
                    (est.uf || est.UF || '').toLowerCase().includes(estadoSearchTerm.toLowerCase())
                  ).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      Nenhum estado encontrado.
                    </div>
                  ) : (
                    estados.filter(est => 
                      est.estado?.toLowerCase().includes(estadoSearchTerm.toLowerCase()) || 
                      (est.uf || est.UF || '').toLowerCase().includes(estadoSearchTerm.toLowerCase())
                    ).map(est => {
                      const paisNome = est.pais?.pais || est.Pais?.pais || paises.find(p => p.codPais === est.codPais)?.pais || 'Não informado';
                      return (
                        <div key={est.codEstado} className="py-3 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                          <div>
                            <div className="font-medium text-sm text-gray-900">{est.estado} ({est.uf || est.UF || ''})</div>
                            <div className="text-xs text-gray-400 mt-0.5">País: {paisNome}</div>
                          </div>
                          <div className="flex gap-2 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleOpenEditEstado(est)}
                              className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-all"
                              title="Editar Estado"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectEstado(est.codEstado)}
                              className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium"
                            >
                              <Check size={14} /> Selecionar
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            
            {(estadoModalMode === 'create' || estadoModalMode === 'edit') && (
              <form onSubmit={handleEstadoSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome do Estado <span className="text-red-500">*</span></label>
                  <input 
                    name="estado" 
                    value={estadoData.estado} 
                    onChange={handleEstadoChange} 
                    required 
                    placeholder="Ex: São Paulo"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">UF <span className="text-red-500">*</span></label>
                  <input 
                    name="UF" 
                    value={estadoData.UF} 
                    onChange={handleEstadoChange} 
                    required 
                    maxLength={2} 
                    placeholder="Ex: SP"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all uppercase"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">País</label>
                  <div className="flex gap-2">
                    <select 
                      name="codPais" 
                      value={estadoData.codPais} 
                      onChange={handleEstadoChange}
                      className="flex-1 px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    >
                      <option value="">Selecione um país...</option>
                      {paises.map(p => (
                        <option key={p.codPais} value={p.codPais}>{p.pais}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleOpenPaisModal}
                      className="px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200"
                      title="Adicionar País"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button 
                    type="button" 
                    onClick={() => setEstadoModalMode('list')}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                  <button 
                    type="submit" 
                    disabled={loadingEstado}
                    className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} /> {loadingEstado ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {isPaisModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium text-gray-900">Novo País</h2>
              <button onClick={() => setIsPaisModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePaisSubmit} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Nome do País <span className="text-red-500">*</span></label>
                <input 
                  name="pais" value={paisData.pais} onChange={handlePaisChange} required placeholder="Ex: Brasil"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Sigla <span className="text-red-500">*</span></label>
                  <input 
                    name="sigla" value={paisData.sigla} onChange={handlePaisChange} required maxLength={3} placeholder="Ex: BRA"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all uppercase"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">DDI <span className="text-red-500">*</span></label>
                  <input 
                    name="ddi" value={paisData.ddi} onChange={handlePaisChange} required placeholder="Ex: +55"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Moeda <span className="text-red-500">*</span></label>
                <input 
                  name="moeda" value={paisData.moeda} onChange={handlePaisChange} required placeholder="Ex: BRL"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all uppercase"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-2">
                <button 
                  type="button" onClick={() => setIsPaisModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" disabled={loadingPais}
                  className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Save size={16} /> {loadingPais ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
