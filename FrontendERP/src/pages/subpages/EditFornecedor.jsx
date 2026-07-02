import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, Phone, MapPin, Building, CreditCard, Mail, Globe } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { fornecedoresService } from '../../services/fornecedoresService';
import { cidadesService } from '../../services/cidadesService';

import { condicoesPagamentosService } from '../../services/condicoesPagamentosService';

export default function EditFornecedor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cidades, setCidades] = useState([]);
  const [condicoesPagamento, setCondicoesPagamento] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    fornecedor: '',
    apelido_NomeFantasia: '',
    ender: '',
    numero: '',
    complemento: '',
    bairro: '',
    cep: '',
    codCidade: '',
    site: '',
    fone: '',
    email: '',
    codCondPagamento: '',
    limiteCredito: '',
    rg_inscEst: '',
    tipoPessoa: '',
    cpf_cnpj: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Load Cidades and Condicoes
    Promise.all([
      cidadesService.getCidades(token),
      condicoesPagamentosService.getCondicoesPagamentos(token)
    ])
      .then(([cidadesData, condicoesData]) => {
        setCidades(cidadesData || []);
        setCondicoesPagamento(condicoesData || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingOptions(false));

    // Load Fornecedor Data
    if (id) {
      fornecedoresService.getFornecedorById(id)
        .then(data => {
          setFormData({
            fornecedor: data.fornecedor || '',
            apelido_NomeFantasia: data.apelido_NomeFantasia || '',
            ender: data.ender || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cep: data.cep || '',
            codCidade: data.codCidade || '',
            site: data.site || '',
            fone: data.fone || '',
            email: data.email || '',
            codCondPagamento: data.codCondPagamento || '',
            limiteCredito: data.limiteCredito || '',
            rg_inscEst: data.rg_inscEst || '',
            tipoPessoa: data.tipoPessoa || '',
            cpf_cnpj: data.cpf_cnpj || '',
          });
        })
        .catch(error => {
          console.error("Erro ao carregar fornecedor:", error);
          alert("Não foi possível carregar os dados deste fornecedor.");
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
      await fornecedoresService.updateFornecedor(id, {
        ...formData,
        codForn: Number(id), // Backend usually expects the ID in the body for updates
        codCidade: formData.codCidade ? Number(formData.codCidade) : null,
        codCondPagamento: formData.codCondPagamento ? Number(formData.codCondPagamento) : null,
        limiteCredito: formData.limiteCredito ? Number(formData.limiteCredito) : 0,
      });
      navigate('/Fornecedores');
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all';
  const selectClass = `${inputClass} appearance-none`;

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
        <div className="max-w-4xl mx-auto">

          <Link to="/Fornecedores" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
            <ArrowLeft size={16} /> Voltar para Fornecedores
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Editar Fornecedor</h1>
            <p className="text-sm text-gray-500 mt-1">Atualize os dados deste fornecedor.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Dados Principais */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                <Building size={14} className="text-gray-400" /> Dados Principais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Razão Social / Fornecedor <span className="text-red-500">*</span></label>
                  <input name="fornecedor" required value={formData.fornecedor} onChange={handleChange}
                    placeholder="Ex: Fornecedor Ltda" className={inputClass} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome Fantasia / Apelido</label>
                  <input name="apelido_NomeFantasia" value={formData.apelido_NomeFantasia} onChange={handleChange}
                    placeholder="Ex: Fornecedor" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Tipo de Pessoa</label>
                  <select name="tipoPessoa" value={formData.tipoPessoa} onChange={handleChange} className={selectClass}>
                    <option value="">Selecione</option>
                    <option value="F">Física</option>
                    <option value="J">Jurídica</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><CreditCard size={13} className="text-gray-400" />CPF / CNPJ</label>
                  <input name="cpf_cnpj" value={formData.cpf_cnpj} onChange={handleChange}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">RG / Insc. Estadual</label>
                  <input name="rg_inscEst" value={formData.rg_inscEst} onChange={handleChange}
                    placeholder="" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                <Phone size={14} className="text-gray-400" /> Contato
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Mail size={13} className="text-gray-400" />Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="contato@empresa.com" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Phone size={13} className="text-gray-400" />Telefone</label>
                  <input name="fone" value={formData.fone} onChange={handleChange}
                    placeholder="(00) 90000-0000" className={inputClass} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Globe size={13} className="text-gray-400" />Site</label>
                  <input name="site" value={formData.site} onChange={handleChange}
                    placeholder="https://www.empresa.com.br" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                <MapPin size={14} className="text-gray-400" /> Endereço
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Logradouro</label>
                  <input name="ender" value={formData.ender} onChange={handleChange} placeholder="Rua, Av..." className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Número</label>
                  <input name="numero" value={formData.numero} onChange={handleChange} placeholder="123" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Complemento</label>
                  <input name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto, Sala..." className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Bairro</label>
                  <input name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Bairro" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">CEP</label>
                  <input name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" maxLength={9} className={inputClass} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Cidade</label>
                  <div className="relative">
                    <select name="codCidade" value={formData.codCidade} onChange={handleChange}
                      disabled={loadingOptions}
                      className={`${selectClass} pr-10 ${loadingOptions ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      <option value="">{loadingOptions ? 'Carregando...' : 'Selecione uma cidade'}</option>
                      {cidades.map(c => <option key={c.codCidade} value={c.codCidade}>{c.cidade}{c.estado?.UF ? ` - ${c.estado.UF}` : ''}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comercial */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                <CreditCard size={14} className="text-gray-400" /> Comercial
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Condição de Pagamento</label>
                  <div className="relative">
                    <select name="codCondPagamento" value={formData.codCondPagamento} onChange={handleChange}
                      disabled={loadingOptions}
                      className={`${selectClass} pr-10 ${loadingOptions ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      <option value="">{loadingOptions ? 'Carregando...' : 'Selecione uma condição'}</option>
                      {condicoesPagamento.map(c => <option key={c.codCondPagamento} value={c.codCondPagamento}>{c.condPagamento}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Limite de Crédito</label>
                  <input type="number" step="0.01" name="limiteCredito" value={formData.limiteCredito} onChange={handleChange} placeholder="0.00" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link to="/Fornecedores" className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-center">
                Cancelar
              </Link>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
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
