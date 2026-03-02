'use client';

import { motion } from 'framer-motion';

interface PublicPayout {
  id: string;
  partner_id: string;
  amount: number;
  conversions_count: number;
  period_start: string;
  period_end: string;
  paid_at: string;
  payment_method?: string;
}

interface PayoutsHistoryProps {
  payouts: PublicPayout[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatPeriod(start: string, end: string): string {
  const s = new Date(start).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
  const e = new Date(end).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${s} — ${e}`;
}

export default function PayoutsHistory({ payouts }: PayoutsHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <i className="pi pi-history text-plum text-xl" />
          <h3 className="text-foreground font-semibold text-lg">История выплат</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {payouts.length === 0 ? (
          <div className="text-center py-6">
            <i className="pi pi-inbox text-3xl text-muted-foreground/30 mb-3 block" />
            <p className="text-muted-foreground text-sm">Выплат пока не было</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border/30"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-foreground font-bold text-lg">
                      {payout.amount.toFixed(0)}₽
                    </span>
                    {payout.payment_method && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-plum/10 text-plum">
                        {payout.payment_method}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDate(payout.paid_at)}</span>
                    <span className="text-muted-foreground/40">•</span>
                    <span>{formatPeriod(payout.period_start, payout.period_end)}</span>
                    <span className="text-muted-foreground/40">•</span>
                    <span>{payout.conversions_count} конв.</span>
                  </div>
                </div>
                <div className="shrink-0 ml-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Оплачено
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
