import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { estadosService } from '../../services/estadosService';
import { paisesService } from '../../services/paisesService';

export default function AddEstado() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paises, setPaises] = useState([]);
  const [formData, setFormData] = useState({
    estado: '',
    UF: '',
    codPais: ''
  });

  // Modal Pais
  const [isPaisModalOpen, setIsPaisModalOpen] = useState(false);
  const [loadingPais, setLoadingPais] = useState(false);
  const [paisData, setPaisData] = useState({
    pais: '',
    sigla: '',
    ddi: '',
    moeda: ''
  });

  useEffect(() => {
    loadPaises();
  }, []);

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
        estado: formData.estado,
        UF: formData.UF,
        codPais: formData.codPais ? parseInt(formData.codPais) : null
      };

      await estadosService.createEstado(token, payload);
      navigate('/estados');
    } catch (error) {
      console.error("Erro ao criar estado:", error);
      alert("Erro ao criar estado. Verifique se os dados estão corretos.");
    } finally {
      setLoading(false);
    }
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
        setFormData({ ...formData, codPais: novoPais.codPais.toString() });
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
            onClick={() => navigate('/estados')}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Voltar para Estados
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Novo Estado</h1>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo para cadastrar.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Nome do Estado <span className="text-red-500">*</span></label>
                <input 
                  name="estado" value={formData.estado} onChange={handleChange} required placeholder="Ex: São Paulo"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">UF <span className="text-red-500">*</span></label>
                <input 
                  name="UF" value={formData.UF} onChange={handleChange} required maxLength={2} placeholder="Ex: SP"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all uppercase"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">País</label>
                <div className="flex gap-2">
                  <select 
                    name="codPais" value={formData.codPais} onChange={handleChange}
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
            </div>

            <div className="mt-6 flex justify-end border-t border-gray-100 pt-6">
              <button 
                type="submit" disabled={loading}
                className="flex items-center gap-2 bg-ink-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md disabled:opacity-50"
              >
                <Save size={16} /> {loading ? 'Salvando...' : 'Salvar Estado'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Novo Pais */}
      {isPaisModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
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
