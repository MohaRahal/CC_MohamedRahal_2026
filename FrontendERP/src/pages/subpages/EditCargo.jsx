import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { cargosService } from '../../services/cargosService';

export default function EditCargo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    cargo: ''
  });

  useEffect(() => {
    loadCargo();
  }, [id]);

  const loadCargo = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      const data = await cargosService.getCargoById(token, id);
      if (data) {
        setFormData({
          cargo: data.cargo || ''
        });
      }
    } catch (error) {
      console.error("Erro ao buscar cargo:", error);
      alert("Não foi possível carregar os dados deste cargo.");
      navigate('/cargos');
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
      await cargosService.updateCargo(token, id, formData);
      navigate('/cargos');
    } catch (error) {
      console.error("Erro ao atualizar cargo:", error);
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
            onClick={() => navigate('/cargos')}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Voltar para Cargos
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Editar Cargo</h1>
            <p className="text-sm text-gray-500 mt-1">Altere os dados do cargo selecionado.</p>
          </div>

          {fetching ? (
             <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
               <Loader2 className="animate-spin text-gray-400" size={32} />
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Nome do Cargo <span className="text-red-500">*</span></label>
                <input 
                  name="cargo" value={formData.cargo} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
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
