import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Boxes,
  Building2,
  CircleDollarSign,
  ShoppingCart,
  Tags,
  FolderTree,
  Earth,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldUser,
  Truck,
  UserCog,
  UserRound,
  UserRoundCheck,
  Users,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard', section: 'Principal' },
  { icon: Boxes, label: 'Estoque', to: '/Estoque', section: 'Estoque' },
  { icon: Tags, label: 'Marcas', to: '/Marcas', section: 'Estoque' },
  { icon: FolderTree, label: 'Grupos', to: '/Grupos', section: 'Estoque' },
  { icon: ShoppingCart, label: 'Compras', to: '/compras', section: 'Estoque' },
  { icon: Users, label: 'Clientes', to: '/Clientes', section: 'Cadastros' },
  { icon: Building2, label: 'Fornecedores', to: '/Fornecedores', section: 'Cadastros' },
  { icon: Truck, label: 'Transportadores', to: '/Transportadores', section: 'Cadastros' },
  { icon: UserRoundCheck, label: 'Funcionários', to: '/funcionarios', section: 'Cadastros' },
  { icon: ShieldUser, label: 'Cargos', to: '/cargos', section: 'Cadastros' },
  { icon: UserCog, label: 'Usuários', to: '/Usuarios', section: 'Cadastros' },
  { icon: Earth, label: 'Países', to: '/paises', section: 'Localidades' },
  { icon: Map, label: 'Estados', to: '/estados', section: 'Localidades' },
  { icon: MapPin, label: 'Cidades', to: '/cidades', section: 'Localidades' },
  { icon: CircleDollarSign, label: 'Condições de pagamento', to: '/condicoes-pagamento', section: 'Financeiro' },
  { icon: CircleDollarSign, label: 'Formas de pagamento', to: '/formas-pagamento', section: 'Financeiro' },
];

const menuSections = ['Principal', 'Estoque', 'Cadastros', 'Localidades', 'Financeiro'];

const additionalPageTitles = [
  { label: 'Movimentações de estoque', to: '/Movimentacoes' },
  { label: 'Logs de auditoria', to: '/Logs' },
  { label: 'Veículos', to: '/Veiculos' },
  { label: 'Financeiro', to: '/Financeiro' },
];

function getStoredUserName() {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return storedUser?.name || storedUser?.usuario || 'Usuário';
  } catch {
    return 'Usuário';
  }
}

function SidebarItem({ icon: Icon, label, to, isSidebarOpen }) {
  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) => [
        `group flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${isSidebarOpen ? 'justify-start' : 'justify-center'}`,
        isActive
          ? 'bg-cream-paper text-ink-black'
          : 'text-stone-gray hover:bg-cream-paper/70 hover:text-ink-black',
      ].join(' ')}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={19}
            strokeWidth={isActive ? 2 : 1.7}
            className={isActive ? 'shrink-0 text-ink-black' : 'shrink-0 text-stone-gray group-hover:text-ink-black'}
          />
          {isSidebarOpen && <span className="min-w-0 truncate">{label}</span>}
          {isSidebarOpen && isActive && <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-fresh-grass" />}
        </>
      )}
    </NavLink>
  );
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userName = getStoredUserName();
  const currentPage = [...menuItems, ...additionalPageTitles].find((item) =>
    location.pathname.toLocaleLowerCase('pt-BR').startsWith(item.to.toLocaleLowerCase('pt-BR'))
  )?.label || 'ERP';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="erp-app min-h-screen bg-cream-paper text-ink-black">
      <aside className={`fixed bottom-5 left-5 top-5 z-50 flex flex-col overflow-visible rounded-[32px] bg-white transition-[width] duration-300 ${isSidebarOpen ? 'w-60' : 'w-[72px]'}`}>
        <div className={`flex h-18 shrink-0 items-center overflow-hidden rounded-t-[32px] border-b border-sandstone/60 px-4 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
          <NavLink to="/dashboard" className="flex min-w-0 items-center gap-3" title="Integra ERP">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-ink-black text-xs font-medium text-white">I</div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium tracking-tight text-ink-black">Integra ERP</p>
                <p className="text-[10px] text-stone-gray">Gestão empresarial</p>
              </div>
            )}
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setIsSidebarOpen((current) => !current)}
          aria-label={isSidebarOpen ? 'Recolher sidebar' : 'Expandir sidebar'}
          title={isSidebarOpen ? 'Recolher sidebar' : 'Expandir sidebar'}
          className="absolute -right-[22px] top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 shrink-0 cursor-pointer items-center justify-center rounded-full border-4 border-cream-paper bg-fresh-grass text-ink-black transition-colors hover:bg-[#80c657] focus:outline-none focus:ring-4 focus:ring-fresh-grass/30"
        >
          {isSidebarOpen ? <PanelLeftClose size={21} /> : <PanelLeftOpen size={21} />}
        </button>

        <nav className={`flex-1 overflow-x-hidden overflow-y-auto py-4 ${isSidebarOpen ? 'px-3' : 'px-2.5'}`}>
          {menuSections.map((section, sectionIndex) => (
            <div key={section} className={sectionIndex === 0 ? '' : 'mt-5'}>
              {isSidebarOpen && (
                <p className="mb-1.5 px-3 text-[9px] font-medium uppercase tracking-[0.16em] text-stone-gray/60">{section}</p>
              )}
              <div className="space-y-0.5">
                {menuItems.filter((item) => item.section === section).map((item) => (
                  <SidebarItem key={item.to} {...item} isSidebarOpen={isSidebarOpen} />
                ))}
              </div>
              {!isSidebarOpen && sectionIndex < menuSections.length - 1 && <div className="mx-2 mt-3 border-t border-sandstone/60" />}
            </div>
          ))}
        </nav>

        <div className={`shrink-0 overflow-hidden rounded-b-[32px] border-t border-sandstone/60 ${isSidebarOpen ? 'p-3' : 'p-2.5'}`}>
          <button
            type="button"
            onClick={handleLogout}
            title="Sair"
            className={`flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
          >
            <LogOut size={19} strokeWidth={1.8} className="shrink-0" />
            {isSidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      <main className={`min-h-screen transition-[padding] duration-300 ${isSidebarOpen ? 'pl-[280px]' : 'pl-[112px]'}`}>
        <header className={`fixed right-5 top-5 z-40 flex h-16 items-center justify-between rounded-full bg-white px-6 transition-[left] duration-300 lg:px-8 ${isSidebarOpen ? 'left-[280px]' : 'left-[112px]'}`}>
          <div className="min-w-0">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-stone-gray">Página atual</p>
            <h1 className="mt-0.5 truncate text-lg font-medium tracking-tight text-ink-black">{currentPage}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[11px] text-stone-gray">Bem-vindo de volta</p>
              <p className="mt-0.5 max-w-48 truncate text-sm font-medium text-ink-black">{userName}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fresh-grass text-ink-black" title={userName}>
              <UserRound size={17} strokeWidth={1.8} />
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
