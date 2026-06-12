import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { usersService } from '../../services/usersService';

export default function AddUser() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    senha: '',
    roleId: 2,
    ativo: true
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await usersService.createUser(formData);
      navigate('/Usuarios');
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Senha Provisória</label>
                  <input 
                    type="password"
                    required
                    value={formData.senha}
                    onChange={e => setFormData({...formData, senha: e.target.value})}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Acesso</label>
                  <div className="relative">
                    <select 
                      value={formData.roleId}
                      onChange={e => setFormData({...formData, roleId: Number(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all appearance-none"
                    >
                      <option value={2}>Usuário Padrão</option>
                      <option value={1}>Administrador</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 block">Status da Conta</h4>
                  <p className="text-xs text-gray-500 mt-1">Contas inativas não conseguem fazer login no sistema.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, ativo: !formData.ativo})}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.ativo ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.ativo ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="mt-4 flex gap-4 pt-6 border-t border-gray-100">
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
