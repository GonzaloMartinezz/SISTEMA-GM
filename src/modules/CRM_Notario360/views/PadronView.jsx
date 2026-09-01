import React, { useState } from 'react';
import { Filter, Download, Plus, ChevronDown, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import Notario360Slideover from '../components/Notario360Slideover';

export default function PadronView() {
  const [selectedClient, setSelectedClient] = useState(null);

  const leads = [
    { id: 1, name: 'Marcela Torres', company: 'Odontología Torres', price: '$15,900', status: 'Hot Lead', date: 'Hace 2 días', nextStep: 'Start implementation', progress: 85, color: 'red' },
    { id: 2, name: 'Azizay Muscry', company: 'Pollinate', price: '$8,500', status: 'Cold Lead', date: 'Hace 1 mes', nextStep: 'Reassess and re-approach', progress: 20, color: 'blue' },
    { id: 3, name: 'Rachel Vigmel', company: 'Eclipseful', price: '$3,000', status: 'Warm Lead', date: 'Hace 1 semana', nextStep: 'Set up initial meeting', progress: 50, color: 'yellow' },
    { id: 4, name: 'Saliem Mewd', company: 'Solaris Energy', price: '$10,000', status: 'In Negotiation', date: 'Hace 3 días', nextStep: 'Discuss collaboration...', progress: 75, color: 'purple' },
    { id: 5, name: 'Kae Sank Pank', company: 'Spherule', price: '$9,850', status: 'Under Review', date: 'Hace 2 semanas', nextStep: 'Negotiate final terms', progress: 60, color: 'green' },
    { id: 6, name: 'Giebran Reka', company: 'Sisyphus', price: '$10,700', status: 'Prospecting', date: 'Hace 1 mes', nextStep: 'Set follow-up meeting', progress: 10, color: 'gray' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Hot Lead': return 'bg-red-100 text-red-600';
      case 'Cold Lead': return 'bg-blue-100 text-blue-600';
      case 'Warm Lead': return 'bg-yellow-100 text-yellow-700';
      case 'In Negotiation': return 'bg-purple-100 text-purple-600';
      case 'Under Review': return 'bg-indigo-100 text-indigo-600';
      case 'Prospecting': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      <div className="h-full bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="px-4 py-1.5 bg-white text-gray-800 rounded-md shadow-sm text-sm font-medium">List</button>
            <button className="px-4 py-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium">Grid</button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 shadow-sm ml-2">
              <Plus className="w-4 h-4" /> Add New Lead
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-100">
              <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-50">Cliente / Lead <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-50">Compañía <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-50">Listed Price <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-50">Status <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-50">Date <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-50">Next Step <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                  onClick={() => setSelectedClient(lead)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-${lead.color}-100 flex items-center justify-center text-${lead.color}-600 font-bold text-xs`}>
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-sm bg-${lead.color}-500/20 flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-sm bg-${lead.color}-500`}></div>
                      </div>
                      {lead.company}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{lead.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{lead.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{lead.nextStep}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={(e) => { e.stopPropagation(); /* Menu Options */ }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>Leads per page</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 text-gray-400 hover:text-gray-700"><ChevronLeft className="w-5 h-5" /></button>
            <button className="w-8 h-8 bg-gray-900 text-white rounded-md font-medium">1</button>
            <button className="w-8 h-8 hover:bg-gray-100 rounded-md font-medium text-gray-700">2</button>
            <button className="w-8 h-8 hover:bg-gray-100 rounded-md font-medium text-gray-700">3</button>
            <span className="px-1">...</span>
            <button className="w-8 h-8 hover:bg-gray-100 rounded-md font-medium text-gray-700">12</button>
            <button className="p-1 text-gray-400 hover:text-gray-700"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

      </div>

      <Notario360Slideover 
        isOpen={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        client={selectedClient}
      />
    </>
  );
}
