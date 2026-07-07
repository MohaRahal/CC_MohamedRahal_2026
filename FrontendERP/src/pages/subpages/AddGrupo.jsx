import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { gruposService } from '../../services/gruposService';

export default function AddGrupo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    grupo: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await gruposService.createGrupo(formData);
      navigate('/Grupos');
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      alert("Erro ao criar grupo. Verifique se os dados estão corretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-2xl mx-auto">
          <Link to="/Grupos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
            <ArrowLeft size={16} /> Voltar para Grupos
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Novo Grupo</h1>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo para cadastrar.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Nome do Grupo <span className="text-red-500">*</span></label>
                <input 
                  name="grupo" 
                  value={formData.grupo} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ex: Eletrônicos"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4 border-t border-gray-100 pt-6">
              <Link
                to="/Grupos"
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Cancelar
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-70"
              >
                <Save size={16} /> {loading ? 'Salvando...' : 'Salvar Grupo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}
