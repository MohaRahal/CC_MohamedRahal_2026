import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Check, User, Lock, Briefcase, ShieldCheck, UserRoundCheck } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { usersService } from '../../services/usersService';
import { cargosService } from '../../services/cargosService';
import { funcionariosService } from '../../services/funcionariosService';

export default function AddUser() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cargos, setCargos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loadingCargos, setLoadingCargos] = useState(true);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(true);

  const [formData, setFormData] = useState({
    usuario: '',
    senha: '',
    codCargo: '',
    codFuncionario: '',
    ativo: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    cargosService.getCargos(token)
      .then(data => {
        const list = data || [];
        setCargos(list);
        if (list.length > 0) {
          setFormData(prev => ({ ...prev, codCargo: list[0].codCargo }));
        }
      })
      .catch(err => console.error('Erro ao carregar cargos:', err))
      .finally(() => setLoadingCargos(false));

    funcionariosService.getFuncionarios()
      .then(data => setFuncionarios(data || []))
      .catch(err => console.error('Erro ao carregar funcionários:', err))
      .finally(() => setLoadingFuncionarios(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await usersService.createUser({
        usuario: formData.usuario,
        senha: formData.senha,
        codCargo: Number(formData.codCargo),
        codFuncionario: formData.codFuncionario ? Number(formData.codFuncionario) : 0,
        ativo: formData.ativo,
      });
      navigate('/Usuarios');
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all';

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-2xl mx-auto">

          <div className="mb-8">
            <Link to="/Usuarios" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
              <ArrowLeft size={16} />
              Voltar para Usuários
            </Link>
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Novo Usuário</h1>
            <p className="text-sm text-gray-500 mt-1">Cadastre um novo membro da equipe com suas permissões de acesso.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <form onSubmit={handleCreateUser} className="p-8 flex flex-col gap-6">

              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User size={14} className="text-gray-400" />
                  Nome de Usuário <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="usuario"
                  required
                  value={formData.usuario}
                  onChange={handleChange}
                  placeholder="Ex: João Silva"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Senha */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Lock size={14} className="text-gray-400" />
                    Senha Provisória <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="senha"
                    required
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </div>

                {/* Cargo dinâmico */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Briefcase size={14} className="text-gray-400" />
                    Cargo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="codCargo"
                      required
                      value={formData.codCargo}
                      onChange={handleChange}
                      disabled={loadingCargos}
                      className={`${inputClass} appearance-none pr-10 ${loadingCargos ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <option value="" disabled>
                        {loadingCargos ? 'Carregando cargos...' : 'Selecione um cargo'}
                      </option>
                      {cargos.map(c => (
                        <option key={c.codCargo} value={c.codCargo}>
                          {c.cargo}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      {loadingCargos
                        ? <Loader2 size={14} className="animate-spin text-gray-400" />
                        : <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Funcionário */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <UserRoundCheck size={14} className="text-gray-400" />
                  Funcionário Vinculado
                </label>
                <div className="relative">
                  <select
                    name="codFuncionario"
                    value={formData.codFuncionario}
                    onChange={handleChange}
                    disabled={loadingFuncionarios}
                    className={`${inputClass} appearance-none pr-10 ${loadingFuncionarios ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <option value="">{loadingFuncionarios ? 'Carregando...' : 'Selecione um funcionário'}</option>
                    {funcionarios.map(f => (
                      <option key={f.codFuncionario} value={f.codFuncionario}>
                        {f.funcionario}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    {loadingFuncionarios
                      ? <Loader2 size={14} className="animate-spin text-gray-400" />
                      : <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    }
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-gray-400" />
                    <h4 className="text-sm font-medium text-gray-900">Status da Conta</h4>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-5">Contas inativas não conseguem fazer login no sistema.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${formData.ativo ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, ativo: !prev.ativo }))}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.ativo ? 'bg-black' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.ativo ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-2 flex gap-4 pt-6 border-t border-gray-100">
                <Link
                  to="/Usuarios"
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {isSubmitting ? 'Salvando...' : 'Finalizar Cadastro'}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </AnimatedPage>
  );
}
