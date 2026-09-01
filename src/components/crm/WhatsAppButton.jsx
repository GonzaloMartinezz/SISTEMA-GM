import React from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '../ui/NeonButton';

export default function WhatsAppButton({ phone, message = "Hola, te contacto de SysMartinez.", className }) {
  const handleClick = (e) => {
    e.stopPropagation(); // Evita que el click se propague a la fila de la tabla
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center p-2 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all border border-[#25D366]/50 hover:shadow-[0_0_10px_rgba(37,211,102,0.5)]",
        className
      )}
      title="Click-to-chat WhatsApp"
      aria-label="Abrir WhatsApp"
    >
      <MessageCircle className="w-4 h-4" />
    </button>
  );
}
