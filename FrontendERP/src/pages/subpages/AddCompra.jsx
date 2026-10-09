import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedPage from '../AnimatedPage';
import { comprasService } from '../../services/comprasService';
import { fornecedoresService } from '../../services/fornecedoresService';
import { transportadoresService } from '../../services/transportadoresService';
import { veiculosService } from '../../services/veiculosService';
import { formasPagamentoService } from '../../services/formasPagamentoService';
import { condicoesPagamentosService } from '../../services/condicoesPagamentosService';

const hoje = () => {
  const agora = new Date();
  const offset = agora.getTimezoneOffset() * 60000;
  return new Date(agora.getTime() - offset).toISOString().slice(0, 10);
};

const inicial = {
  numNfe: '', serie: '1', modelo: '55', codForn: '', pagina: '', natOper: '',
  protAcesso: '', dataProtAcesso: '', horaProtAcesso: '', chaveAcessoNFe: '',
  dataEmitNfe: hoje(), dataEntNfe: hoje(), horaEntNFe: '', baseCalcIcms: '', valorIcms: '',
  baseCalcIcmsSub: '', valorIcmsSub: '', valorFreteNFe: '', valorSeguroNFe: '',
  descontoNFe: '', outrasDespNfe: '', valorIpi: '', codTransp: '', fretePorContaNFe: '',
  codVeic: '', qtdadeVol: '', especieVol: '', marcaVol: '', numVol: '', pesoBrutoVol: '',
  pesoLiqVol: '', infComp: '', codFormaPagamento: '', codCondPagamento: '',
};

const inteiros = new Set(['numNfe', 'serie', 'modelo', 'codForn', 'pagina', 'codTransp', 'fretePorContaNFe', 'codVeic', 'qtdadeVol', 'codFormaPagamento', 'codCondPagamento']);
const decimais = new Set(['baseCalcIcms', 'valorIcms', 'baseCalcIcmsSub', 'valorIcmsSub', 'valorFreteNFe', 'valorSeguroNFe', 'descontoNFe', 'outrasDespNfe', 'valorIpi', 'pesoBrutoVol', 'pesoLiqVol']);

function Field({ label, required, children, className = '' }) {
  return <div className={`flex flex-col gap-2 ${className}`}><label>{label}{required && <span className="text-red-500"> *</span>}</label>{children}</div>;
}

function Section({ title, description, children }) {
  return <section className="border-t border-sandstone/70 pt-7 first:border-0 first:pt-0">
    <div className="mb-5"><h3 className="text-lg">{title}</h3>{description && <p className="mt-1 text-xs text-stone-gray">{description}</p>}</div>
    {children}
  </section>;
}

export default function AddCompra() {
  const navigate = useNavigate();
  const [form, setForm] = useState(inicial);
  const [parcelas, setParcelas] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [transportadores, setTransportadores] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [formas, setFormas] = useState([]);
  const [condicoes, setCondicoes] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fornecedoresService.getFornecedores(), transportadoresService.getTransportadores(),
      veiculosService.getVeiculos(token), formasPagamentoService.getFormasPagamento(token),
      condicoesPagamentosService.getCondicoesPagamentos(token),
    ]).then(([f, t, v, fp, cp]) => {
      setFornecedores(f || []); setTransportadores(t || []); setVeiculos(v || []);
      setFormas(fp || []); setCondicoes(cp || []);
    }).catch((err) => setError(err.message || 'Não foi possível carregar os cadastros auxiliares.'))
      .finally(() => setLoadingOptions(false));
  }, []);

  const veiculosFiltrados = useMemo(() => form.codTransp
    ? veiculos.filter((v) => String(v.codTransportador) === String(form.codTransp)) : veiculos,
  [veiculos, form.codTransp]);
  const totalParcelas = parcelas.reduce((total, p) => total + Number(p.valorParcela || 0), 0);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  };

  const selecionarFornecedor = (event) => {
    const codForn = event.target.value;
    const fornecedor = fornecedores.find((item) => String(item.codForn) === codForn);
    setForm((atual) => ({ ...atual, codForn, codCondPagamento: fornecedor?.codCondPagamento || atual.codCondPagamento }));
  };

  const adicionarParcela = () => setParcelas((atuais) => [...atuais, {
    numParcela: atuais.length + 1, vencimentoParcela: form.dataEntNfe || hoje(),
    valorParcela: '', codFormaPagamento: form.codFormaPagamento || '',
  }]);

  const alterarParcela = (index, campo, valor) => setParcelas((atuais) =>
    atuais.map((parcela, i) => i === index ? { ...parcela, [campo]: valor } : parcela));

  const removerParcela = (index) => setParcelas((atuais) =>
    atuais.filter((_, i) => i !== index).map((parcela, i) => ({ ...parcela, numParcela: i + 1 })));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (parcelas.some((p) => !p.vencimentoParcela || !p.valorParcela || !p.codFormaPagamento)) {
      setError('Preencha vencimento, valor e forma de pagamento de todas as parcelas.');
      return;
    }

    const payload = {};
    Object.entries(form).forEach(([campo, valor]) => {
      if (valor === '') payload[campo] = null;
      else if (inteiros.has(campo)) payload[campo] = Number.parseInt(valor, 10);
      else if (decimais.has(campo)) payload[campo] = Number(valor);
      else if ((campo === 'horaProtAcesso' || campo === 'horaEntNFe') && valor.length === 5) payload[campo] = `${valor}:00`;
      else payload[campo] = valor;
    });
    payload.parcelas = parcelas.map((p) => ({
      numParcela: Number(p.numParcela), vencimentoParcela: p.vencimentoParcela,
      valorParcela: Number(p.valorParcela), codFormaPagamento: Number(p.codFormaPagamento),
    }));

    try {
      setSaving(true);
      await comprasService.criar(payload);
      navigate('/compras');
    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const input = 'w-full px-4 py-2.5 text-sm';

  return (
    <AnimatedPage>
      <div className="min-h-screen px-4 pb-14 pt-28 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div><Link to="/compras" className="mb-4 inline-flex items-center gap-2 text-sm text-stone-gray hover:text-ink-black"><ArrowLeft size={16} /> Voltar para compras</Link>
              <h2 className="text-3xl font-medium tracking-tight">Nova compra</h2><p className="mt-2 text-sm text-stone-gray">Registre a nota fiscal de entrada e gere as contas a pagar.</p></div>
          </div>
          {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={submit} className="space-y-8 rounded-[32px] bg-white p-5 sm:p-8">
            <Section title="Identificação da nota" description="Os quatro primeiros campos formam a identificação única da compra.">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Número da NF-e" required><input className={input} type="number" min="1" name="numNfe" value={form.numNfe} onChange={change} required /></Field>
                <Field label="Série" required><input className={input} type="number" min="1" name="serie" value={form.serie} onChange={change} required /></Field>
                <Field label="Modelo" required><input className={input} type="number" min="1" name="modelo" value={form.modelo} onChange={change} required /></Field>
                <Field label="Página"><input className={input} type="number" min="0" name="pagina" value={form.pagina} onChange={change} /></Field>
                <Field label="Fornecedor" required className="sm:col-span-2"><select className={input} name="codForn" value={form.codForn} onChange={selecionarFornecedor} required disabled={loadingOptions}><option value="">Selecione...</option>{fornecedores.map((f) => <option key={f.codForn} value={f.codForn}>{f.fornecedor} — {f.cpf_cnpj}</option>)}</select></Field>
                <Field label="Natureza da operação" className="sm:col-span-2"><input className={input} maxLength="20" name="natOper" value={form.natOper} onChange={change} placeholder="Ex.: Compra para comercialização" /></Field>
                <Field label="Data de emissão"><input className={input} type="date" name="dataEmitNfe" value={form.dataEmitNfe} onChange={change} /></Field>
                <Field label="Data de entrada"><input className={input} type="date" name="dataEntNfe" value={form.dataEntNfe} onChange={change} /></Field>
                <Field label="Hora de entrada"><input className={input} type="time" name="horaEntNFe" value={form.horaEntNFe} onChange={change} /></Field>
                <Field label="Forma de pagamento"><select className={input} name="codFormaPagamento" value={form.codFormaPagamento} onChange={change}><option value="">Selecione...</option>{formas.map((f) => <option key={f.codFormaPagamento} value={f.codFormaPagamento}>{f.formaPagamento}</option>)}</select></Field>
                <Field label="Condição de pagamento" className="sm:col-span-2"><select className={input} name="codCondPagamento" value={form.codCondPagamento} onChange={change}><option value="">Selecione...</option>{condicoes.map((c) => <option key={c.codCondPagamento} value={c.codCondPagamento}>{c.condPagamento}</option>)}</select></Field>
              </div>
            </Section>

            <Section title="Autorização fiscal">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Protocolo de acesso" className="sm:col-span-2"><input className={input} maxLength="100" name="protAcesso" value={form.protAcesso} onChange={change} /></Field>
                <Field label="Data do protocolo"><input className={input} type="date" name="dataProtAcesso" value={form.dataProtAcesso} onChange={change} /></Field>
                <Field label="Hora do protocolo"><input className={input} type="time" name="horaProtAcesso" value={form.horaProtAcesso} onChange={change} /></Field>
                <Field label="Chave de acesso" className="sm:col-span-2 lg:col-span-4"><input className={input} maxLength="100" name="chaveAcessoNFe" value={form.chaveAcessoNFe} onChange={change} placeholder="44 dígitos da chave da NF-e" /></Field>
              </div>
            </Section>

            <Section title="Impostos e valores">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[['baseCalcIcms', 'Base de cálculo ICMS'], ['valorIcms', 'Valor ICMS'], ['baseCalcIcmsSub', 'Base ICMS ST'], ['valorIcmsSub', 'Valor ICMS ST'], ['valorIpi', 'Valor IPI'], ['valorFreteNFe', 'Frete'], ['valorSeguroNFe', 'Seguro'], ['descontoNFe', 'Desconto'], ['outrasDespNfe', 'Outras despesas']].map(([name, label]) => <Field key={name} label={label}><input className={input} type="number" min="0" step="0.01" name={name} value={form[name]} onChange={change} placeholder="0,00" /></Field>)}
              </div>
            </Section>

            <Section title="Transporte e volumes">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Transportador" className="sm:col-span-2"><select className={input} name="codTransp" value={form.codTransp} onChange={(event) => setForm((atual) => ({ ...atual, codTransp: event.target.value, codVeic: '' }))}><option value="">Sem transportador</option>{transportadores.map((t) => <option key={t.codTransp} value={t.codTransp}>{t.transportador}</option>)}</select></Field>
                <Field label="Frete por conta"><select className={input} name="fretePorContaNFe" value={form.fretePorContaNFe} onChange={change}><option value="">Selecione...</option><option value="0">0 — Emitente</option><option value="1">1 — Destinatário</option><option value="2">2 — Terceiros</option><option value="9">9 — Sem frete</option></select></Field>
                <Field label="Veículo"><select className={input} name="codVeic" value={form.codVeic} onChange={change}><option value="">Sem veículo</option>{veiculosFiltrados.map((v) => <option key={v.codVeiculo} value={v.codVeiculo}>{v.placaMercosul || v.placaVeiculo || `Veículo ${v.codVeiculo}`}</option>)}</select></Field>
                <Field label="Quantidade de volumes"><input className={input} type="number" min="0" name="qtdadeVol" value={form.qtdadeVol} onChange={change} /></Field>
                <Field label="Espécie"><input className={input} maxLength="50" name="especieVol" value={form.especieVol} onChange={change} /></Field>
                <Field label="Marca"><input className={input} maxLength="50" name="marcaVol" value={form.marcaVol} onChange={change} /></Field>
                <Field label="Numeração"><input className={input} maxLength="60" name="numVol" value={form.numVol} onChange={change} /></Field>
                <Field label="Peso bruto"><input className={input} type="number" min="0" step="0.01" name="pesoBrutoVol" value={form.pesoBrutoVol} onChange={change} /></Field>
                <Field label="Peso líquido"><input className={input} type="number" min="0" step="0.01" name="pesoLiqVol" value={form.pesoLiqVol} onChange={change} /></Field>
              </div>
            </Section>

            <Section title="Contas a pagar" description="As parcelas serão vinculadas automaticamente à chave desta compra.">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-stone-gray">Total parcelado</p><p className="text-xl font-medium">{totalParcelas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
                <button type="button" onClick={adicionarParcela} className="flex items-center gap-2 rounded-full border border-sandstone px-4 py-2 text-sm hover:border-fresh-grass"><Plus size={16} /> Adicionar parcela</button></div>
              <div className="space-y-3">
                {parcelas.length === 0 ? <div className="rounded-2xl border border-dashed border-sandstone p-8 text-center text-sm text-stone-gray">Nenhuma parcela adicionada. A compra pode ser salva sem contas a pagar.</div> : parcelas.map((p, index) => <div key={index} className="grid items-end gap-3 rounded-2xl bg-cream-paper/60 p-4 sm:grid-cols-[90px_1fr_1fr_1.3fr_44px]">
                  <Field label="Parcela"><input className={input} type="number" min="1" value={p.numParcela} onChange={(e) => alterarParcela(index, 'numParcela', e.target.value)} required /></Field>
                  <Field label="Vencimento" required><input className={input} type="date" value={p.vencimentoParcela} onChange={(e) => alterarParcela(index, 'vencimentoParcela', e.target.value)} required /></Field>
                  <Field label="Valor" required><input className={input} type="number" min="0.01" step="0.01" value={p.valorParcela} onChange={(e) => alterarParcela(index, 'valorParcela', e.target.value)} required /></Field>
                  <Field label="Forma de pagamento" required><select className={input} value={p.codFormaPagamento} onChange={(e) => alterarParcela(index, 'codFormaPagamento', e.target.value)} required><option value="">Selecione...</option>{formas.map((f) => <option key={f.codFormaPagamento} value={f.codFormaPagamento}>{f.formaPagamento}</option>)}</select></Field>
                  <button type="button" onClick={() => removerParcela(index)} className="mb-px flex h-11 w-11 items-center justify-center rounded-full text-stone-gray hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></button>
                </div>)}
              </div>
            </Section>

            <Section title="Informações complementares"><textarea className="w-full px-4 py-3 text-sm" name="infComp" value={form.infComp} onChange={change} placeholder="Observações da nota ou da entrada..." /></Section>

            <div className="flex flex-col-reverse justify-end gap-3 border-t border-sandstone pt-6 sm:flex-row">
              <Link to="/compras" className="rounded-full border border-sandstone px-6 py-2.5 text-center text-sm hover:bg-cream-paper">Cancelar</Link>
              <button type="submit" disabled={saving || loadingOptions} className="flex items-center justify-center gap-2 bg-black px-6 py-2.5 text-sm text-white disabled:opacity-50">{saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}{saving ? 'Salvando...' : 'Salvar compra'}</button>
            </div>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}
