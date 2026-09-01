import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { FileDown, Plus, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function QuoteGenerator() {
  const [clientName, setClientName] = useState("");
  const [items, setItems] = useState([{ desc: "", qty: 1, price: 0 }]);

  const handleAddItem = () => {
    setItems([...items, { desc: "", qty: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const total = items.reduce((acc, item) => acc + (item.qty * item.price), 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("COTIZACION COMERCIAL", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Cliente: ${clientName || 'Consumidor Final'}`, 14, 32);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 38);
    
    // Tabla
    const tableColumn = ["Descripción del Equipo", "Cantidad", "Precio Unitario (USD)", "Subtotal (USD)"];
    const tableRows = [];
    
    items.forEach(item => {
      const itemData = [
        item.desc || '-',
        item.qty,
        `$${item.price.toLocaleString()}`,
        `$${(item.qty * item.price).toLocaleString()}`
      ];
      tableRows.push(itemData);
    });
    
    doc.autoTable({
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [0, 255, 204], textColor: [10, 10, 10] }, // Neon Cyan head
    });
    
    // Total
    const finalY = doc.lastAutoTable.finalY || 45;
    doc.setFontSize(14);
    doc.text(`TOTAL: $${total.toLocaleString()} USD`, 14, finalY + 10);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Los precios están sujetos a variaciones del tipo de cambio.", 14, finalY + 25);
    doc.text("Documento generado por SysMartinez.", 14, finalY + 30);
    
    doc.save(`Cotizacion_${clientName || 'Cliente'}.pdf`);
  };

  return (
    <GlassCard className="flex flex-col h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-text">Generador de Cotizaciones</h3>
        <p className="text-sm text-textMuted">Crea presupuestos formales en PDF</p>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-xs font-medium text-textMuted mb-1">Nombre del Cliente / Clínica</label>
          <input 
            type="text" 
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full bg-background border border-surfaceHighlight rounded-md py-2 px-3 text-sm text-text focus:border-primary outline-none"
            placeholder="Ej: Centro Odontológico Ruiz"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-medium text-textMuted mb-1">Equipos a cotizar</label>
          {items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-3 items-end bg-surfaceHighlight/20 p-3 rounded-lg border border-surfaceHighlight">
              <div className="flex-1 w-full">
                <input 
                  type="text" 
                  placeholder="Descripción"
                  value={item.desc}
                  onChange={(e) => handleItemChange(index, 'desc', e.target.value)}
                  className="w-full bg-background border border-surfaceHighlight rounded-md py-2 px-3 text-sm text-text outline-none"
                />
              </div>
              <div className="w-full md:w-24">
                <input 
                  type="number" 
                  min="1"
                  placeholder="Cant"
                  value={item.qty}
                  onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 0)}
                  className="w-full bg-background border border-surfaceHighlight rounded-md py-2 px-3 text-sm text-text outline-none"
                />
              </div>
              <div className="w-full md:w-32">
                <input 
                  type="number" 
                  placeholder="Precio USD"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full bg-background border border-surfaceHighlight rounded-md py-2 px-3 text-sm text-text outline-none"
                />
              </div>
              <button 
                onClick={() => handleRemoveItem(index)}
                className="p-2 bg-accent/10 text-accent rounded-md hover:bg-accent/20 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <button 
            onClick={handleAddItem}
            className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" /> Agregar Ítem
          </button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-surfaceHighlight flex items-center justify-between">
        <div className="text-xl font-bold text-text">
          Total: <span className="text-primary">${total.toLocaleString()} USD</span>
        </div>
        <button 
          onClick={generatePDF}
          className="bg-primary/10 text-primary border border-primary/30 px-6 py-2 rounded-md font-semibold hover:bg-primary/20 hover:shadow-neon-cyan flex items-center gap-2 transition-all"
        >
          <FileDown className="w-4 h-4" /> Exportar PDF
        </button>
      </div>
    </GlassCard>
  );
}
