import { useState } from 'react';
import { 
  Printer, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  ChevronUp
} from 'lucide-react';
import AnimatedPage from './AnimatedPage';

export default function Estoque() {
  const [expandedRows, setExpandedRows] = useState({ 1: true });

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tableData = [
    {
      id: 1,
      name: 'Electronics (14)',
      featured: false,
      stock: '3 products',
      status: 'Active',
      isParent: true,
      children: [
        { id: 11, name: 'Laptops (7)', featured: true, stock: '5 products', status: 'Inactive', isParent: true },
        { 
          id: 12, 
          name: 'Accessories (2)', 
          featured: false, 
          stock: '-', 
          status: 'Active', 
          isParent: true,
          children: [
            { id: 121, name: 'Keyboards 2024', featured: true, stock: '-', status: 'Active', isParent: false },
            { id: 122, name: 'Mice & Pointers', featured: true, stock: '9 products', status: 'Active', isParent: false },
          ]
        },
        { id: 13, name: 'Monitors (5)', featured: false, stock: '13 products', status: 'Inactive', isParent: true }
      ]
    },
    { id: 2, name: 'Furniture (12)', featured: false, stock: '-', status: 'Inactive', isParent: true },
    { id: 3, name: 'Office Supplies (12)', featured: true, stock: '10 products', status: 'Active', isParent: true },
    { id: 4, name: 'Software (15)', featured: false, stock: '-', status: 'Active', isParent: true },
    { id: 5, name: 'Health and Beauty (10)', featured: true, stock: '5 products', status: 'Inactive', isParent: true },
    { id: 6, name: 'Ralph Lauren', featured: false, stock: '3 products', status: 'Active', isParent: true },
    { id: 7, name: 'Alienware', featured: true, stock: '11 products', status: 'Inactive', isParent: true },
  ];

  const renderRow = (item, level = 0) => {
    const isExpanded = expandedRows[item.id];
    
    return (
      <div key={item.id} className="flex flex-col">
        {/* Row */}
        <div className="flex items-center py-3 border-b border-gray-100 hover:bg-gray-50/50 transition-colors px-6">
          
          {/* Name Column with Indentation */}
          <div className="w-1/3 flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            {item.isParent ? (
              <button 
                onClick={() => toggleRow(item.id)}
                className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-blue-500 hover:bg-blue-50"
              >
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            ) : (
              <div className="w-5 h-5" /> // Spacer for alignment
            )}
            <span className="text-[14px] text-gray-800 font-medium">{item.name}</span>
          </div>

          {/* Featured */}
          <div className="w-1/6 flex justify-center">
            {item.featured ? (
              <CheckCircle2 size={18} className="text-emerald-500" />
            ) : (
              <XCircle size={18} className="text-gray-400" />
            )}
          </div>

          {/* Stock/Products */}
          <div className="w-1/6 flex justify-center text-[13px] text-gray-600">
            {item.stock}
          </div>

          {/* Status */}
          <div className="w-1/6 flex justify-center">
            <button className="flex items-center justify-between w-24 px-2.5 py-1.5 border border-gray-200 rounded-md bg-white text-[12px] font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                {item.status}
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>

          {/* Actions */}
          <div className="w-1/6 flex justify-center gap-2">
            <button className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded text-[12px] font-medium transition-colors">
              <Pencil size={12} />
              Edit
            </button>
            <button className="flex items-center justify-center w-8 h-8 border border-gray-200 rounded bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Render Children if Expanded */}
        {isExpanded && item.children && (
          <div className="flex flex-col relative">
            {/* Indentation guides can be added here if needed */}
            {item.children.map(child => renderRow(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-8 text-gray-800 font-sans">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <div className="min-w-[900px]">
          
          {/* Header Section */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-3">
                  <span className="hover:text-blue-500 cursor-pointer">Dashboard</span>
                  <ChevronRight size={12} />
                  <span className="hover:text-blue-500 cursor-pointer">Product</span>
                  <ChevronRight size={12} />
                  <span className="text-blue-500">Categories</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
              </div>

              {/* Top Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="flex items-center justify-center w-9 h-9 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition-colors">
                  <Printer size={16} />
                </button>
                <button className="flex items-center justify-center w-9 h-9 rounded bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors">
                  <Download size={16} />
                </button>
                <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                  <Plus size={16} />
                  New Category
                </button>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Filter size={14} />
                Filters
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="flex items-center py-3 border-b border-gray-200 bg-gray-50 px-6 min-w-full">
            <div className="w-1/3 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1 cursor-pointer">
              Name
              <div className="flex flex-col opacity-50">
                <ChevronUp size={10} className="-mb-1" />
                <ChevronDown size={10} />
              </div>
            </div>
            <div className="w-1/6 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer">
              Featured
              <div className="flex flex-col opacity-50">
                <ChevronUp size={10} className="-mb-1" />
                <ChevronDown size={10} />
              </div>
            </div>
            <div className="w-1/6 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer">
              Products
              <div className="flex flex-col opacity-50">
                <ChevronUp size={10} className="-mb-1" />
                <ChevronDown size={10} />
              </div>
            </div>
            <div className="w-1/6 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer">
              Status
              <div className="flex flex-col opacity-50">
                <ChevronUp size={10} className="-mb-1" />
                <ChevronDown size={10} />
              </div>
            </div>
            <div className="w-1/6 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-center">
              Active
            </div>
          </div>

          {/* Table Body (Tree Grid) */}
          <div className="flex flex-col pb-4 min-w-full">
            {tableData.map(item => renderRow(item))}
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white min-w-full">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-gray-500">Results per page:</span>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-[12px] font-medium text-gray-700 hover:bg-gray-50">
                12
                <ChevronDown size={14} className="text-gray-400" />
              </button>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <ChevronRight size={14} className="rotate-180" />
                Previous
              </button>
              
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-[12px] font-medium text-gray-600 hover:bg-gray-50">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-indigo-500 text-white text-[12px] font-medium shadow-sm">2</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-[12px] font-medium text-gray-600 hover:bg-gray-50">3</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-[12px] font-medium text-gray-600 hover:bg-gray-50">...</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-[12px] font-medium text-gray-600 hover:bg-gray-50">8</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-[12px] font-medium text-gray-600 hover:bg-gray-50">9</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-[12px] font-medium text-gray-600 hover:bg-gray-50">10</button>

              <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          </div> 
        </div>  
      </div> 
    </AnimatedPage>
  );
}

