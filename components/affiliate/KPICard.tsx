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
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-400/30',
    green: 'from-green-500/20 to-green-600/20 border-green-400/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/30',
    pink: 'from-pink-500/20 to-pink-600/20 border-pink-400/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`
        bg-linear-to-br ${colorClasses[color]}
        backdrop-blur-md rounded-xl border p-6
        hover:scale-105 transition-transform duration-300
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-white/70 text-sm font-medium">{label}</span>
        <i className={`pi ${icon} text-white/50 text-xl`} />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-xs text-white/60">{subtitle}</div>}
    </motion.div>
  );
}
