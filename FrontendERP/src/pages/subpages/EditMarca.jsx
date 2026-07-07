import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { marcasService } from '../../services/marcasService';

export default function EditMarca() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    marca: '',
  });

  useEffect(() => {
    if (id) {
      marcasService.getMarcaById(id)
        .then(data => {
          setFormData({
            marca: data.marca || '',
          });
        })
        .catch(error => {
          console.error("Erro ao carregar marca:", error);
          alert("Não foi possível carregar os dados desta marca.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await marcasService.updateMarca(id, {
        ...formData,
        codMarca: Number(id),
      });
      navigate('/Marcas');
    } catch (error) {
      console.error('Erro ao atualizar marca:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all';

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 flex justify-center items-center">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-2xl mx-auto">

          <Link to="/Marcas" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
            <ArrowLeft size={16} /> Voltar para Marcas
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Editar Marca</h1>
            <p className="text-sm text-gray-500 mt-1">Atualize os dados desta marca.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Nome da Marca <span className="text-red-500">*</span></label>
                <input
                  name="marca" required value={formData.marca} onChange={handleChange}
                  placeholder="Ex: Nike"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 border-t border-gray-100 pt-6">
              <Link
                to="/Marcas"
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit" disabled={isSubmitting}
                className="cursor-pointer flex-1 px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}
