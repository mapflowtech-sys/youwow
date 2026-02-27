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
      case 'active': return 'bg-green-400';
      case 'inactive': return 'bg-yellow-400';
      case 'archived': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // Получить badge статуса
  const getStatusBadge = (status: PartnerStatus) => {
    switch (status) {
      case 'inactive':
        return <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">Неактивен</span>;
      case 'archived':
        return <span className="text-xs bg-gray-500/20 text-gray-300 px-2 py-0.5 rounded-full">Архив</span>;
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
            ? 'bg-white/20 border border-white/30'
            : 'bg-white/5 border border-white/10 hover:bg-white/10'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-medium text-sm truncate">
              {partner.name}
            </h3>
            {getStatusBadge(partner.status || 'active')}
          </div>
          <p className="text-white/50 text-xs mt-0.5 truncate">
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
      <div className="mt-2 text-xs text-white/40">
        Комиссия: {partner.commission_rate}₽
      </div>
    </motion.button>
  );

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-white font-semibold mb-3">Партнёры</h2>

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
            <p className="text-white/40 text-sm">
              Партнёры не найдены
            </p>
            <p className="text-white/30 text-xs mt-1">
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
              <div className="border-t border-white/10 mt-2">
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className="w-full p-3 hover:bg-white/5 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <i className="pi pi-inbox text-white/60 text-sm" />
                    <span className="text-white/60 text-sm font-medium">
                      Архив ({archivedPartners.length})
                    </span>
                  </div>
                  <i className={`pi ${showArchived ? 'pi-chevron-up' : 'pi-chevron-down'} text-white/40 text-xs`} />
                </button>

                <AnimatePresence>
                  {showArchived && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-2 space-y-1 bg-black/10">
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
        <div className="p-3 border-t border-white/10 bg-white/5">
          <p className="text-white/40 text-xs text-center">
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
