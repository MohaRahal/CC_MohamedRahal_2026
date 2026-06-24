import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { formasPagamentoService } from '../../services/formasPagamentoService';

export default function AddFormasPagamento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    formaPagamento: '',
    ativo: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        ...formData,
        ativo: formData.ativo === 'true' ? true : formData.ativo === 'false' ? false : null,
      };

      await formasPagamentoService.createFormaPagamento(token, payload);
      navigate('/formas-pagamento');
    } catch (error) {
      console.error("Erro ao criar forma de pagamento:", error);
      alert("Erro ao criar forma de pagamento. Verifique se os dados estão corretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => navigate('/formas-pagamento')}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Voltar para Formas de Pagamento
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Nova Forma de Pagamento</h1>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo para cadastrar.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Nome da Forma de Pagamento <span className="text-red-500">*</span></label>
                <input 
                  name="formaPagamento" value={formData.formaPagamento} onChange={handleChange} required placeholder="Ex: Dinheiro"
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Ativo</label>
                <select 
                  name="ativo" value={formData.ativo} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                >
                  <option value="">Selecione...</option>
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>   
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-gray-100 pt-6">
              <button 
                type="submit" disabled={loading}
                className="flex items-center gap-2 bg-ink-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md disabled:opacity-50"
              >
                <Save size={16} /> {loading ? 'Salvando...' : 'Salvar Forma de Pagamento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}
