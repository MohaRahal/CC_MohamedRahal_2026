import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { cidadesService } from '../../services/cidadesService';
import { estadosService } from '../../services/estadosService';

export default function AddCidade() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [formData, setFormData] = useState({
    cidade: '',
    codEstado: ''
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
                <select 
                  name="codEstado" value={formData.codEstado} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                >
                  <option value="">Selecione um estado...</option>
                  {estados.map(e => (
                    <option key={e.codEstado} value={e.codEstado}>
                      {e.estado} ({e.uf || e.UF || ''})
                    </option>
                  ))}
                </select>
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
    </AnimatedPage>
  );
}
