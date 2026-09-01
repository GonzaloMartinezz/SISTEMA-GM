import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Filter, ArrowUpDown, Plus, Download, MoreVertical, 
  CheckSquare, Square, Share2, Star, Copy, ChevronRight, Eye, UserPlus
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useClient } from '../../context/ClientContext';
import NewClientModal from './NewClientModal';

// Utilidad para formatear fechas
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Mapeo de status para replicar el estilo de la imagen
const getStatusBadge = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('contacto') || s.includes('comienzo')) {
    return { text: 'Prospective', dot: 'bg-green-500', color: 'text-green-600' };
  }
  if (s.includes('proceso') || s.includes('seguimiento') || s.includes('negociación')) {
    return { text: 'In Negotiation', dot: 'bg-orange-500', color: 'text-orange-600' };
  }
  if (s.includes('cerrado') || s.includes('afiliado')) {
    return { text: 'Accepted', dot: 'bg-green-500', color: 'text-green-600' };
  }
  if (s.includes('perdido') || s.includes('rechazado')) {
    return { text: 'Rejected', dot: 'bg-red-500', color: 'text-red-600' };
  }
  return { text: 'Under Review', dot: 'bg-purple-500', color: 'text-purple-600' };
};

export default function ClientTable() {
  const { openClientProfile } = useClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Cargar clientes
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  // Filtrado por búsqueda
  const filteredClients = useMemo(() => {
    return clients.filter(client => 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.clinic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.zone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  // Resetear página al buscar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Cálculos de Paginación
  const totalItems = filteredClients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedClients.length && paginatedClients.length > 0) {
      setSelectedIds([]); // Deseleccionar todos
    } else {
      setSelectedIds(paginatedClients.map(c => c.id)); // Seleccionar todos de la página actual
    }
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    setFavorites(newFavs);
  };

  // Generador de números de página
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      
      {/* Top Breadcrumb & Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center text-[13px]">
          <span className="text-slate-500 hover:text-slate-700 cursor-pointer flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Dashboard
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 mx-1.5" />
          <span className="text-slate-500 hover:text-slate-700 cursor-pointer">Data</span>
          <ChevronRight className="w-3 h-3 text-slate-400 mx-1.5" />
          <span className="text-slate-900 font-bold flex items-center gap-2">
            Business Partner CRM
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </div>
        
        {/* Centered Search Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
            <input 
              type="text" 
              placeholder="Search by name, clinic, status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-purple-300 rounded-full py-1.5 pl-9 pr-8 text-sm text-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors shadow-sm"
            />
            {searchTerm && (
              <XIcon 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" 
                onClick={() => setSearchTerm('')} 
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            <img src="https://ui-avatars.com/api/?name=U1&background=F3E8FF&color=9333EA&size=100" alt="user" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
            <img src="https://ui-avatars.com/api/?name=U2&background=FFE4E6&color=E11D48&size=100" alt="user" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
            <img src="https://ui-avatars.com/api/?name=U3&background=E0E7FF&color=4F46E5&size=100" alt="user" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
            <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">+4</div>
          </div>
          <button className="text-slate-600 text-sm font-medium hover:text-slate-800 ml-2">Add</button>
          <button className="flex items-center gap-1.5 text-purple-600 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-md ml-1"><LayoutGridIcon className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Main Header / Title (Second Row) */}
      <div className="flex items-center px-6 py-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4">
          <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Business partner CRM</h2>
          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">New Data</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center gap-3 text-[13px]">
          <button onClick={fetchClients} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-purple-600 border border-purple-200 bg-white hover:bg-purple-50 transition-colors font-medium">
            <RefreshIcon className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Update
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-medium">
            {selectedIds.length} Selected
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-medium">
            <Filter className="w-3.5 h-3.5" /> Filter <span className="bg-red-100 text-red-600 px-1.5 rounded text-[10px] font-bold ml-1">4</span>
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" /> Short <ChevronDownIcon className="w-3.5 h-3.5 ml-1" />
          </button>
          
          <span className="text-slate-400 font-medium ml-2">{totalItems} Results</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-[13px] font-medium">
            <Download className="w-4 h-4" /> Import/Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-[13px] font-medium">
            <Eye className="w-4 h-4" /> View
          </button>
          <button className="p-1.5 rounded-lg text-slate-400 border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto overflow-x-auto bg-white">
        <table className="w-full text-left text-[13px] whitespace-nowrap min-w-[1200px]">
          <thead className="text-slate-500 sticky top-0 bg-white z-10 border-b border-slate-100 font-medium shadow-sm">
            <tr>
              <th className="px-4 py-3 w-10 text-center font-normal">
                <button onClick={toggleSelectAll}>
                   {selectedIds.length === paginatedClients.length && paginatedClients.length > 0 ? <CheckSquare className="w-4 h-4 text-[#8B5CF6]" /> : <Square className="w-4 h-4 text-slate-300" />}
                </button>
              </th>
              <th className="px-2 py-3 w-10 font-normal"><Star className="w-4 h-4 text-slate-300" /></th>
              <th className="px-4 py-3 font-normal cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2">Client Name <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="px-4 py-3 font-normal cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2">Company <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="px-4 py-3 font-normal cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2">Listing Price <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="px-4 py-3 font-normal cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2">Address <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="px-2 py-3 font-normal w-10"></th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Date</th>
              <th className="px-4 py-3 font-normal">Categories</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td colSpan="10" className="text-center py-12">
                  <div className="flex justify-center"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
                </td>
              </tr>
            ) : paginatedClients.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-12 text-slate-400">
                  No clients found.
                </td>
              </tr>
            ) : paginatedClients.map((client, idx) => {
              const statusBadge = getStatusBadge(client.status);
              const isSelected = selectedIds.includes(client.id);
              const isFav = favorites.has(client.id);
              
              // Colors for initials
              const colors = ['bg-[#8B5CF6]', 'bg-[#10B981]', 'bg-[#F43F5E]', 'bg-[#06B6D4]', 'bg-[#F59E0B]'];
              const colorClass = colors[idx % colors.length];

              return (
                <tr 
                  key={client.id} 
                  onClick={() => openClientProfile({ ...client, scoring: client.score || 50 })}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3 text-center" onClick={(e) => toggleSelect(client.id, e)}>
                    {isSelected ? <CheckSquare className="w-4 h-4 text-[#8B5CF6]" /> : <Square className="w-4 h-4 text-slate-200 group-hover:text-slate-300" />}
                  </td>
                  <td className="px-2 py-3" onClick={(e) => toggleFavorite(client.id, e)}>
                    {isFav ? <Star className="w-4 h-4 text-[#8B5CF6] fill-[#8B5CF6]" /> : <Star className="w-4 h-4 text-slate-200 group-hover:text-slate-300" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${client.name.replace(' ','+')}&background=F3E8FF&color=9333EA&size=100`} alt="avatar" className="w-6 h-6 rounded-full" />
                      <span className="font-medium text-slate-700">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${colorClass}`}>
                        {client.clinic ? client.clinic.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <span className="text-slate-600 font-medium">{client.clinic || client.specialty}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    ${(client.score * 125000).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <span className="truncate max-w-[200px] inline-block">{client.zone || 'Sin dirección'}</span>
                  </td>
                  <td className="px-2 py-3 text-slate-300 hover:text-slate-500">
                    <Copy className="w-4 h-4" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(client.zone || ''); }}/>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></div>
                      <span className={`text-[12px] font-medium ${statusBadge.color}`}>{statusBadge.text}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[12px]">
                    {formatDate(client.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[11px] font-semibold border border-purple-100">B2B</span>
                      <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-[11px] font-semibold border border-green-100">Tech</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-white shrink-0 text-[13px] text-slate-500">
        <div>{totalItems > 0 ? `${startIndex + 1}-${endIndex} of ${totalItems}` : '0 of 0'}</div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-50"
          ><ChevronsLeftIcon className="w-4 h-4" /></button>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-50"
          ><ChevronLeftIcon className="w-4 h-4" /></button>
          
          {getPageNumbers().map(num => (
            <button 
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-7 h-7 flex items-center justify-center rounded ${
                currentPage === num ? 'bg-purple-50 text-purple-600 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              {num}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-50"
          ><ChevronRight className="w-4 h-4" /></button>
          
          <button 
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-50"
          ><ChevronsRightIcon className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center gap-2">
          <span>Row/Page:</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-slate-200 rounded-md px-2 py-1 outline-none focus:border-purple-500 bg-white text-slate-700"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      
      <NewClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchClients} 
      />
    </div>
  );
}

// Iconos adicionales
const RefreshIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
);
const XIcon = ({ className, onClick }) => (
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const ChevronLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronsLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
);
const ChevronsRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/></svg>
);
const ChevronDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);
const LayoutGridIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);
