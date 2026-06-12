import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AnimatedPage from './AnimatedPage';
import notFoundSvg from '../assets/404.svg';

export default function NotFound() {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center text-gray-900 font-sans px-6">
        
        <div className="mb-6 w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
          <img src={notFoundSvg} alt="Animação Erro 404" className="w-full h-full object-contain" />
        </div>
        
        <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-3 -mt-4">
          Página não encontrada
        </h2>
        
        <p className="text-gray-500 text-center max-w-md mb-10 text-[15px] font-light">
          A rota que você tentou acessar não existe, foi movida ou você não tem permissão para vê-la.
        </p>

        <Link 
          to="/dashboard"
          className="group flex items-center gap-2 px-7 py-3.5 bg-black text-white rounded-xl text-[14px] font-medium transition-all hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para o Dashboard
        </Link>
      </div>
    </AnimatedPage>
  );
}
