import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, LockKeyhole, UserRound } from 'lucide-react';
import AnimatedPage from './AnimatedPage';

export default function Login() {
  const [name, setName] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: name, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.mensagem || 'Usuário ou senha inválidos.');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      navigate('/dashboard');
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <main className="relative min-h-screen overflow-hidden bg-cream-paper px-5 py-5 font-inter text-ink-black sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -left-24 bottom-[-180px] h-[430px] w-[430px] rounded-full bg-sunshine-pop" />
        <div className="pointer-events-none absolute left-[44%] top-14 h-20 w-20 rounded-full bg-sky-pop" />
        <div className="pointer-events-none absolute left-[38%] top-[55%] h-28 w-28 rotate-12 rounded-[32px] bg-coral-pop" />

        <div className="relative mx-auto grid min-h-[calc(100vh-40px)] max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[1fr_480px] lg:items-stretch">
          <section className="flex min-h-[460px] flex-col justify-between py-3 lg:min-h-0 lg:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-ink-black text-sm font-medium text-white">I</div>
              <div>
                <p className="text-[15px] font-medium">Integra ERP</p>
                <p className="text-xs text-stone-gray">Gestão simples, decisões melhores.</p>
              </div>
            </div>

            <div className="relative z-10 max-w-[850px] py-16 lg:py-8">
              <p className="mb-5 text-sm font-medium text-stone-gray">Seu espaço de trabalho</p>
              <h1 className="text-[clamp(66px,9vw,140px)] font-medium leading-[0.9] tracking-[-0.065em]">
                Seu negócio,<br />mais leve.
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-stone-gray">
                Controle clientes, estoque e operações em um ambiente organizado, humano e fácil de usar.
              </p>
            </div>

            <p className="text-xs text-stone-gray">Integra One · Sistema de gestão empresarial</p>
          </section>

          <section className="flex items-center rounded-[50px] bg-white p-7 sm:p-10 lg:p-12">
            <form onSubmit={handleLogin} className="w-full">
              <div className="mb-12">
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-fresh-grass">
                  <UserRound size={21} strokeWidth={1.8} />
                </div>
                <p className="text-sm text-stone-gray">Bem-vindo de volta</p>
                <h2 className="mt-2 text-[clamp(42px,5vw,58px)] font-medium leading-none tracking-[-0.045em]">Entrar</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-stone-gray">Use seus dados para acessar o sistema.</p>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-medium text-stone-gray">
                    <UserRound size={14} /> Usuário
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-14 w-full rounded-[16px] border border-sandstone bg-cream-paper px-5 text-[15px] outline-none transition focus:border-fresh-grass focus:ring-4 focus:ring-fresh-grass/20"
                    placeholder="Digite seu usuário"
                    autoComplete="username"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-medium text-stone-gray">
                    <LockKeyhole size={14} /> Senha
                  </span>
                  <input
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    className="h-14 w-full rounded-[16px] border border-sandstone bg-cream-paper px-5 text-[15px] outline-none transition focus:border-fresh-grass focus:ring-4 focus:ring-fresh-grass/20"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    required
                  />
                </label>
              </div>

              {error && <p className="mt-5 rounded-[14px] bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex h-14 w-full cursor-pointer items-center justify-between rounded-full border border-ink-black bg-white pl-6 pr-2 text-[15px] font-medium transition hover:border-fresh-grass disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>{loading ? 'Autenticando...' : 'Acessar o sistema'}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-fresh-grass">
                  {loading ? <Loader2 className="animate-spin" size={19} /> : <ArrowRight size={19} />}
                </span>
              </button>
            </form>
          </section>
        </div>
      </main>
    </AnimatedPage>
  );
}
