'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { PartnerStats as StatsType, PartnerConversion } from '@/types/affiliate';

interface PartnerStatsProps {
  partnerId: string;
  onPartnerUpdate?: () => void;
}

export default function PartnerStats({ partnerId, onPartnerUpdate }: PartnerStatsProps) {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [conversions, setConversions] = useState<PartnerConversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    loadConversions();
  }, [partnerId]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/partners/${partnerId}/stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.error || 'Ошибка загрузки статистики');
      }
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error('Error loading stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversions = async () => {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}/conversions?limit=20`);
      const data = await response.json();

      if (data.success) {
        setConversions(data.conversions);
      }
    } catch (err) {
      console.error('Error loading conversions:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-12 flex items-center justify-center">
        <ProgressSpinner style={{ width: '48px', height: '48px' }} strokeWidth="4" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-12 text-center">
        <p className="text-red-400 text-lg">{error || 'Партнёр не найден'}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {stats.partnerName}
            </h2>
            <p className="text-white/60 text-sm">ID: {stats.partnerId}</p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium
                ${
                  stats.isActive
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }
              `}
            >
              {stats.isActive ? 'Активен' : 'Неактивен'}
            </span>
          </div>
        </div>

        {/* Affiliate Link */}
        <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/10">
          <p className="text-white/60 text-xs mb-1">Партнёрская ссылка:</p>
          <div className="flex items-center gap-2">
            <code className="text-white text-sm flex-1 truncate">
              https://youwow.ru/song?partner={stats.partnerId}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://youwow.ru/song?partner=${stats.partnerId}`);
              }}
              className="text-white/60 hover:text-white transition-colors"
            >
              <i className="pi pi-copy" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Переходы"
          value={stats.totalClicks}
          icon="pi-mouse-pointer"
          color="blue"
        />
        <KPICard
          label="Покупки"
          value={stats.totalConversions}
          subtitle={`${stats.conversionRate.toFixed(1)}% конверсия`}
          icon="pi-shopping-cart"
          color="green"
        />
        <KPICard
          label="Заработано"
          value={`${stats.totalEarned.toFixed(0)}₽`}
          icon="pi-wallet"
          color="purple"
        />
        <KPICard
          label="К выплате"
          value={`${stats.pendingPayout.toFixed(0)}₽`}
          subtitle={`Выплачено: ${stats.totalPaidOut.toFixed(0)}₽`}
          icon="pi-money-bill"
          color="pink"
        />
      </div>

      {/* Settings Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
        <h3 className="text-white font-semibold mb-4">Настройки</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Комиссия за продажу</span>
            <span className="text-white font-medium">{stats.commissionRate}₽</span>
          </div>
        </div>
      </div>

      {/* Conversions Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
        <h3 className="text-white font-semibold mb-4">
          Последние конверсии ({conversions.length})
        </h3>

        {conversions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/40">Конверсий пока нет</p>
            <p className="text-white/30 text-sm mt-1">
              Как только кто-то купит по партнёрской ссылке, конверсия появится здесь
            </p>
          </div>
        ) : (
          <DataTable
            value={conversions}
            className="p-datatable-sm"
            paginator
            rows={10}
            emptyMessage="Конверсий нет"
          >
            <Column
              field="converted_at"
              header="Дата"
              body={(row) => new Date(row.converted_at).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              style={{ width: '180px' }}
            />
            <Column
              field="service_type"
              header="Сервис"
              body={(row) => (
                <span className="px-2 py-1 bg-white/10 rounded text-xs">
                  {row.service_type === 'song' ? 'Песня' : row.service_type}
                </span>
              )}
              style={{ width: '100px' }}
            />
            <Column
              field="amount"
              header="Сумма"
              body={(row) => `${row.amount}₽`}
              style={{ width: '100px' }}
            />
            <Column
              field="commission"
              header="Комиссия"
              body={(row) => (
                <span className="font-medium text-green-400">
                  {row.commission}₽
                </span>
              )}
              style={{ width: '100px' }}
            />
            <Column
              field="is_paid_out"
              header="Статус"
              body={(row) => (
                <span
                  className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${
                      row.is_paid_out
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }
                  `}
                >
                  {row.is_paid_out ? 'Выплачено' : 'Ожидает'}
                </span>
              )}
              style={{ width: '120px' }}
            />
            <Column
              field="order_id"
              header="ID заказа"
              body={(row) => (
                <code className="text-xs text-white/60">
                  {row.order_id.substring(0, 8)}...
                </code>
              )}
            />
          </DataTable>
        )}
      </div>
    </motion.div>
  );
}

// KPI Card Component
interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'pink';
}

function KPICard({ label, value, subtitle, icon, color }: KPICardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-400/30',
    green: 'from-green-500/20 to-green-600/20 border-green-400/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/30',
    pink: 'from-pink-500/20 to-pink-600/20 border-pink-400/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        bg-gradient-to-br ${colorClasses[color]}
        backdrop-blur-md rounded-xl border p-4
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-white/60 text-sm">{label}</span>
        <i className={`pi ${icon} text-white/40 text-lg`} />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-xs text-white/50">{subtitle}</div>}
    </motion.div>
  );
}
