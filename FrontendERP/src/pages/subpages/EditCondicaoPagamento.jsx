import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { condicoesPagamentosService } from '../../services/condicoesPagamentosService';

export default function EditCondicaoPagamento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    condPagamento: '',
    qtdParcelas: '',
    ativo: 'true',
    juros: '',
    multa: '',
    desconto: ''
  });

  useEffect(() => {
    fetchCondicao();
  }, [id]);

  const fetchCondicao = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await condicoesPagamentosService.getCondicaoPagamento(token, id);
      if (data) {
        setFormData({
          condPagamento: data.condPagamento || '',
          qtdParcelas: data.qtdParcelas?.toString() || '',
          ativo: data.ativo ? 'true' : 'false',
          juros: data.juros?.toString() || '',
          multa: data.multa?.toString() || '',
          desconto: data.desconto?.toString() || ''
        });
      }
    } catch (error) {
      console.error("Erro ao carregar condição de pagamento:", error);
      alert("Erro ao carregar dados. Redirecionando...");
      navigate('/condicoes-pagamento');
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
        condPagamento: formData.condPagamento,
        qtdParcelas: formData.qtdParcelas ? parseInt(formData.qtdParcelas, 10) : 0,
        ativo: formData.ativo === 'true',
        juros: formData.juros ? parseFloat(formData.juros) : 0,
        multa: formData.multa ? parseFloat(formData.multa) : 0,
        desconto: formData.desconto ? parseFloat(formData.desconto) : 0
      };

      await condicoesPagamentosService.updateCondicaoPagamento(token, id, payload);
      navigate('/condicoes-pagamento');
    } catch (error) {
      console.error("Erro ao atualizar condição de pagamento:", error);
      alert("Erro ao atualizar condição de pagamento. Verifique se os dados estão corretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate('/condicoes-pagamento')}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Voltar para Condições de Pagamento
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Editar Condição de Pagamento</h1>
            <p className="text-sm text-gray-500 mt-1">Atualize os dados abaixo e salve.</p>
          </div>

          {fetching ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Nome da Condição de Pagamento <span className="text-red-500">*</span></label>
                  <input 
                    name="condPagamento" value={formData.condPagamento} onChange={handleChange} required placeholder="Ex: 30/60/90 Dias"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Qtd de Parcelas <span className="text-red-500">*</span></label>
                  <input 
                    type="number" name="qtdParcelas" value={formData.qtdParcelas} onChange={handleChange} required placeholder="Ex: 3"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Ativo</label>
                  <select 
                    name="ativo" value={formData.ativo} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>   
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Juros (%)</label>
                  <input 
                    type="number" step="0.01" name="juros" value={formData.juros} onChange={handleChange} placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Multa (%)</label>
                  <input 
                    type="number" step="0.01" name="multa" value={formData.multa} onChange={handleChange} placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Desconto (%)</label>
                  <input 
                    type="number" step="0.01" name="desconto" value={formData.desconto} onChange={handleChange} placeholder="0.00"
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
