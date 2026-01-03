'use client';

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { motion } from 'framer-motion';

interface PayoutModalProps {
  isOpen: boolean;
  partnerId: string;
  partnerName: string;
  pendingAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PayoutModal({
  isOpen,
  partnerId,
  partnerName,
  pendingAmount,
  onClose,
  onSuccess,
}: PayoutModalProps) {
  const [periodStart, setPeriodStart] = useState<Date | null>(null);
  const [periodEnd, setPeriodEnd] = useState<Date | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);

  // Сброс формы при открытии
  useEffect(() => {
    if (isOpen) {
      // Устанавливаем период по умолчанию (начало месяца - сегодня)
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

      setPeriodStart(firstDay);
      setPeriodEnd(today);
      setPaymentMethod('');
      setNotes('');
      setError(null);
      setCalculatedAmount(null);
    }
  }, [isOpen]);

  // Расчёт суммы при изменении периода
  useEffect(() => {
    if (periodStart && periodEnd) {
      calculateAmount();
    }
  }, [periodStart, periodEnd]);

  const calculateAmount = async () => {
    if (!periodStart || !periodEnd) return;

    try {
      const response = await fetch(
        `/api/admin/partners/${partnerId}/conversions?limit=1000`
      );
      const data = await response.json();

      if (data.success) {
        const conversionsInPeriod = data.conversions.filter((c: any) => {
          const convertedAt = new Date(c.converted_at);
          return (
            !c.is_paid_out &&
            convertedAt >= periodStart &&
            convertedAt <= periodEnd
          );
        });

        const amount = conversionsInPeriod.reduce(
          (sum: number, c: any) => sum + Number(c.commission),
          0
        );

        setCalculatedAmount(amount);
      }
    } catch (err) {
      console.error('Error calculating amount:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!periodStart || !periodEnd) {
      setError('Укажите период выплаты');
      return;
    }

    if (periodStart > periodEnd) {
      setError('Дата начала не может быть позже даты окончания');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/partners/${partnerId}/payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period_start: periodStart.toISOString(),
          period_end: periodEnd.toISOString(),
          payment_method: paymentMethod,
          notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || 'Ошибка создания выплаты');
      }
    } catch (err) {
      console.error('Error creating payout:', err);
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      visible={isOpen}
      onHide={onClose}
      header={`Отметить выплату: ${partnerName}`}
      className="w-full max-w-2xl"
      modal
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Информация о партнёре */}
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">К выплате (всего)</p>
              <p className="text-2xl font-bold text-white">{pendingAmount.toFixed(0)}₽</p>
            </div>
            {calculatedAmount !== null && (
              <div>
                <p className="text-sm text-gray-400">За выбранный период</p>
                <p className="text-2xl font-bold text-green-400">{calculatedAmount.toFixed(0)}₽</p>
              </div>
            )}
          </div>
        </div>

        {/* Период выплаты */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="period_start" className="block text-sm font-medium mb-2">
              Дата начала периода <span className="text-red-400">*</span>
            </label>
            <Calendar
              id="period_start"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.value as Date)}
              dateFormat="dd.mm.yy"
              className="w-full"
              showIcon
            />
          </div>

          <div>
            <label htmlFor="period_end" className="block text-sm font-medium mb-2">
              Дата окончания периода <span className="text-red-400">*</span>
            </label>
            <Calendar
              id="period_end"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.value as Date)}
              dateFormat="dd.mm.yy"
              className="w-full"
              showIcon
            />
          </div>
        </div>

        {/* Способ оплаты */}
        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium mb-2">
            Способ оплаты
          </label>
          <InputText
            id="payment_method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="Карта, СБП, ЮMoney..."
            className="w-full"
          />
        </div>

        {/* Примечания */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Примечания
          </label>
          <InputTextarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Дополнительная информация о выплате..."
            rows={3}
            className="w-full"
          />
        </div>

        {/* Информация */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-300">
            <i className="pi pi-info-circle mr-2" />
            Все невыплаченные конверсии за указанный период будут помечены как выплаченные.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            label={isLoading ? 'Создание...' : 'Отметить выплату'}
            icon="pi pi-check"
            loading={isLoading}
            disabled={isLoading || !periodStart || !periodEnd}
            className="flex-1"
          />
          <Button
            type="button"
            label="Отмена"
            icon="pi pi-times"
            outlined
            onClick={onClose}
            disabled={isLoading}
          />
        </div>
      </form>
    </Dialog>
  );
}
