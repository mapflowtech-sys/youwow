'use client';

import { motion } from 'framer-motion';
import type { PartnerConversion } from '@/types/affiliate';

interface ConversionsTableProps {
  conversions: PartnerConversion[];
}

export default function ConversionsTable({ conversions }: ConversionsTableProps) {
  if (conversions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-2xl border border-border/50 p-12 text-center shadow-sm"
      >
        <i className="pi pi-shopping-cart text-border text-6xl mb-4" />
        <p className="text-foreground text-lg mb-2">Конверсий пока нет</p>
        <p className="text-muted-foreground text-sm">
          Как только кто-то купит по вашей партнёрской ссылке, конверсия появится здесь
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50">
        <h3 className="text-foreground font-semibold text-lg">
          Последние конверсии ({conversions.length})
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Сервис
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Комиссия
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Статус
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {conversions.map((conversion, index) => (
              <motion.tr
                key={conversion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-secondary/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {new Date(conversion.converted_at).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs text-foreground">
                    {conversion.service_type === 'song' ? 'Песня' : conversion.service_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {conversion.amount}₽
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                  +{conversion.commission}₽
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${
                        conversion.is_paid_out
                          ? 'bg-primary/10 text-primary'
                          : 'bg-gold/10 text-gold'
                      }
                    `}
                  >
                    {conversion.is_paid_out ? 'Выплачено' : 'Ожидает'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
