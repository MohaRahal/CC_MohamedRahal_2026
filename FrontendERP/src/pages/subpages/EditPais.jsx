import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { paisesService } from '../../services/paisesService';

export default function EditPais() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    pais: '',
    sigla: '',
    ddi: '',
    moeda: ''
  });

  useEffect(() => {
    loadPais();
  }, [id]);

  const loadPais = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      const data = await paisesService.getPaisById(token, id);
      if (data) {
        setFormData({
          pais: data.pais || '',
          sigla: data.sigla || '',
          ddi: data.ddi || '',
          moeda: data.moeda || ''
        });
      }
    } catch (error) {
      console.error("Erro ao buscar país:", error);
      alert("Não foi possível carregar os dados deste país.");
      navigate('/paises');
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
      await paisesService.updatePais(token, id, formData);
      navigate('/paises');
    } catch (error) {
      console.error("Erro ao atualizar país:", error);
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
            onClick={() => navigate('/paises')}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Voltar para Países
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Editar País</h1>
            <p className="text-sm text-gray-500 mt-1">Altere os dados do país selecionado.</p>
          </div>

          {fetching ? (
             <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
               <Loader2 className="animate-spin text-gray-400" size={32} />
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Nome do País <span className="text-red-500">*</span></label>
                  <input 
                    name="pais" value={formData.pais} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Sigla</label>
                  <input 
                    name="sigla" value={formData.sigla} onChange={handleChange} maxLength={3}
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">DDI</label>
                  <input 
                    name="ddi" value={formData.ddi} onChange={handleChange} maxLength={5}
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Moeda</label>
                  <input 
                    name="moeda" value={formData.moeda} onChange={handleChange} maxLength={50}
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
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
