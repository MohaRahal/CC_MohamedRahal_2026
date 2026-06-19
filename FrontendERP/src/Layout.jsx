import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, UserCog, LogOut, FileText, 
  Settings, FolderKanban, ShieldAlert, Boxes, ArrowLeftRight, UserRoundCheck, Wallet, HandCoins, Earth, StickyNoteCheck, Map, MapPin
} from 'lucide-react';

function FloatingNavbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav 
      className="fixed top-8 left-1/2 -translate-x-1/2 bg-ink-black/80 backdrop-blur-xl border border-paper-white/10 shadow-2xl rounded-[75px] py-2 px-2 flex flex-row items-center z-50 transition-all duration-1000 ease-in-out"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center pr-3 border-r border-paper-white/10 shrink-0">
        <span 
          className={`text-paper-white font-[300] tracking-widest text-[11px] whitespace-nowrap transition-all duration-1000 ease-in-out overflow-hidden ${isExpanded ? 'opacity-100 max-w-[150px] ml-4 pr-2' : 'opacity-0 max-w-0 ml-0 pr-0'}`}
        >
          INTEGRA | ONE
        </span>
      </div>

      <div className="flex flex-row gap-1 pl-3">
        <NavItem icon={<LayoutDashboard size={18} strokeWidth={1.5} />} label="Dashboard" isExpanded={isExpanded} to="/dashboard" />
      {/*  <NavItem icon={<Boxes size={18} strokeWidth={1.5} />} label="Estoque" isExpanded={isExpanded} to="/Estoque" />
        <NavItem icon={<StickyNoteCheck size={18} strokeWidth={1.5} />} label="Vendas" isExpanded={isExpanded} to="/Vendas" />*/}
        <NavItem icon={<Users size={18} strokeWidth={1.5} />} label="Fornecedores" isExpanded={isExpanded} to="/Fornecedores" />
        <NavItem icon={<UserRoundCheck size={18} strokeWidth={1.5} />} label="Funcionários" isExpanded={isExpanded} to="/funcionarios" />
        <NavItem icon={<UserCog size={18} strokeWidth={1.5} />} label="Cargos" isExpanded={isExpanded} to="/cargos" />
        <NavItem icon={<UserCog size={18} strokeWidth={1.5} />} label="Usuários" isExpanded={isExpanded} to="/Usuarios" />
        <NavItem icon={<Earth size={18} strokeWidth={1.5} />} label="Países" isExpanded={isExpanded} to="/paises" />
        <NavItem icon={<Map size={18} strokeWidth={1.5} />} label="Estados" isExpanded={isExpanded} to="/estados" />
        <NavItem icon={<MapPin size={18} strokeWidth={1.5} />} label="Cidades" isExpanded={isExpanded} to="/cidades" />
       {/* <NavItem icon={<Wallet size={18} strokeWidth={1.5} />} label="Financeiro" isExpanded={isExpanded} to="/Financeiro" />
        <NavItem icon={<ArrowLeftRight size={18} strokeWidth={1.5} />} label="Movimentações" isExpanded={isExpanded} to="/Movimentacoes" />
        <NavItem icon={<ShieldAlert size={18} strokeWidth={1.5} />} label="Logs" isExpanded={isExpanded} to="/Logs" />*/}
        
      </div>

      <div className="ml-2 pl-3 pr-1 border-l border-paper-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center text-paper-white/60 hover:text-paper-white hover:bg-paper-white/10 transition-all duration-700 py-2 px-3 rounded-[75px] whitespace-nowrap shrink-0 group cursor-pointer"
        >
          <div className="flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-700">
            <LogOut size={18} strokeWidth={1.5} />
          </div>
          <span 
            className={`text-[12px] font-[400] transition-all duration-1000 ease-in-out overflow-hidden ${isExpanded ? 'opacity-100 max-w-[100px] ml-3' : 'opacity-0 max-w-0 ml-0'}`}
          >
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}

function NavItem({ icon, label, isExpanded, to }) {
  return (
    <Link 
      to={to} 
      className="flex items-center text-paper-white/60 hover:text-paper-white hover:bg-paper-white/10 transition-all duration-700 py-2 px-3 rounded-[75px] whitespace-nowrap shrink-0 group"
    >
      <div className="flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-700">
        {icon}
      </div>
      <span 
        className={`text-[12px] font-[400] transition-all duration-1000 ease-in-out overflow-hidden ${isExpanded ? 'opacity-100 max-w-[100px] ml-3' : 'opacity-0 max-w-0 ml-0'}`}
      >
        {label}
      </span>
    </Link>
  );
}

export default function Layout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      }
    }
  }, []);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  const roleName = user?.roleid === 1 ? 'Admin' : 'Logado';

  return (
    <div className="min-h-screen bg-paper-white text-carbon relative">
      <FloatingNavbar />

      {/* User Profile (Dynamic) */}
      <div className="fixed top-8 right-12 z-50 flex items-center gap-3 bg-paper-white/90 backdrop-blur-xl border border-carbon/10 shadow-sm rounded-[75px] py-1.5 pr-5 pl-1.5 hover:shadow-md hover:border-carbon/20 transition-all duration-500 cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-carbon text-paper-white flex items-center justify-center text-[12px] font-[400] group-hover:scale-105 transition-transform duration-500 uppercase">
          {initial}
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-[9px] uppercase tracking-widest text-ash leading-none mb-1">{roleName}</span>
          <span className="text-[13px] text-carbon font-[400] leading-none">{user?.name || 'Visitante'}</span>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
