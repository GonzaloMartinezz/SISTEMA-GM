import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function NeonButton({ children, className, variant = 'primary', ...props }) {
  const baseStyles = "px-6 py-2 rounded-md font-semibold transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
  
  const variants = {
    primary: "bg-primary/10 text-primary border border-primary hover:bg-primary/20 hover:shadow-neon-cyan focus:ring-primary",
    secondary: "bg-secondary/10 text-secondary border border-secondary hover:bg-secondary/20 hover:shadow-neon-purple focus:ring-secondary",
    danger: "bg-accent/10 text-accent border border-accent hover:bg-accent/20 hover:shadow-[0_0_10px_#ff0055,0_0_20px_#ff0055] focus:ring-accent",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
