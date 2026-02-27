'use client';

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { motion } from 'framer-motion';
import { adminFetch } from '../lib/admin-fetch';
import type { Partner } from '@/types/affiliate';

interface EditPartnerModalProps {
  isOpen: boolean;
  partner: Partner | null;
  onClose: () => void;
  onSuccess: (partner: Partner) => void;
}

export default function EditPartnerModal({ isOpen, partner, onClose, onSuccess }: EditPartnerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    payment_info: '',
    commission_rate: 200,
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Заполняем форму данными партнёра при открытии
  useEffect(() => {
    if (isOpen && partner) {
      setFormData({
        name: partner.name || '',
        website: partner.website || '',
        payment_info: partner.payment_info || '',
        commission_rate: partner.commission_rate || 200,
        notes: partner.notes || '',
      });
      setApiError(null);
    }
  }, [isOpen, partner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!partner) return;

    setIsLoading(true);

    try {
      const response = await adminFetch(`/api/admin/partners/${partner.id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.partner);
        onClose();
      } else {
        setApiError(data.error || 'Ошибка обновления партнёра');
      }
    } catch (error) {
      setApiError('Ошибка соединения с сервером');
      console.error('Error updating partner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      visible={isOpen}
      onHide={onClose}
      header={`Редактировать: ${partner?.name || ''}`}
      className="w-full max-w-2xl"
      modal
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Error */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <p className="text-red-400 text-sm">{apiError}</p>
          </motion.div>
        )}

        {/* Partner ID (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            ID партнёра <span className="text-white/40">(не изменяется)</span>
          </label>
          <InputText
            value={partner?.id || ''}
            disabled
            className="w-full opacity-50"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="edit_name" className="block text-sm font-medium mb-2">
            Название <span className="text-red-400">*</span>
          </label>
          <InputText
            id="edit_name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="DNS Shop"
            required
            className="w-full"
          />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="edit_website" className="block text-sm font-medium mb-2">
            Сайт
          </label>
          <InputText
            id="edit_website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
            className="w-full"
          />
        </div>

        {/* Commission Rate */}
        <div>
          <label htmlFor="edit_commission" className="block text-sm font-medium mb-2">
            Комиссия (₽) <span className="text-red-400">*</span>
          </label>
          <InputNumber
            inputId="edit_commission"
            value={formData.commission_rate}
            onValueChange={(e) => setFormData({ ...formData, commission_rate: e.value || 200 })}
            mode="currency"
            currency="RUB"
            locale="ru-RU"
            min={0}
            required
            className="w-full"
          />
          <p className="text-xs text-white/40 mt-1">
            Сумма комиссии за каждую успешную продажу
          </p>
        </div>

        {/* Payment Info */}
        <div>
          <label htmlFor="edit_payment" className="block text-sm font-medium mb-2">
            Реквизиты для выплат
          </label>
          <InputTextarea
            id="edit_payment"
            value={formData.payment_info}
            onChange={(e) => setFormData({ ...formData, payment_info: e.target.value })}
            placeholder="Карта: 5536 9137 XXXX XXXX, Иван Иванов"
            rows={2}
            className="w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="edit_notes" className="block text-sm font-medium mb-2">
            Заметки
          </label>
          <InputTextarea
            id="edit_notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Внутренние комментарии об этом партнёре"
            rows={3}
            className="w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            label={isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            icon="pi pi-check"
            loading={isLoading}
            disabled={isLoading}
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
