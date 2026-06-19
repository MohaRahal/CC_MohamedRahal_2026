import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';

export default function Login() {
  const [name, setName] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: name, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.mensagem || "Usuário ou senha inválidos.");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.usuario));

      // Redireciona para o dashboard com sucesso
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="w-full h-screen flex relative overflow-hidden bg-paper-white text-ink-black">
       
        <div className="w-full md:w-1/2 flex flex-col justify-center px-12 md:px-24 z-10">
          <h1 className="text-[78px] leading-[1.15] font-[300] mb-[64px] tracking-normal whitespace-pre-wrap">
            I  N  T  E  G  R  A   |   ONE
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-[28px] w-full max-w-[380px]">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border-b border-ash text-ink-black text-[18px] leading-[1.36] focus:outline-none focus:border-ink-black transition-all duration-500 ease-out pb-2 px-0 rounded-none placeholder:text-smoke"
                required
              />
            </div>

            <div className="flex flex-col">
              <input
                type="password"
                placeholder="Password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="bg-transparent border-b border-ash text-ink-black text-[18px] leading-[1.36] focus:outline-none focus:border-ink-black transition-all duration-500 ease-out pb-2 px-0 rounded-none placeholder:text-smoke"
                required
              />
            </div>

            
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}

            <div className="mt-[28px] flex justify-start">
              {/* Pill Button CTA */}
              <button
                type="submit"
                disabled={loading}
                className={`bg-ink-black text-paper-white rounded-[75px] px-[24px] py-[8px] text-[12px] font-[400] uppercase tracking-wider transition-all duration-500 ease-out cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-carbon hover:scale-105'}`}
              >
                {loading ? 'Authenticating...' : 'Enter Workspace'}
              </button>
            </div>
          </form>
        </div>

        
        <div className="hidden md:block md:w-1/2 relative bg-ink-black overflow-hidden group">
         
          <img
            src="/Logo.png"
            alt="logo"
            className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-br mix-blend-multiply pointer-events-none"></div>
        </div>
      </div>
    </AnimatedPage>
  );
}
