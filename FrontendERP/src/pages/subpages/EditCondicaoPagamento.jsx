import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { condicoesPagamentosService } from '../../services/condicoesPagamentosService';
import { formasPagamentoService } from '../../services/formasPagamentoService';

export default function EditCondicaoPagamento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formasPagamento, setFormasPagamento] = useState([]);

  const [formData, setFormData] = useState({
    condPagamento: '',
    ativo: 'true',
    juros: '',
    multa: '',
    desconto: ''
  });

  const [parcelas, setParcelas] = useState([]);

  useEffect(() => {
    const fetchFormas = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await formasPagamentoService.getFormasPagamento(token);
        setFormasPagamento(data || []);
      } catch (error) {
        console.error("Erro ao buscar formas de pagamento:", error);
      }
    };
    fetchFormas();
  }, []);

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
          ativo: data.ativo ? 'true' : 'false',
          juros: data.juros?.toString() || '',
          multa: data.multa?.toString() || '',
          desconto: data.desconto?.toString() || ''
        });

        let parcelasExistentes = [];

        if (Array.isArray(data.parcelas) && data.parcelas.length > 0) {
          // Backend retornou o detalhe das parcelas
          parcelasExistentes = data.parcelas.map(p => ({
            diasVencimento: p.diasVencimento?.toString() || '',
            formaPagamentoId: (p.codFormaPagamento ?? p.formaPagamentoId)?.toString() || '',
            percentual: p.percentual?.toString() || '',
            manuallyEdited: true // Keep database ones marked as manually edited
          }));
        } else if (data.qtdParcelas) {
          // Backend só retornou a quantidade: cria a mesma quantidade de linhas,
          // já com o percentual dividido igualmente, para o campo "Qtd de Parcelas" vir preenchido
          const qtd = parseInt(data.qtdParcelas, 10) || 0;
          const per = qtd > 0 ? (100 / qtd).toFixed(2) : '';
          parcelasExistentes = Array.from({ length: qtd }, () => ({
            diasVencimento: '',
            formaPagamentoId: '',
            percentual: per,
            manuallyEdited: false
          }));
        }

        setParcelas(parcelasExistentes);
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

  const recalculatePercentages = (listaParcelas) => {
    if (listaParcelas.length === 0) return;
    
    // Count how many are manually edited and their total percentage
    const manuallyEditedParcelas = listaParcelas.filter(p => p.manuallyEdited);
    const nonEditedCount = listaParcelas.length - manuallyEditedParcelas.length;
    
    const totalManuallyEdited = manuallyEditedParcelas.reduce((acc, p) => acc + (parseFloat(p.percentual) || 0), 0);
    const remainingPercent = Math.max(0, 100 - totalManuallyEdited);
    
    if (nonEditedCount > 0) {
      const per = (remainingPercent / nonEditedCount).toFixed(2);
      listaParcelas.forEach(p => {
        if (!p.manuallyEdited) {
          p.percentual = per;
        }
      });
    }
  };

  const handleAddParcela = () => {
    const novasParcelas = [...parcelas, { diasVencimento: '', formaPagamentoId: '', percentual: '', manuallyEdited: false }];
    recalculatePercentages(novasParcelas);
    setParcelas(novasParcelas);
  };

  const handleParcelaChange = (index, field, value) => {
    const novasParcelas = [...parcelas];
    novasParcelas[index][field] = value;
    if (field === 'percentual') {
      novasParcelas[index].manuallyEdited = true;
    }
    setParcelas(novasParcelas);
  };

  const handleRemoveParcela = (index) => {
    const novasParcelas = parcelas.filter((_, i) => i !== index);
    recalculatePercentages(novasParcelas);
    setParcelas(novasParcelas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (parcelas.length === 0) {
      alert("Adicione pelo menos uma parcela para a condição de pagamento.");
      setLoading(false);
      return;
    }

    const totalPercentual = parcelas.reduce((acc, p) => acc + (parseFloat(p.percentual) || 0), 0);
    if (Math.abs(totalPercentual - 100) >= 0.01) {
      alert(`A soma dos percentuais das parcelas deve ser exatamente 100%. O total atual é ${totalPercentual.toFixed(2)}%.`);
      setLoading(false);
      return;
    }

    // Validar se os dias de vencimento são crescentes
    for (let i = 1; i < parcelas.length; i++) {
      const diasAtual = parseInt(parcelas[i].diasVencimento, 10);
      const diasAnterior = parseInt(parcelas[i - 1].diasVencimento, 10);
      
      if (isNaN(diasAtual) || isNaN(diasAnterior)) {
        alert("Preencha todos os campos de dias para vencimento.");
        setLoading(false);
        return;
      }
      
      if (diasAtual <= diasAnterior) {
        alert(`O prazo de vencimento da parcela ${i + 1} (${diasAtual} dias) não pode ser menor ou igual ao da parcela ${i} (${diasAnterior} dias).`);
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');

      const payload = {
        condPagamento: formData.condPagamento,
        qtdParcelas: parcelas.length,
        ativo: formData.ativo === 'true',
        juros: formData.juros ? parseFloat(formData.juros) : 0,
        multa: formData.multa ? parseFloat(formData.multa) : 0,
        desconto: formData.desconto ? parseFloat(formData.desconto) : 0,
        parcelas: parcelas.map(p => ({
          diasVencimento: parseInt(p.diasVencimento, 10) || 0,
          codFormaPagamento: parseInt(p.formaPagamentoId, 10),
          percentual: parseFloat(p.percentual) || 0
        }))
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

  const totalPercentual = parcelas.reduce((acc, p) => acc + (parseFloat(p.percentual) || 0), 0);

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/condicoes-pagamento')}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6 cursor-pointer"
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
                  <label className="text-sm font-medium text-gray-700">Qtd de Parcelas</label>
                  <input
                    type="number" value={parcelas.length} readOnly disabled
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
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

              {/* Seção de Parcelas antes do botão enviar */}
              <div className="mt-4 pt-6 border-t border-gray-100 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">Configuração de Parcelas</h3>
                  <button
                    type="button"
                    onClick={handleAddParcela}
                    className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all cursor-pointer"
                  >
                    <Plus size={16} /> Nova Parcela
                  </button>
                </div>

                {parcelas.length === 0 ? (
                  <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg text-center border border-dashed border-gray-200">
                    Nenhuma parcela adicionada. Clique em "Nova Parcela" para começar.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {parcelas.map((parcela, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-4 items-end bg-[#fafafa] p-4 rounded-lg border border-gray-100">
                        <div className="flex flex-col gap-2 flex-1 w-full md:w-auto">
                          <label className="text-sm font-medium text-gray-700">Dias p/ Vencimento <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            value={parcela.diasVencimento}
                            onChange={(e) => handleParcelaChange(idx, 'diasVencimento', e.target.value)}
                            required
                            min="0"
                            placeholder="Ex: 30"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                          />
                        </div>

                        <div className="flex flex-col gap-2 flex-1 w-full md:w-auto">
                          <label className="text-sm font-medium text-gray-700">Forma de Pagamento <span className="text-red-500">*</span></label>
                          <select
                            value={parcela.formaPagamentoId}
                            onChange={(e) => handleParcelaChange(idx, 'formaPagamentoId', e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                          >
                            <option value="">Selecione...</option>
                            {formasPagamento.map(fp => (
                              <option key={fp.codFormaPagamento || fp.id} value={fp.codFormaPagamento || fp.id}>
                                {fp.formaPagamento || fp.descricao}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-2 flex-1 w-full md:w-auto">
                          <label className="text-sm font-medium text-gray-700">Percentual (%) <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            step="0.01"
                            value={parcela.percentual}
                            onChange={(e) => handleParcelaChange(idx, 'percentual', e.target.value)}
                            required
                            min="0"
                            max="100"
                            placeholder="33.33"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveParcela(idx)}
                          className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0 mb-px cursor-pointer"
                          title="Remover Parcela"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}

                    {/* Resumo da soma dos percentuais */}
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm mt-2">
                      <span className="font-medium text-gray-700">Total dos Percentuais:</span>
                      <span className={`font-semibold text-base ${Math.abs(totalPercentual - 100) < 0.01 ? 'text-green-600' : 'text-amber-600'}`}>
                        {totalPercentual.toFixed(2)}% {Math.abs(totalPercentual - 100) >= 0.01 && '(Deve somar 100.00%)'}
                      </span>
                    </div>

                  </div>
                )}
              </div>

              <div className="mt-2 flex justify-end pt-6">
                <button
                  type="submit" disabled={loading}
                  className="flex items-center gap-2 bg-ink-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md disabled:opacity-50 cursor-pointer"
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