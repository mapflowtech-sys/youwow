'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import type { Partner } from '@/types/affiliate';

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
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-white font-semibold mb-3">Партнёры</h2>
        <Button
          label="Создать партнёра"
          icon="pi pi-plus"
          className="w-full"
          size="small"
          onClick={onCreatePartner}
        />
      </div>

      {/* Partners List */}
      <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <ProgressSpinner
              style={{ width: '32px', height: '32px' }}
              strokeWidth="4"
            />
          </div>
        ) : partners.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-white/40 text-sm">
              Партнёры не найдены
            </p>
            <p className="text-white/30 text-xs mt-1">
              Создайте первого партнёра
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            <AnimatePresence mode="popLayout">
              {partners.map((partner) => (
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
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium text-sm truncate">
                          {partner.name}
                        </h3>
                        {!partner.is_active && (
                          <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                            Неактивен
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-xs mt-0.5 truncate">
                        {partner.id}
                      </p>
                    </div>

                    {/* Индикатор активности */}
                    <div
                      className={`
                        w-2 h-2 rounded-full mt-1.5 flex-shrink-0
                        ${partner.is_active ? 'bg-green-400' : 'bg-gray-400'}
                      `}
                    />
                  </div>

                  {/* Комиссия */}
                  <div className="mt-2 text-xs text-white/40">
                    Комиссия: {partner.commission_rate}₽
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      {partners.length > 0 && (
        <div className="p-3 border-t border-white/10 bg-white/5">
          <p className="text-white/40 text-xs text-center">
            Всего партнёров: {partners.length}
          </p>
        </div>
      )}
    </div>
  );
}
