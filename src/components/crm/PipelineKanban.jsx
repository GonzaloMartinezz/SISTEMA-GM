import React, { useState, useEffect } from 'react';
import { useClient } from '../../context/ClientContext';
import { MoreHorizontal, Plus, MessageSquare, Paperclip, Circle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import NewLeadModal from './NewLeadModal';
import { updatePipelineStage } from '../../services/api';

const STAGES_CONFIG = [
  { id: 'comienzo', title: 'To-do', color: 'bg-slate-200' },
  { id: 'proceso', title: 'On Progress', color: 'bg-blue-200' },
  { id: 'convencer', title: 'In Review', color: 'bg-purple-200' },
  { id: 'posible', title: 'Completed', color: 'bg-green-200' },
];

// Helper para determinar estilos de prioridad
const getPriorityStyles = (score) => {
  if (score > 70) return { label: 'URGENT PRIORITY', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', icon: 'text-red-500' };
  if (score > 40) return { label: 'MODERATE PRIORITY', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', icon: 'text-orange-500' };
  return { label: 'LOW PRIORITY', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', icon: 'text-green-500' };
};

export default function PipelineKanban() {
  const { openClientProfile } = useClient();
  const [stages, setStages] = useState(STAGES_CONFIG.map(s => ({ ...s, items: [] })));
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState('comienzo');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pipeline_leads')
        .select(`
          id,
          stage_id,
          equipment,
          client_id,
          clients (
            id,
            name,
            clinic,
            specialty,
            score
          )
        `);

      if (error) throw error;

      // Agrupar leads por columna (mapeando a los nuevos 4 stages)
      const mappedData = (data || []).map(lead => {
        let sid = lead.stage_id;
        if (sid === 'comienzo') sid = 'comienzo';
        else if (sid === 'proceso') sid = 'proceso';
        else if (sid === 'convencer') sid = 'convencer';
        else sid = 'posible'; // fallback "Completed"
        return { ...lead, stage_id: sid };
      });

      const groupedStages = STAGES_CONFIG.map(config => {
        const leads = mappedData.filter(lead => lead.stage_id === config.id);
        return {
          ...config,
          items: leads.map(l => ({
            id: l.id,
            clientId: l.clients?.id,
            name: l.clients?.name || 'Desconocido',
            clinic: l.clients?.clinic || 'Sin clínica',
            specialty: l.clients?.specialty || '',
            equip: l.equipment || 'CRM Structure Plan',
            score: l.clients?.score || 50,
            tag: l.clients?.specialty === 'Odontología' ? 'Development' : 'Marketing'
          }))
        };
      });

      setStages(groupedStages);
    } catch (error) {
      console.error("Error al cargar pipeline:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = async (e, targetStageId) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    // Actualización optimista local
    setStages(prevStages => {
      const newStages = [...prevStages];
      let movedItem = null;
      
      for (let s of newStages) {
        const itemIdx = s.items.findIndex(i => i.id === leadId);
        if (itemIdx > -1) {
          movedItem = s.items.splice(itemIdx, 1)[0];
          break;
        }
      }
      
      if (movedItem) {
        const targetStage = newStages.find(s => s.id === targetStageId);
        if (targetStage) targetStage.items.push(movedItem);
      }
      
      return newStages;
    });

    try {
      await updatePipelineStage(leadId, targetStageId);
    } catch (error) {
      console.error("Error al actualizar lead:", error);
      fetchLeads(); 
    }
  };

  return (
    <>
    <div className="flex gap-4 md:gap-6 overflow-hidden p-2 md:p-6 h-full relative bg-white w-full">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-crmTeal border-t-transparent rounded-full animate-spin"></div>
            <span className="text-crmTeal font-bold tracking-wider text-sm uppercase">Cargando Tablero...</span>
          </div>
        </div>
      )}

      {/* Header global (mockup style) */}
      <div className="absolute top-0 left-0 w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white z-10 hidden">
        {/* Placeholder for global toolbar if needed later */}
      </div>

      {stages.map(stage => (
        <div 
          key={stage.id} 
          className="flex-1 min-w-0 flex flex-col bg-white rounded-[24px] border border-slate-200/60 p-4 shadow-sm"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage.id)}
        >
          {/* Header de la columna */}
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2.5">
              <Circle className={`w-3.5 h-3.5 fill-current ${stage.color.replace('bg-', 'text-')}`} />
              <h4 className="font-semibold text-slate-800 text-[15px] tracking-wide">{stage.title}</h4>
              <span className="bg-slate-100 text-slate-500 text-[11px] font-bold px-2 py-0.5 rounded-full ml-1">
                {stage.items.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setSelectedStage(stage.id); setIsModalOpen(true); }}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 pb-4">
            {stage.items.map(item => {
              const pStyle = getPriorityStyles(item.score);
              // Calculate segmented progress based on score (4 segments)
              const segments = 4;
              const filledSegments = Math.round((item.score / 100) * segments);
              
              return (
                <div 
                  key={item.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onClick={() => openClientProfile({
                    id: item.clientId,
                    name: item.name,
                    clinic: item.clinic,
                    specialty: item.specialty,
                    scoring: item.score,
                  })}
                  className="bg-white border border-slate-200 rounded-[20px] cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden flex flex-col"
                >
                  {/* Top Bar Color */}
                  <div className={`w-full py-2.5 px-4 flex justify-between items-center ${pStyle.bg}`}>
                     <div className={`flex items-center gap-1.5 ${pStyle.text} text-[10px] font-bold uppercase tracking-wider`}>
                        <svg className={`w-3.5 h-3.5 ${pStyle.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                        {pStyle.label}
                     </div>
                  </div>

                  <div className="p-4 pt-4 flex-1 flex flex-col">
                    <span className="text-[10px] font-medium text-slate-500 mb-2 inline-block bg-white px-2 py-0.5 rounded border border-slate-200 w-max shadow-sm">{item.tag}</span>
                    <h5 className="font-bold text-slate-900 text-[16px] mb-2 line-clamp-1">{item.equip}</h5>
                    <p className="text-[12px] text-slate-400 line-clamp-2 mb-5 leading-relaxed font-medium">
                      Lorem ipsum dolor sit amet consectetur. Nibh nulla id integer non fermentum eu...
                    </p>

                    {/* Progress bar segmented */}
                    <div className="mb-5 mt-auto">
                      <div className="flex justify-between text-[11px] text-slate-400 font-bold mb-2">
                        <span>Progress</span>
                        <span>{item.score}%</span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: segments }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1.5 flex-1 rounded-full ${i < filledSegments ? 'bg-[#4338CA]' : 'bg-slate-100'}`}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Footer del card */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-slate-400">
                         <div className="flex items-center gap-1.5 hover:text-slate-600 transition-colors cursor-pointer">
                           <MessageSquare className="w-4 h-4" />
                           <span className="text-[11px] font-bold">10</span>
                         </div>
                         <div className="flex items-center gap-1.5 hover:text-slate-600 transition-colors cursor-pointer">
                           <Paperclip className="w-4 h-4" />
                           <span className="text-[11px] font-bold">4</span>
                         </div>
                      </div>
                      <div className="flex items-center -space-x-2">
                        <img src={`https://ui-avatars.com/api/?name=${item.name.replace(' ','+')}&background=FBE5C8&color=c2410c&size=100`} alt="avatar" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                        <img src={`https://ui-avatars.com/api/?name=${item.clinic.replace(' ','+')}&background=A7E0DB&color=0f766e&size=100`} alt="avatar" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <button 
              onClick={() => {
                setSelectedStage(stage.id);
                setIsModalOpen(true);
              }}
              className="w-full py-3.5 flex items-center justify-center gap-2 rounded-xl text-slate-500 text-[13px] font-bold hover:text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors mt-1"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>
      ))}
    </div>
    <NewLeadModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSuccess={fetchLeads}
      initialStage={selectedStage}
    />
    </>
  );
}
