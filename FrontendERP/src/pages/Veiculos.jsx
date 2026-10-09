import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import EntityDetailsModal from '../components/EntityDetailsModal';
import { veiculosService } from '../services/veiculosService';
import { confirmAction } from '../components/feedback';

export default function Veiculos() {
    const navigate = useNavigate();
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [selectedVeiculo, setSelectedVeiculo] = useState(null);

    useEffect(() => {
        // Initial request only; the loader is also reused after mutations.
        // eslint-disable-next-line react-hooks/immutability
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
        const confirmou = await confirmAction(`Tem certeza que deseja excluir o veículo "${nome}"?`);
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
        veiculo.placaVeiculo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        veiculo.placaMercosul?.toLowerCase().includes(searchTerm.toLowerCase())
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
                <div className="w-full">

                    <div className="mb-8 flex justify-end">
                        <button
                            onClick={() => navigate('/veiculos/novo')}
                            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
                            <Plus size={16} />
                            Novo Veículo
                        </button>
                    </div>
                    <div className="mb-6">
                        <div className="relative">
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
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Cód</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Placa Mercosul</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                                            <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-center w-32">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredVeiculos.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-16 text-center text-sm text-gray-500">
                                                    Nenhum Veículo encontrado.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredVeiculos.map((veiculo, idx) => (
                                                <motion.tr
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    key={veiculo.codVeiculo}
                                                    onClick={() => setSelectedVeiculo(veiculo)}
                                                    className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                                                >
                                                    <td className="py-4 px-6 text-sm text-gray-500 font-mono">
                                                        #{veiculo.codVeiculo}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                                                        {veiculo.placaVeiculo}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">
                                                        {veiculo.placaMercosul || '—'}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">
                                                        {veiculo.modelo?.modelo || '—'}
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={(event) => { event.stopPropagation(); navigate(`/veiculos/editar/${veiculo.codVeiculo}`); }}
                                                                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                                                title="Editar"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(event) => { event.stopPropagation(); handleDeleteClick(veiculo.codVeiculo, veiculo.placaVeiculo); }}
                                                                disabled={deletingId === veiculo.codVeiculo}
                                                                className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer ${deletingId === veiculo.codVeiculo ? 'text-gray-300' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                                                title="Excluir"
                                                            >
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

            {selectedVeiculo && (
                <EntityDetailsModal
                    title={selectedVeiculo.placaMercosul || selectedVeiculo.placaVeiculo}
                    subtitle="Detalhes do veículo"
                    onClose={() => setSelectedVeiculo(null)}
                    onEdit={() => navigate(`/veiculos/editar/${selectedVeiculo.codVeiculo}`)}
                    fields={[
                        { label: 'Código', value: `#${selectedVeiculo.codVeiculo?.toString().padStart(4, '0')}` },
                        { label: 'Placa antiga', value: selectedVeiculo.placaVeiculo },
                        { label: 'Placa Mercosul', value: selectedVeiculo.placaMercosul },
                        { label: 'Chassi', value: selectedVeiculo.chassi },
                        { label: 'Código ANTT', value: selectedVeiculo.codANTT },
                        { label: 'Marca', value: selectedVeiculo.modelo?.marca?.marca },
                        { label: 'Modelo', value: selectedVeiculo.modelo?.modelo },
                        { label: 'Estado', value: selectedVeiculo.estado?.estado },
                        { label: 'Transportador', value: selectedVeiculo.transportador?.transportador },
                        { label: 'Cadastrado em', value: formatDate(selectedVeiculo.criado_em) },
                        { label: 'Atualizado em', value: formatDate(selectedVeiculo.atualizado_em), fullWidth: true },
                    ]}
                />
            )}
        </AnimatedPage>
    );
}
