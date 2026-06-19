import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { estadosService } from '../../services/estadosService';
import { paisesService } from '../../services/paisesService';

export default function EditEstado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [paises, setPaises] = useState([]);
  
  const [formData, setFormData] = useState({
    estado: '',
    UF: '',
    codPais: ''
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      
      const [estadoData, paisesData] = await Promise.all([
        estadosService.getEstadoById(token, id),
        paisesService.getPaises(token)
      ]);

      setPaises(paisesData || []);

      if (estadoData) {
        setFormData({
          estado: estadoData.estado || '',
          UF: estadoData.uf || estadoData.UF || '',
          codPais: estadoData.codPais || ''
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Não foi possível carregar os dados deste estado.");
      navigate('/estados');
    } finally {
      setFetching(false);
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

      await estadosService.updateEstado(token, id, payload);
      navigate('/estados');
    } catch (error) {
      console.error("Erro ao atualizar estado:", error);
      alert("Erro ao salvar alterações.");
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Editar Estado</h1>
            <p className="text-sm text-gray-500 mt-1">Altere os dados do estado selecionado.</p>
          </div>

          {fetching ? (
             <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
               <Loader2 className="animate-spin text-gray-400" size={32} />
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Nome do Estado <span className="text-red-500">*</span></label>
                  <input 
                    name="estado" value={formData.estado} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">UF <span className="text-red-500">*</span></label>
                  <input 
                    name="UF" value={formData.UF} onChange={handleChange} required maxLength={2}
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all uppercase"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">País</label>
                  <select 
                    name="codPais" value={formData.codPais} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="">Selecione um país...</option>
                    {paises.map(p => (
                      <option key={p.codPais} value={p.codPais}>{p.pais}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t border-gray-100 pt-6">
                <button 
                  type="submit" disabled={loading}
                  className="flex items-center gap-2 bg-ink-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md disabled:opacity-50"
                >
                  <Save size={16} /> {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
