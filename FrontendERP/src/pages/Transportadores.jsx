import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit, Trash2,Truck,ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import { transportadoresService } from '../services/transportadoresService';

export default function Transportadores() {
  const [transportadores, setTransportadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransportadores();
  }, []);

  const fetchTransportadores = async () => {
    try {
      setLoading(true);
      const data = await transportadoresService.getTransportadores();
      setTransportadores(data || []);
    } catch (error) {
      console.error("Erro ao carregar transportadores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este transportador?")) {
      try {
        await transportadoresService.deleteTransportador(id);
        setTransportadores(transportadores.filter(t => t.codTrans !== id));
      } catch (error) {
        console.error("Erro ao excluir transportador:", error);
        alert("Erro ao excluir transportador.");
      }
    }
  };

  const filtered = transportadores.filter(t =>
    t.transportador?.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-2 sm:px-4 text-gray-800 font-sans">
        <div className="w-full max-w-full mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Transportadores</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie seus transportadores</p>
            </div>
            <Link to="/Transportadores/novo" className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm">
              <Plus size={16} />
              Novo Transportador
            </Link>
            <Link to="/Veiculos" className="flex items-center gap-2 bg-red-900 text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm">
              <Truck size={16} />
              Veiculos
              <ExternalLink size={16} className="ml-3" />
            </Link>
            
          </div>

          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por razão social ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Cód</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Transportador</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nome Fantasia</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Endereço</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Número</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Complemento</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bairro</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">CEP</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cidade</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Site</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Fone</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Insc. Estadual de Transporte</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tipo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">CPF/CNPJ</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ativo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Usuario</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Criado em</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Atualizado em</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="21" className="py-16 text-center text-sm text-gray-500">
                        Nenhum transportador encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(f => (
                      <tr key={f.codTransp} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-[13px] text-gray-400 font-mono">
                          #{f.codTransp}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.transportador}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.apelido_NomeFantasia}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.ender}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.numero}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.complemento}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.bairro}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.cep}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.cidade.cidade}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.site}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.fone}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.email}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.inscEstTransp}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.tipoPessoa}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.cpf_cnpjTransp}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            f.ativo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {f.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                         <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.usuario?.usuario || '-'}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.criado_em ? new Date(f.criado_em).toLocaleDateString('pt-BR') : ''}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.atualizado_em ? new Date(f.atualizado_em).toLocaleDateString('pt-BR') : ''}
                        </td>
                        <td className="py-4 px-6 text-[13px] whitespace-nowrap">
                          <div className="flex gap-2">
                            <Link to={`/Transportadores/editar/${f.codTransp}`} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                              <Edit size={16} />
                            </Link>
                            <button onClick={() => handleDelete(f.codTransp)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </AnimatedPage>
  );
}
