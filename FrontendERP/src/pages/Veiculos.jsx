import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import { veiculosService } from '../services/veiculosService';

export default function Veiculos() {
    const navigate = useNavigate();
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchVeiculos();
    }, []);

    const fetchVeiculos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const data = await veiculosService.getVeiculos(token);
            setVeiculos(data || []);
        } catch (error) {
            console.error("Erro ao carregar veiculos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async (id, nome) => {
        const confirmou = window.confirm(`Tem certeza que deseja excluir o veiculo "${nome}"?`);
        if (confirmou) {
            try {
                setDeletingId(id);
                const token = localStorage.getItem('token');
                await veiculosService.deleteVeiculo(token, id);
                setVeiculos(veiculos.filter(v => v.codVeiculo !== id));
            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert("Não foi possível excluir o veiculo. Ele pode estar sendo usado em outros registros.");
            } finally {
                setDeletingId(null);
            }
        }
    };

    const filteredVeiculos = veiculos.filter(veiculo =>
        veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const formatDate = (dateString) => {
        if (!dateString) return '-';

        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
                <div className="max-w-9xl mx-auto">

                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Veiculos</h1>
                            <p className="text-sm text-gray-500 mt-1">Gerencie os Veiculos cadastrados no sistema</p>
                        </div>
                        <button
                            onClick={() => navigate('/veiculos/novo')}
                            className="flex items-center gap-2 bg-ink-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md">
                            <Plus size={16} />
                            Novo Veiculo
                        </button>
                    </div>
                    <div className="mb-6">
                        <div className="relative w-full md:w-2/3">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por placa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="animate-spin text-gray-400" size={24} />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-max">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Cód</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Placa Mercosul</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Chassi</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">ANTT</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Transportador</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Atualizado em</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredVeiculos.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="py-16 text-center text-sm text-gray-500">
                                                    Nenhum Veiculo encontrado.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredVeiculos.map((veiculo, idx) => (
                                                <motion.tr
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    key={veiculo.codVeiculo}
                                                    className="hover:bg-gray-50/80 transition-colors group"
                                                >
                                                    <td className="py-4 px-6 text-[13px] text-gray-500 font-medium">
                                                        #{veiculo.codVeiculo}
                                                    </td>
                                                    <td className="py-4 px-6 text-[14px] text-gray-800 font-medium">
                                                        {veiculo.placaVeiculo}
                                                    </td>
                                                    <td className="py-4 px-6 text-[13px] text-gray-600">
                                                        {veiculo.placaMercosul}
                                                    </td>
                                                    <td className="py-4 px-6 text-[13px] text-gray-600">
                                                        {veiculo.chassi}
                                                    </td>
                                                    <td className="py-4 px-6 text-[13px] text-gray-600">
                                                        {veiculo.modelo}
                                                    </td>
                                                    <td className="py-4 px-6 text-[13px] text-gray-600">
                                                        {veiculo.antt}
                                                    </td>
                                                    <td className="py-4 px-6 text-[13px] text-gray-600">
                                                        {veiculo.estado.estado}
                                                    </td>
                                                    <td className="py-4 px-6 text-[13px] text-gray-600">
                                                        {veiculo.transportador.transportador}
                                                    </td>
                                                    <td className="py-4 px-6 text-[13px] text-gray-600">
                                                        {veiculo.usuario.usuario}
                                                    </td>
                                                    <td className="py-4 px-6 text-[13px] text-gray-600">
                                                        {formatDate(veiculo.criado_em)}
                                                    </td>
                                                    <td className="py-4 px-6 text-[13px] text-gray-600">
                                                        {formatDate(veiculo.atualizado_em)}
                                                    </td>
                                                    <td className="py-4 px-6 text-[13px] text-right">
                                                        <div className="flex items-center justify-end gap-3 transition-opacity">
                                                            <button
                                                                onClick={() => navigate(`/veiculos/editar/${veiculo.codVeiculo}`)}
                                                                className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer" title="Editar">
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(veiculo.codVeiculo, veiculo.veiculo)}
                                                                disabled={deletingId === veiculo.codVeiculo}
                                                                className={`transition-colors cursor-pointer ${deletingId === veiculo.codVeiculo ? 'text-gray-300' : 'text-gray-400 hover:text-red-600'}`}
                                                                title="Excluir">
                                                                {deletingId === veiculo.codVeiculo ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AnimatedPage>
    );
}
