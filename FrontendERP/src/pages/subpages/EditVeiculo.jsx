import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';
import { veiculosService } from '../../services/veiculosService';
import { marcasService } from '../../services/marcasService';
import { modelosService } from '../../services/modelosService';
import { transportadoresService } from '../../services/transportadoresService';
import { estadosService } from '../../services/estadosService';

export default function EditVeiculo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [transportadores, setTransportadores] = useState([]);
  const [estados, setEstados] = useState([]);

  const [formData, setFormData] = useState({
    placaVeiculo: '',
    placaMercosul: '',
    chassi: '',
    codMarca: '',
    codModelo: '',
    novaMarca: '',
    novoModelo: '',
    codTransportador: '',
    codEstado: '',
    codANTT: ''
  });

  const [showNovaMarca, setShowNovaMarca] = useState(false);
  const [showNovoModelo, setShowNovoModelo] = useState(false);

  useEffect(() => {
    fetchDependenciasAndVeiculo();
  }, [id]);

  const fetchDependenciasAndVeiculo = async () => {
    try {
      const token = localStorage.getItem('token');
      const [marcasData, modelosData, transpData, estData, veiculoData] = await Promise.all([
        marcasService.getMarcas(token),
        modelosService.getModelos(token),
        transportadoresService.getTransportadores(token),
        estadosService.getEstados(token),
        veiculosService.getVeiculo(token, id)
      ]);
      
      setMarcas(marcasData || []);
      setModelos(modelosData || []);
      setTransportadores(transpData || []);
      setEstados(estData || []);

      if (veiculoData) {
        // Find which marca this model belongs to
        const modeloRelacionado = (modelosData || []).find(m => m.codModelo.toString() === veiculoData.codModelo?.toString());
        
        setFormData({
          placaVeiculo: veiculoData.placaVeiculo || '',
          placaMercosul: veiculoData.placaMercosul || '',
          chassi: veiculoData.chassi || '',
          codMarca: modeloRelacionado ? modeloRelacionado.codMarca.toString() : '',
          codModelo: veiculoData.codModelo?.toString() || '',
          novaMarca: '',
          novoModelo: '',
          codTransportador: veiculoData.codTransportador?.toString() || '',
          codEstado: veiculoData.codEstado?.toString() || '',
          codANTT: veiculoData.codANTT || ''
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados. Redirecionando...");
      navigate('/veiculos');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      let finalCodMarca = formData.codMarca;
      if (showNovaMarca && formData.novaMarca) {
        const marcaRes = await marcasService.createMarca({ marca: formData.novaMarca });
        finalCodMarca = marcaRes.codMarca;
      }

      let finalCodModelo = formData.codModelo;
      if (showNovoModelo && formData.novoModelo) {
        if (!finalCodMarca) {
          alert("Por favor, selecione ou crie uma marca antes de criar o modelo.");
          setLoading(false);
          return;
        }
        const modeloRes = await modelosService.createModelo({ modelo: formData.novoModelo, codMarca: finalCodMarca });
        finalCodModelo = modeloRes.codModelo;
      }

      if (!finalCodModelo) {
        alert("Por favor, selecione ou crie um modelo.");
        setLoading(false);
        return;
      }
      
      const payload = {
        placaVeiculo: formData.placaVeiculo,
        placaMercosul: formData.placaMercosul,
        chassi: formData.chassi,
        codModelo: parseInt(finalCodModelo, 10),
        codTransportador: parseInt(formData.codTransportador, 10),
        codEstado: formData.codEstado ? parseInt(formData.codEstado, 10) : null,
        codANTT: formData.codANTT
      };

      await veiculosService.updateVeiculo(token, id, payload);
      navigate('/veiculos');
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
      alert("Erro ao atualizar veículo. Verifique se os dados estão corretos.");
    } finally {
      setLoading(false);
    }
  };

  const modelosFiltrados = modelos.filter(m => m.codMarca.toString() === formData.codMarca.toString());

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-8 text-gray-800 font-sans">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/veiculos')}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Voltar para Veículos
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Editar Veículo</h1>
            <p className="text-sm text-gray-500 mt-1">Atualize os dados abaixo e salve.</p>
          </div>

          {fetching ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Placa Antiga</label>
                  <input 
                    name="placaVeiculo" value={formData.placaVeiculo} onChange={handleChange} placeholder="Ex: ABC-1234"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Placa Mercosul</label>
                  <input 
                    name="placaMercosul" value={formData.placaMercosul} onChange={handleChange} placeholder="Ex: ABC1D23"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Chassi</label>
                  <input 
                    name="chassi" value={formData.chassi} onChange={handleChange} placeholder="Chassi do veículo"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-700">Marca <span className="text-red-500">*</span></label>
                    <button type="button" onClick={() => setShowNovaMarca(!showNovaMarca)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <Plus size={12}/> {showNovaMarca ? 'Selecionar Existente' : 'Nova Marca'}
                    </button>
                  </div>
                  {showNovaMarca ? (
                    <input name="novaMarca" value={formData.novaMarca} onChange={handleChange} placeholder="Nome da nova marca" required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                  ) : (
                    <select name="codMarca" value={formData.codMarca} onChange={handleChange} required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all">
                      <option value="">Selecione uma marca</option>
                      {marcas.map(m => <option key={m.codMarca} value={m.codMarca}>{m.marca}</option>)}
                    </select>
                  )}
                </div>

                <div className="flex flex-col gap-2 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-700">Modelo <span className="text-red-500">*</span></label>
                    <button type="button" onClick={() => setShowNovoModelo(!showNovoModelo)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <Plus size={12}/> {showNovoModelo ? 'Selecionar Existente' : 'Novo Modelo'}
                    </button>
                  </div>
                  {showNovoModelo ? (
                    <input name="novoModelo" value={formData.novoModelo} onChange={handleChange} placeholder="Nome do novo modelo" required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
                  ) : (
                    <select name="codModelo" value={formData.codModelo} onChange={handleChange} required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all">
                      <option value="">Selecione um modelo</option>
                      {modelosFiltrados.map(m => <option key={m.codModelo} value={m.codModelo}>{m.modelo}</option>)}
                    </select>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Transportador <span className="text-red-500">*</span></label>
                  <select 
                    name="codTransportador" value={formData.codTransportador} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="">Selecione um transportador</option>
                    {transportadores.map(t => (
                      <option key={t.codTransportador} value={t.codTransportador}>{t.transportador} ({t.cnpj})</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <select 
                    name="codEstado" value={formData.codEstado} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="">Nenhum</option>
                    {estados.map(e => (
                      <option key={e.codEstado} value={e.codEstado}>{e.estado} - {e.sigla}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">ANTT</label>
                  <input 
                    name="codANTT" value={formData.codANTT} onChange={handleChange} placeholder="Registro ANTT"
                    className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

              </div>

              <div className="mt-6 flex justify-end border-t border-gray-100 pt-6">
                <button 
                  type="submit" disabled={loading}
                  className="flex items-center gap-2 bg-ink-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 hover:bg-carbon transition-all shadow-md disabled:opacity-50"
                >
                  <Save size={16} /> {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
