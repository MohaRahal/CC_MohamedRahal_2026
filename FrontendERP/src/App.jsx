import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';
import Movimentacoes from './pages/Movimentacoes';
import Logs from './pages/Logs';
import Usuarios from './pages/Usuarios';
import AddUser from './pages/subpages/AddUser';
import EditUser from './pages/subpages/EditUser';
import Fornecedores from './pages/Fornecedores';
import Vendas from './pages/Vendas';
import Financeiro from './pages/Financeiro';
import NotFound from './pages/NotFound';
import Layout from './Layout';
import Paises from './pages/Paises';
import AddPaises from './pages/subpages/AddPaises';
import EditPais from './pages/subpages/EditPais';
import Estados from './pages/Estados';
import AddEstado from './pages/subpages/AddEstado';
import EditEstado from './pages/subpages/EditEstado';
import Cidades from './pages/Cidades';
import AddCidade from './pages/subpages/AddCidade';
import EditCidade from './pages/subpages/EditCidade';
import Cargos from './pages/Cargos';
import AddCargo from './pages/subpages/AddCargo';
import EditCargo from './pages/subpages/EditCargo';
import Funcionarios from './pages/Funcionarios';
import AddFuncionario from './pages/subpages/AddFuncionario';
import EditFuncionario from './pages/subpages/EditFuncionario';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Estoque" element={<Estoque />} />
          <Route path="/Movimentacoes" element={<Movimentacoes />} />
          <Route path="/Logs" element={<Logs />} />
          <Route path="/Usuarios" element={<Usuarios />} />
          <Route path="/Usuarios/AddUser" element={<AddUser />} />
          <Route path="/Usuarios/editar/:id" element={<EditUser />} />
          <Route path="/Fornecedores" element={<Fornecedores />} />
          <Route path="/Vendas" element={<Vendas />} />
          <Route path="/Financeiro" element={<Financeiro />} />
          <Route path="/paises" element={<Paises />} />
          <Route path="/paises/novo" element={<AddPaises />} />
          <Route path="/paises/editar/:id" element={<EditPais />} />
          <Route path="/estados" element={<Estados />} />
          <Route path="/estados/novo" element={<AddEstado />} />
          <Route path="/estados/editar/:id" element={<EditEstado />} />
          <Route path="/cidades" element={<Cidades />} />
          <Route path="/cidades/novo" element={<AddCidade />} />
          <Route path="/cidades/editar/:id" element={<EditCidade />} />
          <Route path="/cargos" element={<Cargos />} />
          <Route path="/cargos/novo" element={<AddCargo />} />
          <Route path="/cargos/editar/:id" element={<EditCargo />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/funcionarios/novo" element={<AddFuncionario />} />
          <Route path="/funcionarios/editar/:id" element={<EditFuncionario />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
