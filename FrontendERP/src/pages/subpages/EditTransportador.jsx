import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, Phone, MapPin, Building, Mail, Globe, Truck } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { transportadoresService } from '../../services/transportadoresService';
import { cidadesService } from '../../services/cidadesService';

export default function EditTransportador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cidades, setCidades] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    transportador: '',
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
    inscEstTransp: '',
    tipoPessoa: '',
    cpf_cnpjTransp: '',
    ativo: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Load options
    cidadesService.getCidades(token)
      .then(cidadesData => setCidades(cidadesData || []))
      .catch(err => console.error(err))
      .finally(() => setLoadingOptions(false));

    // Load Transportador
    const loadTransportador = async () => {
      try {
        const data = await transportadoresService.getTransportadorById(id);
        setFormData({
          transportador: data.transportador || '',
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
          inscEstTransp: data.inscEstTransp || '',
          tipoPessoa: data.tipoPessoa || '',
          cpf_cnpjTransp: data.cpf_cnpjTransp || '',
          ativo: data.ativo ?? true
        });
      } catch (error) {
        console.error('Erro ao carregar transportador:', error);
        alert('Transportador não encontrado');
        navigate('/Transportadores');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransportador();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await transportadoresService.updateTransportador(id, {
        ...formData,
        codCidade: formData.codCidade ? Number(formData.codCidade) : null,
      });
      navigate('/Transportadores');
    } catch (error) {
      console.error('Erro ao atualizar transportador:', error);
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
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-4xl mx-auto">

          <Link to="/Transportadores" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
            <ArrowLeft size={16} /> Voltar para Transportadores
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Editar Transportador</h1>
            <p className="text-sm text-gray-500 mt-1">Atualize os dados do transportador.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                <Truck size={14} className="text-gray-400" /> Dados Principais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Razão Social / Transportador <span className="text-red-500">*</span></label>
                  <input name="transportador" required value={formData.transportador} onChange={handleChange}
                    placeholder="Ex: Transportes Rapidos Ltda" className={inputClass} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome Fantasia / Apelido <span className="text-red-500">*</span></label>
                  <input name="apelido_NomeFantasia" required value={formData.apelido_NomeFantasia} onChange={handleChange}
                    placeholder="Ex: Rapido Transp" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Tipo de Pessoa <span className="text-red-500">*</span></label>
                  <select name="tipoPessoa" required value={formData.tipoPessoa} onChange={handleChange} className={selectClass}>
                    <option value="">Selecione</option>
                    <option value="F">Física</option>
                    <option value="J">Jurídica</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">CPF / CNPJ</label>
                  <input name="cpf_cnpjTransp" value={formData.cpf_cnpjTransp} onChange={handleChange}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Insc. Estadual de Transporte</label>
                  <input name="inscEstTransp" value={formData.inscEstTransp} onChange={handleChange}
                    placeholder="" className={inputClass} />
                </div>
                <div className="flex items-center gap-2 mt-8">
                  <input type="checkbox" id="ativo" name="ativo" checked={formData.ativo} onChange={handleChange} className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded" />
                  <label htmlFor="ativo" className="text-sm font-medium text-gray-700">Ativo</label>
                </div>
              </div>
            </div>

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

            <div className="flex gap-4">
              <Link to="/Transportadores" className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-center">
                Cancelar
              </Link>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {isSubmitting ? 'Salvando...' : 'Atualizar Transportador'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}
