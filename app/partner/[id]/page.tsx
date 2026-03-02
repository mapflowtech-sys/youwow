'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import KPICard from '@/components/affiliate/KPICard';
import ConversionsTable from '@/components/affiliate/ConversionsTable';
import FinancialsSummary from '@/components/affiliate/FinancialsSummary';
import PayoutsHistory from '@/components/affiliate/PayoutsHistory';
import AffiliateChart from '@/components/affiliate/AffiliateChart';
import type { PartnerStats, PartnerConversion, PartnerPayout } from '@/types/affiliate';

export default function PartnerDashboardPage() {
  const params = useParams();
  const partnerId = params.id as string;
  const toast = useRef<Toast>(null);

  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [conversions, setConversions] = useState<PartnerConversion[]>([]);
  const [payouts, setPayouts] = useState<PartnerPayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Загружаем статистику
      const statsResponse = await fetch(`/api/partners/${partnerId}/stats`);
      const statsData = await statsResponse.json();

      if (!statsData.success) {
        setError(statsData.error || 'Партнёр не найден');
        return;
      }

      setStats(statsData.stats);

      // Загружаем конверсии
      const conversionsResponse = await fetch(`/api/partners/${partnerId}/conversions?limit=20`);
      const conversionsData = await conversionsResponse.json();

      if (conversionsData.success) {
        setConversions(conversionsData.conversions);
      }

      // Загружаем выплаты
      const payoutsResponse = await fetch(`/api/partners/${partnerId}/payouts`);
      const payoutsData = await payoutsResponse.json();

      if (payoutsData.success) {
        setPayouts(payoutsData.payouts);
      }
    } catch (err) {
      console.error('Error loading partner data:', err);
      setError('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const copyAffiliateLink = () => {
    const link = `https://youwow.ru/song?partner=${partnerId}`;
    navigator.clipboard.writeText(link);

    toast.current?.show({
      severity: 'success',
      summary: 'Скопировано!',
      detail: 'Партнёрская ссылка скопирована в буфер обмена',
      life: 3000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ProgressSpinner style={{ width: '64px', height: '64px' }} strokeWidth="4" />
          <p className="text-muted-foreground mt-4">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl border border-border/50 p-12 text-center max-w-md shadow-sm"
        >
          <i className="pi pi-exclamation-triangle text-primary text-6xl mb-4" />
          <h1 className="font-display text-2xl font-bold text-plum mb-2">Партнёр не найден</h1>
          <p className="text-muted-foreground mb-6">{error || 'Проверьте правильность ссылки'}</p>
          <Button
            label="Вернуться на главную"
            icon="pi pi-home"
            onClick={() => window.location.href = '/'}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toast ref={toast} />

      {/* Header */}
      <header className="bg-surface-dark border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-bold text-white/90">YouWow</h1>
              <span className="text-white/30">|</span>
              <span className="text-white/60">{stats.partnerName}</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium
                  ${
                    stats.isActive
                      ? 'bg-primary/20 text-primary-light'
                      : 'bg-destructive/20 text-destructive'
                  }
                `}
              >
                {stats.isActive ? 'Активен' : 'Неактивен'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Affiliate Link Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h2 className="text-muted-foreground text-sm mb-2">Ваша партнёрская ссылка:</h2>
              <code className="text-foreground text-lg font-mono break-all">
                https://youwow.ru/song?partner={partnerId}
              </code>
            </div>
            <Button
              label="Копировать"
              icon="pi pi-copy"
              onClick={copyAffiliateLink}
              className="shrink-0"
            />
          </div>
          <p className="text-muted-foreground/60 text-sm mt-4">
            Делитесь этой ссылкой для получения комиссии {stats.commissionRate}₽ за каждую продажу
          </p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="Переходы"
            value={stats.totalClicks}
            icon="pi-mouse-pointer"
            color="blue"
            delay={0.1}
          />
          <KPICard
            label="Покупки"
            value={stats.totalConversions}
            subtitle={`${stats.conversionRate.toFixed(1)}% конверсия`}
            icon="pi-shopping-cart"
            color="green"
            delay={0.2}
          />
          <KPICard
            label="Заработано"
            value={`${stats.totalEarned.toFixed(0)}₽`}
            icon="pi-wallet"
            color="purple"
            delay={0.3}
          />
          <KPICard
            label="К выплате"
            value={`${stats.pendingPayout.toFixed(0)}₽`}
            subtitle={`Комиссия: ${stats.commissionRate}₽`}
            icon="pi-money-bill"
            color="pink"
            delay={0.4}
          />
        </div>

        {/* Chart */}
        <AffiliateChart partnerId={partnerId} />

        {/* Two-column layout for desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversions Table - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ConversionsTable conversions={conversions} />
          </div>

          {/* Financials + Payouts - Takes 1 column */}
          <div className="lg:col-span-1 space-y-6">
            <FinancialsSummary
              totalEarned={stats.totalEarned}
              totalPaidOut={stats.totalPaidOut}
              pendingPayout={stats.pendingPayout}
            />
            <PayoutsHistory payouts={payouts} />
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-secondary/50 rounded-xl border border-border/50 p-6 text-center"
        >
          <p className="text-muted-foreground text-sm">
            По вопросам выплат и сотрудничества обращайтесь:{' '}
            <a
              href="https://t.me/youwow_support"
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum font-semibold hover:underline transition-colors"
            >
              @youwow_support
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
