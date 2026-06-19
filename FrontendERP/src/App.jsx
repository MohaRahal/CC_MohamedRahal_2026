import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';
import Movimentacoes from './pages/Movimentacoes';
import Logs from './pages/Logs';
import Usuarios from './pages/Usuarios';
import AddUser from './pages/subpages/AddUser';
import Fornecedores from './pages/Fornecedores';
import Vendas from './pages/Vendas';
import Financeiro from './pages/Financeiro';
import NotFound from './pages/NotFound';
import Layout from './Layout';
import Paises from './pages/Paises';

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
          <Route path="/Fornecedores" element={<Fornecedores />} />
          <Route path="/Vendas" element={<Vendas />} />
          <Route path="/Financeiro" element={<Financeiro />} />
          <Route path="/paises" element={<Paises />} />
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
