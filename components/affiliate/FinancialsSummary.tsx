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
      className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-xl border border-purple-400/30 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <i className="pi pi-wallet text-white/80 text-xl" />
          <h3 className="text-white font-semibold text-lg">Финансы</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Total Earned */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white/70 text-sm">Всего заработано</span>
          </div>
          <span className="text-white font-bold text-xl">
            {totalEarned.toFixed(0)}₽
          </span>
        </div>

        {/* Total Paid Out */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-white/70 text-sm">Выплачено</span>
          </div>
          <span className="text-white/80 font-medium text-lg">
            {totalPaidOut.toFixed(0)}₽
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-4">
          {/* Pending Payout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-white/70 text-sm font-medium">К выплате</span>
            </div>
            <span className="text-yellow-300 font-bold text-2xl">
              {pendingPayout.toFixed(0)}₽
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="pt-2">
          <p className="text-white/40 text-xs">
            Выплаты производятся по запросу. Свяжитесь с нами для получения выплаты.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
