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
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center"
      >
        <i className="pi pi-shopping-cart text-white/20 text-6xl mb-4" />
        <p className="text-white/60 text-lg mb-2">Конверсий пока нет</p>
        <p className="text-white/40 text-sm">
          Как только кто-то купит по вашей партнёрской ссылке, конверсия появится здесь
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="text-white font-semibold text-lg">
          Последние конверсии ({conversions.length})
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Сервис
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Комиссия
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Статус
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {conversions.map((conversion, index) => (
              <motion.tr
                key={conversion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                  {new Date(conversion.converted_at).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">
                    {conversion.service_type === 'song' ? 'Песня' : conversion.service_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                  {conversion.amount}₽
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">
                  +{conversion.commission}₽
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${
                        conversion.is_paid_out
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
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
