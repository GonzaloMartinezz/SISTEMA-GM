import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Lock, User, FileText, Send } from 'lucide-react';
import WhatsAppButton from '../components/crm/WhatsAppButton';

const mockBrochures = [
  { id: 1, title: "Sillón Odontológico Premium", category: "Odontología", url: "https://sysmartinez.com/pdf/sillon-premium.pdf" },
  { id: 2, title: "Ecógrafo Portátil VET 3000", category: "Veterinaria", url: "https://sysmartinez.com/pdf/ecografo-vet.pdf" },
  { id: 3, title: "Tomógrafo 3D Alta Resolución", category: "Diagnóstico", url: "https://sysmartinez.com/pdf/tomografo-3d.pdf" },
  { id: 4, title: "Kits Quirúrgicos (Catálogo Completo)", category: "Insumos", url: "https://sysmartinez.com/pdf/kits-quirurgicos.pdf" },
];

export default function BrochuresPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">Repositorio de Folletería Técnica</h2>
        <p className="text-textMuted">Documentos y especificaciones listos para compartir con tus clientes.</p>
      </div>

      <GlassCard className="flex-1 flex flex-col min-h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockBrochures.map(brochure => (
            <div key={brochure.id} className="bg-background border border-surfaceHighlight rounded-xl p-4 hover:border-primary/50 transition-colors flex flex-col group">
              <div className="flex-1">
                <div className="p-3 bg-surfaceHighlight/30 rounded-lg inline-block mb-3 group-hover:bg-primary/10 transition-colors">
                  <FileText className="w-6 h-6 text-textMuted group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-bold text-text text-sm mb-1">{brochure.title}</h3>
                <span className="text-xs bg-surfaceHighlight text-textMuted px-2 py-0.5 rounded">{brochure.category}</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-surfaceHighlight flex items-center justify-between">
                <a href={brochure.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline font-medium">
                  Ver PDF
                </a>
                <WhatsAppButton 
                  phone="" // Dejar vacío para que WhatsApp Web pregunte el contacto
                  message={`Hola! Te comparto el folleto técnico del equipo que conversamos: ${brochure.title}. Podés verlo aquí: ${brochure.url}`}
                  className="px-3 py-1.5 rounded bg-surfaceHighlight hover:bg-[#25D366]/20 border-none w-auto text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
