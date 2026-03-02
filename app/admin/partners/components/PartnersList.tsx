'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import type { Partner, PartnerStatus } from '@/types/affiliate';

interface PartnersListProps {
  partners: Partner[];
  selectedPartnerId: string | null;
  onSelectPartner: (partnerId: string) => void;
  onCreatePartner: () => void;
  isLoading: boolean;
}

export default function PartnersList({
  partners,
  selectedPartnerId,
  onSelectPartner,
  onCreatePartner,
  isLoading,
}: PartnersListProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | PartnerStatus>('all');
  const [showArchived, setShowArchived] = useState(false);

  // Фильтрация партнёров по статусу
  const getFilteredPartners = () => {
    if (statusFilter === 'all') {
      return partners;
    }
    return partners.filter(p => (p.status || 'active') === statusFilter);
  };

  // Партнёры не в архиве
  const activePartners = getFilteredPartners().filter(p => (p.status || 'active') !== 'archived');

  // Архивные партнёры
  const archivedPartners = partners.filter(p => p.status === 'archived');

  // Опции фильтра
  const filterOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Активные', value: 'active' },
    { label: 'Неактивные', value: 'inactive' },
  ];

  // Получить цвет статуса
  const getStatusColor = (status: PartnerStatus) => {
    switch (status) {
      case 'active': return 'bg-primary';
      case 'inactive': return 'bg-gold';
      case 'archived': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  // Получить badge статуса
  const getStatusBadge = (status: PartnerStatus) => {
    switch (status) {
      case 'inactive':
        return <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">Неактивен</span>;
      case 'archived':
        return <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Архив</span>;
      default:
        return null;
    }
  };

  const renderPartner = (partner: Partner) => (
    <motion.button
      key={partner.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onClick={() => onSelectPartner(partner.id)}
      className={`
        w-full text-left p-3 rounded-xl transition-all
        ${
          selectedPartnerId === partner.id
            ? 'bg-primary/10 border border-primary/20'
            : 'bg-card border border-border/50 hover:bg-secondary/50'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-foreground font-medium text-sm truncate">
              {partner.name}
            </h3>
            {getStatusBadge(partner.status || 'active')}
          </div>
          <p className="text-muted-foreground/60 text-xs mt-0.5 truncate">
            {partner.id}
          </p>
        </div>

        {/* Индикатор активности */}
        <div
          className={`
            w-2 h-2 rounded-full mt-1.5 shrink-0
            ${getStatusColor(partner.status || 'active')}
          `}
        />
      </div>

      {/* Комиссия */}
      <div className="mt-2 text-xs text-muted-foreground">
        Комиссия: {partner.commission_rate}₽
      </div>
    </motion.button>
  );

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h2 className="text-foreground font-semibold mb-3">Партнёры</h2>

        {/* Фильтр */}
        <Dropdown
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.value)}
          options={filterOptions}
          className="w-full mb-3"
          placeholder="Фильтр по статусу"
        />

        <Button
          label="Создать партнёра"
          icon="pi pi-plus"
          className="w-full"
          size="small"
          onClick={onCreatePartner}
        />
      </div>

      {/* Partners List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <ProgressSpinner
              style={{ width: '32px', height: '32px' }}
              strokeWidth="4"
            />
          </div>
        ) : activePartners.length === 0 && !showArchived ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Партнёры не найдены
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Создайте первого партнёра
            </p>
          </div>
        ) : (
          <>
            {/* Активные партнёры */}
            {activePartners.length > 0 && (
              <div className="p-2 space-y-1">
                <AnimatePresence mode="popLayout">
                  {activePartners.map(renderPartner)}
                </AnimatePresence>
              </div>
            )}

            {/* Архив */}
            {archivedPartners.length > 0 && (
              <div className="border-t border-border/50 mt-2">
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className="w-full p-3 hover:bg-secondary/50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <i className="pi pi-inbox text-muted-foreground text-sm" />
                    <span className="text-muted-foreground text-sm font-medium">
                      Архив ({archivedPartners.length})
                    </span>
                  </div>
                  <i className={`pi ${showArchived ? 'pi-chevron-up' : 'pi-chevron-down'} text-muted-foreground/60 text-xs`} />
                </button>

                <AnimatePresence>
                  {showArchived && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-2 space-y-1 bg-secondary/30">
                        {archivedPartners.map(renderPartner)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {(activePartners.length > 0 || archivedPartners.length > 0) && (
        <div className="p-3 border-t border-border/50 bg-secondary/30">
          <p className="text-muted-foreground/60 text-xs text-center">
            {statusFilter === 'all'
              ? `Всего: ${activePartners.length} | Архив: ${archivedPartners.length}`
              : `Показано: ${activePartners.length}`
            }
          </p>
        </div>
      )}
    </div>
  );
}
