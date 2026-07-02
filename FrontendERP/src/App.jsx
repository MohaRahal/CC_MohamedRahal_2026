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
import AddFornecedor from './pages/subpages/AddFornecedor';
import EditFornecedor from './pages/subpages/EditFornecedor';
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
import FormasPagamento from './pages/FormasPagamento';
import AddFormaPagamento from './pages/subpages/AddFormaPagamento';
import CondicoesPagamento from './pages/CondicoesPagamento';
import AddCondicaoPagamento from './pages/subpages/AddCondicaoPagamento';
import EditCondicaoPagamento from './pages/subpages/EditCondicaoPagamento';
import Transportadores from './pages/Transportadores';
import AddTransportador from './pages/subpages/AddTransportador';
import EditTransportador from './pages/subpages/EditTransportador';
import Veiculos from './pages/Veiculos';
import AddVeiculo from './pages/subpages/AddVeiculo';
import EditVeiculo from './pages/subpages/EditVeiculo';
import AddProduto from './pages/subpages/AddProduto';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Estoque" element={<Estoque />} />
          <Route path="/Estoque/novo" element={<AddProduto />} />
          <Route path="/Movimentacoes" element={<Movimentacoes />} />
          <Route path="/Logs" element={<Logs />} />
          <Route path="/Usuarios" element={<Usuarios />} />
          <Route path="/Usuarios/AddUser" element={<AddUser />} />
          <Route path="/Usuarios/editar/:id" element={<EditUser />} />
          <Route path="/Fornecedores" element={<Fornecedores />} />
          <Route path="/Fornecedores/novo" element={<AddFornecedor />} />
          <Route path="/Fornecedores/editar/:id" element={<EditFornecedor />} />
          <Route path="/Transportadores" element={<Transportadores />} />
          <Route path="/Transportadores/novo" element={<AddTransportador />} />
          <Route path="/Transportadores/editar/:id" element={<EditTransportador />} />
          <Route path="/Veiculos" element={<Veiculos />} />
          <Route path="/veiculos/novo" element={<AddVeiculo />} />
          <Route path="/veiculos/editar/:id" element={<EditVeiculo />} />
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
          <Route path="/formas-pagamento" element={<FormasPagamento />} />
          <Route path="/formas-pagamento/novo" element={<AddFormaPagamento />} />
          
          <Route path="/condicoes-pagamento" element={<CondicoesPagamento />} />
          <Route path="/condicoes-pagamento/novo" element={<AddCondicaoPagamento />} />
          <Route path="/condicoes-pagamento/editar/:id" element={<EditCondicaoPagamento />} />
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
