import React from 'react';
import { cn } from './NeonButton';

export function GlassCard({ children, className, glow = false, ...props }) {
  return (
    <div 
      className={cn(
        "bg-surface/60 backdrop-blur-md border border-surfaceHighlight rounded-xl p-6",
        glow && "shadow-[0_0_15px_rgba(0,255,204,0.1)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
