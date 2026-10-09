import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import EntityDetailsModal from '../components/EntityDetailsModal';
import { transportadoresService } from '../services/transportadoresService';
import { confirmAction } from '../components/feedback';

export default function Transportadores() {
  const navigate = useNavigate();
  const [transportadores, setTransportadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedTransp, setSelectedTransp] = useState(null);

  useEffect(() => {
    // Initial request only; the loader is also reused after mutations.
    // eslint-disable-next-line react-hooks/immutability
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
    if (await confirmAction("Tem certeza que deseja excluir este transportador?")) {
      try {
        await transportadoresService.deleteTransportador(id);
        setTransportadores((current) => current.filter((transportador) => transportador.codTransp !== id));
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
        <div className="w-full">
          
          <div className="mb-8 flex justify-end">
            <div className="flex gap-2">
              <Link to="/Transportadores/novo" className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors shadow-sm">
                <Plus size={16} />
                Novo Transportador
              </Link>
            </div>
          </div>

          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type="text"
              placeholder="Buscar por razão social ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm "
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
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
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ativo</th>
                    <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-16 text-center text-sm text-gray-500">
                        Nenhum transportador encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(f => (
                      <tr key={f.codTransp} onClick={() => setSelectedTransp(f)} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                        <td className="py-4 px-6 text-[13px] text-gray-400 font-mono">
                          #{f.codTransp}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.transportador}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                          {f.apelido_NomeFantasia}
                        </td>
                        <td className="py-4 px-6 text-[13px] text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            f.ativo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {f.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[13px] whitespace-nowrap">
                          <div className="flex gap-2">
                            <Link to={`/Transportadores/editar/${f.codTransp}`} onClick={(event) => event.stopPropagation()} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                              <Edit size={16} />
                            </Link>
                            <button onClick={(event) => { event.stopPropagation(); handleDelete(f.codTransp); }} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
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
      {selectedTransp && (
        <EntityDetailsModal
          title={selectedTransp.transportador}
          subtitle="Detalhes do transportador"
          onClose={() => setSelectedTransp(null)}
          onEdit={() => navigate(`/Transportadores/editar/${selectedTransp.codTransp}`)}
          fields={[
            { label: 'Código', value: `#${selectedTransp.codTransp?.toString().padStart(4, '0')}` },
            { label: 'Nome fantasia', value: selectedTransp.apelido_NomeFantasia },
            { label: 'Status', value: selectedTransp.ativo ? 'Ativo' : 'Inativo' },
            { label: 'Inscrição estadual', value: selectedTransp.inscEstTransp },
            { label: 'Telefone', value: selectedTransp.fone },
            { label: 'E-mail', value: selectedTransp.email },
            { label: 'Site', value: selectedTransp.site, fullWidth: true },
            { label: 'Endereço', value: selectedTransp.ender, fullWidth: true },
            { label: 'Número', value: selectedTransp.numero },
            { label: 'Complemento', value: selectedTransp.complemento },
            { label: 'Bairro', value: selectedTransp.bairro },
            { label: 'CEP', value: selectedTransp.cep },
            { label: 'Cidade', value: selectedTransp.cidade?.cidade },
            { label: 'Cadastrado por', value: selectedTransp.usuario?.usuario },
            { label: 'Cadastrado em', value: selectedTransp.criado_em ? new Date(selectedTransp.criado_em).toLocaleDateString('pt-BR') : null, fullWidth: true },
          ]}
        />
      )}
    </AnimatedPage>
  );
}
