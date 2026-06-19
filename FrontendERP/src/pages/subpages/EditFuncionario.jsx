import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, User, Phone, MapPin, Briefcase, CreditCard, Calendar } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { funcionariosService } from '../../services/funcionariosService';
import { cargosService } from '../../services/cargosService';
import { cidadesService } from '../../services/cidadesService';

export default function EditFuncionario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cargos, setCargos] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    funcionario: '',
    cpf: '',
    data_nascimento: '',
    sexo: '',
    codCargo: '',
    fone: '',
    ender: '',
    numero: '',
    complemento: '',
    bairro: '',
    codCidade: '',
    cep: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Load options (cargos + cidades) in parallel with the funcionario data
    Promise.all([
      cargosService.getCargos(token),
      cidadesService.getCidades(token),
    ]).then(([cargosData, cidadesData]) => {
      setCargos(cargosData || []);
      setCidades(cidadesData || []);
    }).catch(err => console.error(err))
      .finally(() => setLoadingOptions(false));

    funcionariosService.getFuncionarioById(id)
      .then(data => {
        if (data) {
          setFormData({
            funcionario:     data.funcionario || '',
            cpf:             data.cpf || '',
            data_nascimento: data.data_nascimento || '',
            sexo:            data.sexo || '',
            codCargo:        data.codCargo ?? '',
            fone:            data.fone || '',
            ender:           data.ender || '',
            numero:          data.numero || '',
            complemento:     data.complemento || '',
            bairro:          data.bairro || '',
            codCidade:       data.codCidade ?? '',
            cep:             data.cep || '',
          });
        }
      })
      .catch(err => {
        console.error('Erro ao buscar funcionário:', err);
        alert('Não foi possível carregar os dados deste funcionário.');
        navigate('/funcionarios');
      })
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await funcionariosService.updateFuncionario(id, {
        ...formData,
        codCargo: formData.codCargo ? Number(formData.codCargo) : undefined,
        codCidade: formData.codCidade ? Number(formData.codCidade) : undefined,
      });
      navigate('/funcionarios');
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      alert(error.message || 'Erro ao salvar alterações.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all';
  const selectClass = `${inputClass} appearance-none pr-10`;

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-3xl mx-auto">

          <Link to="/funcionarios" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
            <ArrowLeft size={16} /> Voltar para Funcionários
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Editar Funcionário</h1>
            <p className="text-sm text-gray-500 mt-1">Altere os dados do funcionário selecionado.</p>
          </div>

          {fetching ? (
            <div className="flex justify-center items-center py-28 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Dados pessoais */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6">
                  <User size={14} className="text-gray-400" /> Dados Pessoais
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Nome Completo <span className="text-red-500">*</span></label>
                    <input name="funcionario" required value={formData.funcionario} onChange={handleChange}
                      placeholder="Ex: João da Silva" className={inputClass} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CreditCard size={13} className="text-gray-400" /> CPF
                    </label>
                    <input name="cpf" value={formData.cpf} onChange={handleChange}
                      placeholder="000.000.000-00" maxLength={14} className={inputClass} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar size={13} className="text-gray-400" /> Data de Nascimento
                    </label>
                    <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange}
                      className={inputClass} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Sexo</label>
                    <div className="relative">
                      <select name="sexo" value={formData.sexo} onChange={handleChange} className={selectClass}>
                        <option value="">Selecione</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="O">Outro</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Briefcase size={13} className="text-gray-400" /> Cargo <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select name="codCargo" required value={formData.codCargo} onChange={handleChange}
                        disabled={loadingOptions}
                        className={`${selectClass} ${loadingOptions ? 'opacity-60 cursor-not-allowed' : ''}`}>
                        <option value="" disabled>{loadingOptions ? 'Carregando...' : 'Selecione um cargo'}</option>
                        {cargos.map(c => (
                          <option key={c.codCargo} value={c.codCargo}>{c.cargo}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        {loadingOptions
                          ? <Loader2 size={13} className="animate-spin text-gray-400" />
                          : <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone size={13} className="text-gray-400" /> Telefone
                    </label>
                    <input name="fone" value={formData.fone} onChange={handleChange}
                      placeholder="(00) 90000-0000" className={inputClass} />
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
                        className={`${selectClass} ${loadingOptions ? 'opacity-60 cursor-not-allowed' : ''}`}>
                        <option value="">{loadingOptions ? 'Carregando...' : 'Selecione uma cidade'}</option>
                        {cidades.map(c => (
                          <option key={c.codCidade} value={c.codCidade}>
                            {c.cidade}{c.estado?.UF ? ` - ${c.estado.UF}` : ''}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Link to="/funcionarios"
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-center">
                  Cancelar
                </Link>
                <button type="submit" disabled={loading}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
