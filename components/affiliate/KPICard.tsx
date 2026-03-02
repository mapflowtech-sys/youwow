'use client';

import { motion } from 'framer-motion';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'pink';
  delay?: number;
}

export default function KPICard({ label, value, subtitle, icon, color, delay = 0 }: KPICardProps) {
  const colorClasses = {
    blue: 'border-primary/20 bg-primary/5',
    green: 'border-gold/20 bg-gold/5',
    purple: 'border-plum/20 bg-plum/5',
    pink: 'border-primary/20 bg-primary/5',
  };

  const iconColors = {
    blue: 'text-primary/50',
    green: 'text-gold/50',
    purple: 'text-plum/50',
    pink: 'text-primary/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`
        ${colorClasses[color]}
        rounded-2xl border p-6
        hover:scale-[1.02] transition-transform duration-300
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        <i className={`pi ${icon} ${iconColors[color]} text-xl`} />
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
    </motion.div>
  );
}
