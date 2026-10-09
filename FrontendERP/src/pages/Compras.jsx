import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, FileText, Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import { comprasService } from '../services/comprasService';
import { confirmAction } from '../components/feedback';

const moeda = (valor) => Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const data = (valor) => valor ? new Date(`${valor}T00:00:00`).toLocaleDateString('pt-BR') : '—';

export default function Compras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  const carregar = async () => {
    try {
      setLoading(true);
      setError('');
      setCompras(await comprasService.listar() || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar();
  }, []);

  const filtradas = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase('pt-BR');
    if (!termo) return compras;
    return compras.filter((compra) =>
      String(compra.numNfe).includes(termo) ||
      compra.fornecedor?.toLocaleLowerCase('pt-BR').includes(termo) ||
      compra.chaveAcessoNFe?.includes(termo)
    );
  }, [compras, search]);

  const abrirDetalhes = async (compra) => {
    setSelected(compra);
    setDetailLoading(true);
    try {
      setSelected(await comprasService.buscar(compra));
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const excluir = async (event, compra) => {
    event.stopPropagation();
    if (!await confirmAction(`Excluir a compra da NF-e ${compra.numNfe}? As parcelas também serão excluídas.`)) return;
    try {
      await comprasService.excluir(compra);
      setCompras((atuais) => atuais.filter((item) => !(
        item.numNfe === compra.numNfe && item.serie === compra.serie &&
        item.modelo === compra.modelo && item.codForn === compra.codForn
      )));
      if (selected?.numNfe === compra.numNfe) setSelected(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen px-4 pb-12 pt-28 text-gray-800 sm:px-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-gray">Suprimentos</p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight text-ink-black">Compras</h2>
            <p className="mt-2 text-sm text-stone-gray">Notas fiscais de entrada e seus compromissos financeiros.</p>
          </div>
          <Link to="/compras/nova" className="flex items-center justify-center gap-2 bg-black px-5 py-2.5 text-sm text-white">
            <Plus size={16} /> Nova compra
          </Link>
        </div>

        {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-gray" size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nota, fornecedor ou chave de acesso..." className="w-full py-3 pl-11 pr-4" />
        </div>

        <div className="overflow-x-auto rounded-[32px] bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-stone-gray" /></div>
          ) : filtradas.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <FileText size={36} strokeWidth={1.4} className="mb-3 text-sandstone" />
              <p className="text-sm font-medium">Nenhuma compra encontrada</p>
              <p className="mt-1 text-xs text-stone-gray">Cadastre a primeira nota fiscal de entrada.</p>
            </div>
          ) : (
            <table className="w-full min-w-[820px] text-left">
              <thead><tr>
                <th className="px-6 py-4">NF-e</th><th className="px-6 py-4">Fornecedor</th>
                <th className="px-6 py-4">Entrada</th><th className="px-6 py-4">Natureza</th>
                <th className="px-6 py-4 text-right">Total parcelado</th><th className="w-20 px-6 py-4">Ações</th>
              </tr></thead>
              <tbody>
                {filtradas.map((compra) => (
                  <tr key={`${compra.numNfe}-${compra.serie}-${compra.modelo}-${compra.codForn}`}
                    onClick={() => abrirDetalhes(compra)} className="cursor-pointer border-t border-sandstone/50">
                    <td className="px-6 py-4"><p className="text-sm font-medium">{compra.numNfe}</p><p className="text-xs text-stone-gray">Série {compra.serie} · Mod. {compra.modelo}</p></td>
                    <td className="px-6 py-4 text-sm">{compra.fornecedor}</td>
                    <td className="px-6 py-4 text-sm text-stone-gray">{data(compra.dataEntNfe)}</td>
                    <td className="px-6 py-4 text-sm text-stone-gray">{compra.natOper || '—'}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">{moeda(compra.totalParcelas)}</td>
                    <td className="px-6 py-4"><button type="button" onClick={(event) => excluir(event, compra)}
                      className="rounded-full p-2 text-stone-gray hover:bg-red-50 hover:text-red-600" title="Excluir compra"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm" onMouseDown={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-white p-6 sm:p-8" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b border-sandstone pb-5">
              <div><p className="text-xs uppercase tracking-[0.16em] text-stone-gray">Nota fiscal de entrada</p>
                <h3 className="mt-1 text-2xl">NF-e {selected.numNfe}</h3><p className="mt-1 text-sm text-stone-gray">{selected.fornecedor}</p></div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-full p-2 hover:bg-cream-paper"><X size={20} /></button>
            </div>
            {detailLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div> : <>
              <div className="grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Série / Modelo', `${selected.serie} / ${selected.modelo}`], ['Emissão', data(selected.dataEmitNfe)],
                  ['Entrada', data(selected.dataEntNfe)], ['Natureza', selected.natOper || '—'],
                  ['Forma', selected.formaPagamento || '—'], ['Condição', selected.condPagamento || '—'],
                  ['Transportador', selected.transportador || '—'], ['Veículo', selected.veiculo || '—'],
                ].map(([label, value]) => <div key={label} className="rounded-2xl bg-cream-paper/70 p-4"><p className="text-[10px] uppercase tracking-wider text-stone-gray">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>)}
              </div>
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-sandstone p-4"><p className="text-xs text-stone-gray">ICMS</p><p className="mt-1 font-medium">{moeda(selected.valorIcms)}</p></div>
                <div className="rounded-2xl border border-sandstone p-4"><p className="text-xs text-stone-gray">IPI</p><p className="mt-1 font-medium">{moeda(selected.valorIpi)}</p></div>
                <div className="rounded-2xl bg-fresh-grass/20 p-4"><p className="text-xs text-stone-gray">Total das parcelas</p><p className="mt-1 font-medium">{moeda(selected.totalParcelas)}</p></div>
              </div>
              <h4 className="mb-3 flex items-center gap-2 text-sm"><CalendarDays size={16} /> Contas a pagar</h4>
              <div className="overflow-hidden rounded-2xl border border-sandstone">
                <table className="w-full"><thead><tr><th className="px-4 py-3">Parcela</th><th className="px-4 py-3">Vencimento</th><th className="px-4 py-3">Forma</th><th className="px-4 py-3 text-right">Valor</th></tr></thead>
                  <tbody>{selected.parcelas?.length ? selected.parcelas.map((p) => <tr key={p.numParcela} className="border-t border-sandstone/60"><td className="px-4 py-3 text-sm">{p.numParcela}</td><td className="px-4 py-3 text-sm">{data(p.vencimentoParcela)}</td><td className="px-4 py-3 text-sm">{p.formaPagamento}</td><td className="px-4 py-3 text-right text-sm font-medium">{moeda(p.valorParcela)}</td></tr>) : <tr><td colSpan="4" className="px-4 py-8 text-center text-sm text-stone-gray">Nenhuma parcela cadastrada.</td></tr>}</tbody>
                </table>
              </div>
              {selected.infComp && <div className="mt-5 rounded-2xl bg-cream-paper/70 p-4"><p className="text-xs text-stone-gray">Informações complementares</p><p className="mt-2 whitespace-pre-wrap text-sm">{selected.infComp}</p></div>}
            </>}
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
