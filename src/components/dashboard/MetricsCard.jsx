import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { DollarSign, TrendingUp, PackageSearch, Users } from 'lucide-react';

export default function MetricsCard({ title, value, subtitle, icon: Icon, trend = "up", glow = false }) {
  return (
    <GlassCard glow={glow} className="flex flex-col gap-4 relative overflow-hidden group">
      {/* Background Neon Accent Glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${glow ? 'bg-primary' : 'bg-surfaceHighlight'}`}></div>
      
      <div className="flex justify-between items-start z-10">
        <div>
          <p className="text-textMuted text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-text">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${glow ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surfaceHighlight text-textMuted'}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      <div className="z-10 flex items-center gap-2 text-sm">
        <span className={trend === "up" ? "text-primary" : "text-accent"}>
          {trend === "up" ? "↑" : "↓"} {subtitle.split(' ')[0]}
        </span>
        <span className="text-textMuted">{subtitle.split(' ').slice(1).join(' ')}</span>
      </div>
    </GlassCard>
  );
}
