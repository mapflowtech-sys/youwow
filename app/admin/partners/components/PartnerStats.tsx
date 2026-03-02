'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import PayoutModal from './PayoutModal';
import EditPartnerModal from './EditPartnerModal';
import AffiliateChart from '@/components/affiliate/AffiliateChart';
import KPICard from '@/components/affiliate/KPICard';
import { adminFetch } from '../lib/admin-fetch';
import type { Partner } from '@/types/affiliate';
import type { PartnerStats as StatsType, PartnerConversion, PartnerStatus } from '@/types/affiliate';

interface PartnerStatsProps {
  partnerId: string;
  onPartnerUpdate?: () => void;
}

export default function PartnerStats({ partnerId, onPartnerUpdate }: PartnerStatsProps) {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [conversions, setConversions] = useState<PartnerConversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [partnerData, setPartnerData] = useState<Partner | null>(null);

  const loadPartner = useCallback(async () => {
    try {
      const response = await adminFetch(`/api/admin/partners/list`);
      const data = await response.json();
      if (data.success) {
        const partner = data.partners.find((p: Partner) => p.id === partnerId);
        if (partner) setPartnerData(partner);
      }
    } catch (err) {
      console.error('Error loading partner:', err);
    }
  }, [partnerId]);

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await adminFetch(`/api/admin/partners/${partnerId}/stats`);
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
  }, [partnerId]);

  const loadConversions = useCallback(async () => {
    try {
      const response = await adminFetch(`/api/admin/partners/${partnerId}/conversions?limit=20`);
      const data = await response.json();

      if (data.success) {
        setConversions(data.conversions);
      }
    } catch (err) {
      console.error('Error loading conversions:', err);
    }
  }, [partnerId]);

  useEffect(() => {
    loadPartner();
    loadStats();
    loadConversions();
  }, [partnerId, loadPartner, loadStats, loadConversions]);

  // Обработчик успешной выплаты
  const handlePayoutSuccess = () => {
    setIsPayoutModalOpen(false);
    loadStats();
    loadConversions();
  };

  // Обработчик успешного редактирования
  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    loadPartner();
    loadStats();
    onPartnerUpdate?.();
  };

  // Изменить статус партнёра
  const changePartnerStatus = async (newStatus: PartnerStatus) => {
    try {
      const response = await adminFetch(`/api/admin/partners/${partnerId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        await loadStats(); // Перезагрузка статистики
        onPartnerUpdate?.(); // Обновление списка партнёров
      } else {
        alert('Ошибка изменения статуса: ' + data.error);
      }
    } catch (err) {
      console.error('Error changing status:', err);
      alert('Ошибка изменения статуса');
    }
  };

  // Архивировать партнёра
  const handleArchive = () => {
    confirmDialog({
      message: `Вы уверены, что хотите архивировать партнёра "${stats?.partnerName}"? Партнёр будет скрыт из основного списка, но продолжит принимать конверсии.`,
      header: 'Архивация партнёра',
      icon: 'pi pi-inbox',
      acceptLabel: 'Архивировать',
      rejectLabel: 'Отмена',
      accept: () => changePartnerStatus('archived'),
    });
  };

  // Восстановить из архива
  const handleRestore = () => {
    confirmDialog({
      message: `Восстановить партнёра "${stats?.partnerName}" из архива?`,
      header: 'Восстановление партнёра',
      icon: 'pi pi-undo',
      acceptLabel: 'Восстановить',
      rejectLabel: 'Отмена',
      accept: () => changePartnerStatus('active'),
    });
  };

  // Деактивировать/активировать
  const handleToggleActive = () => {
    const newStatus: PartnerStatus = stats?.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'активировать' : 'деактивировать';

    confirmDialog({
      message: `${action.charAt(0).toUpperCase() + action.slice(1)} партнёра "${stats?.partnerName}"?`,
      header: `${action.charAt(0).toUpperCase() + action.slice(1)}`,
      icon: 'pi pi-power-off',
      acceptLabel: action.charAt(0).toUpperCase() + action.slice(1),
      rejectLabel: 'Отмена',
      accept: () => changePartnerStatus(newStatus),
    });
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-12 flex items-center justify-center shadow-sm">
        <ProgressSpinner style={{ width: '48px', height: '48px' }} strokeWidth="4" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-12 text-center shadow-sm">
        <p className="text-destructive text-lg">{error || 'Партнёр не найден'}</p>
      </div>
    );
  }

  // Получить статус badge
  const getStatusBadge = () => {
    switch (stats?.status) {
      case 'active':
        return <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary">Активен</span>;
      case 'inactive':
        return <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gold/10 text-gold">Неактивен</span>;
      case 'archived':
        return <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-secondary text-muted-foreground">В архиве</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <ConfirmDialog />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {stats.partnerName}
              </h2>
              <p className="text-muted-foreground text-sm">ID: {stats.partnerId}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge()}

              {/* Кнопки управления */}
              {stats.status === 'archived' ? (
                <Button
                  label="Восстановить"
                  icon="pi pi-undo"
                  size="small"
                  outlined
                  onClick={handleRestore}
                />
              ) : (
                <>
                  <Button
                    label={stats.status === 'active' ? 'Деактивировать' : 'Активировать'}
                    icon="pi pi-power-off"
                    size="small"
                    outlined
                    severity={stats.status === 'active' ? 'warning' : 'success'}
                    onClick={handleToggleActive}
                  />
                  <Button
                    label="В архив"
                    icon="pi pi-inbox"
                    size="small"
                    outlined
                    severity="secondary"
                    onClick={handleArchive}
                  />
                </>
              )}
            </div>
          </div>

        {/* Affiliate Link */}
        <div className="mt-4 p-3 bg-secondary/50 rounded-lg border border-border/50">
          <p className="text-muted-foreground text-xs mb-1">Партнёрская ссылка:</p>
          <div className="flex items-center gap-2">
            <code className="text-foreground text-sm flex-1 truncate">
              https://youwow.ru/song?partner={stats.partnerId}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://youwow.ru/song?partner=${stats.partnerId}`);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
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

      {/* Chart */}
      <AffiliateChart partnerId={partnerId} />

      {/* Settings Card */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground font-semibold">Настройки</h3>
          <div className="flex gap-2">
            <Button
              label="Редактировать"
              icon="pi pi-pencil"
              size="small"
              outlined
              onClick={() => setIsEditModalOpen(true)}
            />
            {stats.pendingPayout > 0 && (
              <Button
                label="Отметить выплату"
                icon="pi pi-money-bill"
                size="small"
                severity="success"
                onClick={() => setIsPayoutModalOpen(true)}
              />
            )}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Комиссия за продажу</span>
            <span className="text-foreground font-medium">{stats.commissionRate}₽</span>
          </div>
          {partnerData?.website && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Сайт</span>
              <a href={partnerData.website} target="_blank" rel="noopener noreferrer" className="text-plum hover:underline text-sm">
                {partnerData.website}
              </a>
            </div>
          )}
          {partnerData?.payment_info && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Реквизиты</span>
              <span className="text-foreground text-sm">{partnerData.payment_info}</span>
            </div>
          )}
        </div>
      </div>

      {/* Conversions Table */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
        <h3 className="text-foreground font-semibold mb-4">
          Последние конверсии ({conversions.length})
        </h3>

        {conversions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Конверсий пока нет</p>
            <p className="text-muted-foreground/60 text-sm mt-1">
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
                <span className="px-2 py-1 bg-secondary rounded text-xs">
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
                <span className="font-medium text-primary">
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
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gold/10 text-gold'
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
                <code className="text-xs text-muted-foreground">
                  {row.order_id.substring(0, 8)}...
                </code>
              )}
            />
          </DataTable>
        )}
      </div>
    </motion.div>

    {/* Payout Modal */}
    <PayoutModal
      isOpen={isPayoutModalOpen}
      onClose={() => setIsPayoutModalOpen(false)}
      partnerId={stats.partnerId}
      partnerName={stats.partnerName}
      pendingAmount={stats.pendingPayout}
      onSuccess={handlePayoutSuccess}
    />

    {/* Edit Partner Modal */}
    <EditPartnerModal
      isOpen={isEditModalOpen}
      partner={partnerData}
      onClose={() => setIsEditModalOpen(false)}
      onSuccess={handleEditSuccess}
    />
    </>
  );
}
