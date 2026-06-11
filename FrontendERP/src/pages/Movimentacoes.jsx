import { useState } from 'react';
import {
  Plus, Search, Filter, ChevronDown, ChevronUp, ChevronRight,
  Printer, Download, ArrowUpRight, ArrowDownLeft, X, Package
} from 'lucide-react';
import AnimatedPage from './AnimatedPage';

// ─── Shared Pill Badge ───────────────────────────────────────────────────────
function Badge({ type }) {
  const map = {
    Entrada:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    Saída:    'bg-red-50 text-red-600 border-red-200',
    Aprovado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pendente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Cancelado:'bg-red-50 text-red-600 border-red-200',
  };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${map[type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {(type === 'Entrada') && <ArrowDownLeft size={11} />}
      {(type === 'Saída')   && <ArrowUpRight  size={11} />}
      {type}
    </span>
  );
}

// ─── Table Shell ─────────────────────────────────────────────────────────────
function TableShell({ columns, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse" style={{ minWidth: 780 }}>
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            {columns.map(col => (
              <th key={col.label} className={`py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${col.align === 'right' ? 'text-right' : ''}`}>
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  <span className="flex flex-col opacity-40"><ChevronUp size={9} className="-mb-0.5"/><ChevronDown size={9}/></span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

// ─── Modal base ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors"><X size={20}/></button>
        </div>
        <div className="px-8 py-6">{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, type = 'text', children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">{label}</label>
      {children ?? <input type={type} className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" {...props} />}
    </div>
  );
}

// ─── MOVIMENTAÇÕES tab ───────────────────────────────────────────────────────
const movimentos = [
  { id: 'MOV-001', data: '10/06/2026', produto: 'MacBook Pro 16"',   tipo: 'Entrada',  qty: 10, origem: 'Pedido PO-2024',  responsavel: 'moha' },
  { id: 'MOV-002', data: '10/06/2026', produto: 'Dell UltraSharp 27"', tipo: 'Saída', qty:  2, origem: 'Venda VND-088',   responsavel: 'moha' },
  { id: 'MOV-003', data: '09/06/2026', produto: 'Herman Miller Aeron', tipo: 'Entrada', qty:  5, origem: 'Pedido PO-2023', responsavel: 'moha' },
  { id: 'MOV-004', data: '09/06/2026', produto: 'Keychron K2 Keyboard',tipo: 'Saída', qty:  3, origem: 'Venda VND-085',   responsavel: 'moha' },
  { id: 'MOV-005', data: '08/06/2026', produto: 'Sony WH-1000XM5',    tipo: 'Entrada', qty: 12, origem: 'Pedido PO-2021', responsavel: 'moha' },
];

function MovimentacoesTab() {
  const [showModal, setShowModal] = useState(false);

  const cols = [
    { label: 'ID' }, { label: 'Data' }, { label: 'Produto' },
    { label: 'Tipo' }, { label: 'Quantidade', align:'right' },
    { label: 'Origem' }, { label: 'Responsável' },
  ];

  return (
    <>
      <TableShell columns={cols}>
        {movimentos.map(m => (
          <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4 text-xs text-gray-400 font-medium">{m.id}</td>
            <td className="py-4 px-4 text-sm text-gray-600">{m.data}</td>
            <td className="py-4 px-4 text-sm font-medium text-gray-800">{m.produto}</td>
            <td className="py-4 px-4"><Badge type={m.tipo} /></td>
            <td className="py-4 px-4 text-sm text-right font-semibold text-gray-700">{m.qty}</td>
            <td className="py-4 px-4 text-sm text-gray-500">{m.origem}</td>
            <td className="py-4 px-4 text-sm text-gray-500">{m.responsavel}</td>
          </tr>
        ))}
      </TableShell>

      {showModal && (
        <Modal title="Registrar Movimentação" onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-2 gap-5">
            <FormField label="Produto" />
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Tipo</label>
              <select className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Entrada</option>
                <option>Saída</option>
              </select>
            </div>
            <FormField label="Quantidade" type="number" />
            <FormField label="Origem / Referência" />
            <FormField label="Data" type="date" />
            <FormField label="Observação" />
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
            <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">Registrar</button>
          </div>
        </Modal>
      )}

      {/* FAB */}
      <div className="mt-5 flex justify-end">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus size={16}/> Nova Movimentação
        </button>
      </div>
    </>
  );
}

// ─── PEDIDOS DE COMPRA tab ────────────────────────────────────────────────────
const pedidos = [
  { id: 'PO-2024', data: '10/06/2026', fornecedor: 'Apple Brasil',   itens: 3, total: 'R$ 48.000',  status: 'Pendente'  },
  { id: 'PO-2023', data: '09/06/2026', fornecedor: 'Herman Miller',   itens: 1, total: 'R$ 9.600',   status: 'Aprovado'  },
  { id: 'PO-2022', data: '08/06/2026', fornecedor: 'Dell Tecnologia', itens: 2, total: 'R$ 21.000',  status: 'Aprovado'  },
  { id: 'PO-2021', data: '07/06/2026', fornecedor: 'Sony Brasil',     itens: 5, total: 'R$ 14.400',  status: 'Aprovado'  },
  { id: 'PO-2020', data: '05/06/2026', fornecedor: 'Logitech',        itens: 4, total: 'R$ 3.200',   status: 'Cancelado' },
];

function PedidosTab() {
  const [showModal, setShowModal]     = useState(false);
  const [selected, setSelected]       = useState(null);
  const [items, setItems]             = useState([{ produto: '', qty: 1, unitario: '' }]);

  const addItem = () => setItems(p => [...p, { produto: '', qty: 1, unitario: '' }]);
  const removeItem = idx => setItems(p => p.filter((_, i) => i !== idx));

  const cols = [
    { label: 'Pedido' }, { label: 'Data' }, { label: 'Fornecedor' },
    { label: 'Itens', align:'right' }, { label: 'Total', align:'right' },
    { label: 'Status' }, { label: 'Ações' },
  ];

  return (
    <>
      <TableShell columns={cols}>
        {pedidos.map(p => (
          <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(p)}>
            <td className="py-4 px-4 text-xs text-gray-400 font-medium">{p.id}</td>
            <td className="py-4 px-4 text-sm text-gray-600">{p.data}</td>
            <td className="py-4 px-4 text-sm font-medium text-gray-800">{p.fornecedor}</td>
            <td className="py-4 px-4 text-sm text-right text-gray-600">{p.itens}</td>
            <td className="py-4 px-4 text-sm text-right font-semibold text-gray-800">{p.total}</td>
            <td className="py-4 px-4"><Badge type={p.status} /></td>
            <td className="py-4 px-4">
              <button onClick={e => { e.stopPropagation(); setSelected(p); }}
                className="flex items-center gap-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-md font-medium transition-colors">
                Ver detalhes <ChevronRight size={12}/>
              </button>
            </td>
          </tr>
        ))}
      </TableShell>

      <div className="mt-5 flex justify-end">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus size={16}/> Novo Pedido de Compra
        </button>
      </div>

      {/* Detail Modal */}
      {selected && (
        <Modal title={`Pedido ${selected.id}`} onClose={() => setSelected(null)}>
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div><span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Fornecedor</span><span className="font-medium text-gray-800">{selected.fornecedor}</span></div>
            <div><span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Data</span><span className="font-medium text-gray-800">{selected.data}</span></div>
            <div><span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Total</span><span className="font-semibold text-gray-900 text-base">{selected.total}</span></div>
            <div><span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Status</span><Badge type={selected.status}/></div>
          </div>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr><th className="px-4 py-2 text-left">Produto</th><th className="px-4 py-2 text-right">Qtd</th><th className="px-4 py-2 text-right">Unit.</th></tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100"><td className="px-4 py-3 text-gray-700">Item mockado</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right">—</td></tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setSelected(null)} className="px-5 py-2 text-sm text-gray-600 hover:text-gray-900">Fechar</button>
            <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">Aprovar</button>
          </div>
        </Modal>
      )}

      {/* New Order Modal */}
      {showModal && (
        <Modal title="Novo Pedido de Compra" onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-2 gap-5 mb-6">
            <FormField label="Fornecedor" />
            <FormField label="Data prevista de entrega" type="date" />
            <div className="col-span-2"><FormField label="Observações" /></div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Itens do Pedido</span>
            <button onClick={addItem} className="text-xs text-indigo-500 hover:underline flex items-center gap-1"><Plus size={12}/>Adicionar item</button>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr><th className="px-3 py-2 text-left">Produto</th><th className="px-3 py-2 text-right">Qtd</th><th className="px-3 py-2 text-right">Preço Unit.</th><th className="px-3 py-2"></th></tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="px-3 py-2"><input className="w-full text-sm border-0 focus:outline-none" placeholder="Nome do produto" /></td>
                    <td className="px-3 py-2 w-16"><input type="number" className="w-full text-sm text-right border-0 focus:outline-none" defaultValue={1} /></td>
                    <td className="px-3 py-2 w-28"><input className="w-full text-sm text-right border-0 focus:outline-none" placeholder="R$ 0,00" /></td>
                    <td className="px-3 py-2 w-8">
                      <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-400 transition-colors"><X size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
            <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">Criar Pedido</button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TABS = ['Movimentações', 'Pedidos de Compra'];

export default function Movimentacoes() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-8 text-gray-800 font-sans">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-3">
                  <span className="hover:text-indigo-500 cursor-pointer">Dashboard</span>
                  <ChevronRight size={12}/>
                  <span className="text-indigo-500">Movimentações</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Movimentações &amp; Pedidos</h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center justify-center w-9 h-9 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition-colors"><Printer size={16}/></button>
                <button className="flex items-center justify-center w-9 h-9 rounded bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors"><Download size={16}/></button>
              </div>
            </div>

            {/* Search / Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Filter size={14}/> Filtros
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 py-4 px-1 mr-8 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === i
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {i === 0 && <ArrowDownLeft size={15}/>}
                {i === 1 && <Package size={15}/>}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="px-6 py-6">
            {activeTab === 0 && <MovimentacoesTab />}
            {activeTab === 1 && <PedidosTab />}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Resultados por página:</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50">12 <ChevronDown size={12}/></button>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50">
                <ChevronRight size={13} className="rotate-180"/> Anterior
              </button>
              {[1,2,3].map(n => (
                <button key={n} className={`w-8 h-8 flex items-center justify-center rounded text-xs font-medium ${n === 1 ? 'bg-indigo-500 text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{n}</button>
              ))}
              <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50">
                Próximo <ChevronRight size={13}/>
              </button>
            </div>
          </div>

        </div>
      </div>
    </AnimatedPage>
  );
}
