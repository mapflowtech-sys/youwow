'use client';

import { motion } from 'framer-motion';

interface FinancialsSummaryProps {
  totalEarned: number;
  totalPaidOut: number;
  pendingPayout: number;
}

export default function FinancialsSummary({
  totalEarned,
  totalPaidOut,
  pendingPayout,
}: FinancialsSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <i className="pi pi-wallet text-plum text-xl" />
          <h3 className="text-foreground font-semibold text-lg">Финансы</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Total Earned */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground text-sm">Всего заработано</span>
          </div>
          <span className="text-foreground font-bold text-xl">
            {totalEarned.toFixed(0)}₽
          </span>
        </div>

        {/* Total Paid Out */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-plum" />
            <span className="text-muted-foreground text-sm">Выплачено</span>
          </div>
          <span className="text-foreground font-medium text-lg">
            {totalPaidOut.toFixed(0)}₽
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-4">
          {/* Pending Payout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-muted-foreground text-sm font-medium">К выплате</span>
            </div>
            <span className="text-gold font-bold text-2xl">
              {pendingPayout.toFixed(0)}₽
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="pt-2">
          <p className="text-muted-foreground/60 text-xs">
            Выплаты производятся по запросу. Свяжитесь с нами для получения выплаты.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
