'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { motion } from 'framer-motion';
import type { Partner } from '@/types/affiliate';

interface CreatePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (partner: Partner) => void;
}

export default function CreatePartnerModal({ isOpen, onClose, onSuccess }: CreatePartnerModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    website: '',
    payment_info: '',
    commission_rate: 200,
    notes: '',
    is_active: true,
    status: 'active' as const, // По умолчанию активный
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Валидация ID
    if (!formData.id) {
      newErrors.id = 'ID обязателен';
    } else if (!/^[a-z0-9-]+$/.test(formData.id)) {
      newErrors.id = 'Только латиница, цифры и дефис';
    }

    // Валидация имени
    if (!formData.name) {
      newErrors.name = 'Название обязательно';
    }

    // Валидация комиссии
    if (!formData.commission_rate || formData.commission_rate <= 0) {
      newErrors.commission_rate = 'Комиссия должна быть больше 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/partners/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.partner);
        resetForm();
      } else {
        setApiError(data.error || 'Ошибка создания партнёра');
      }
    } catch (error) {
      setApiError('Ошибка соединения с сервером');
      console.error('Error creating partner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      website: '',
      payment_info: '',
      commission_rate: 200,
      notes: '',
      is_active: true,
      status: 'active' as const,
    });
    setErrors({});
    setApiError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      visible={isOpen}
      onHide={handleClose}
      header="Создать партнёра"
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

        {/* ID */}
        <div>
          <label htmlFor="id" className="block text-sm font-medium mb-2">
            ID партнёра <span className="text-red-400">*</span>
          </label>
          <InputText
            id="id"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase() })}
            placeholder="dnsshop, blogopodarki"
            className="w-full"
            invalid={!!errors.id}
          />
          {errors.id && <small className="text-red-400">{errors.id}</small>}
          <small className="text-gray-500 block mt-1">
            Только строчные латинские буквы, цифры и дефис. Используется в URL.
          </small>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Название <span className="text-red-400">*</span>
          </label>
          <InputText
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="DNS Shop, Блог о подарках"
            className="w-full"
            invalid={!!errors.name}
          />
          {errors.name && <small className="text-red-400">{errors.name}</small>}
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium mb-2">
            Сайт партнёра
          </label>
          <InputText
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
            className="w-full"
          />
        </div>

        {/* Commission Rate */}
        <div>
          <label htmlFor="commission" className="block text-sm font-medium mb-2">
            Комиссия (в рублях) <span className="text-red-400">*</span>
          </label>
          <InputNumber
            id="commission"
            value={formData.commission_rate}
            onValueChange={(e) => setFormData({ ...formData, commission_rate: e.value || 200 })}
            mode="currency"
            currency="RUB"
            locale="ru-RU"
            className="w-full"
            min={0}
            invalid={!!errors.commission_rate}
          />
          {errors.commission_rate && <small className="text-red-400">{errors.commission_rate}</small>}
          <small className="text-gray-500 block mt-1">
            Сумма комиссии за каждую продажу по партнёрской ссылке.
          </small>
        </div>

        {/* Payment Info */}
        <div>
          <label htmlFor="payment_info" className="block text-sm font-medium mb-2">
            Реквизиты для выплат
          </label>
          <InputTextarea
            id="payment_info"
            value={formData.payment_info}
            onChange={(e) => setFormData({ ...formData, payment_info: e.target.value })}
            placeholder="Карта: 5536 9137 XXXX XXXX, Иван И."
            rows={3}
            className="w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Примечания
          </label>
          <InputTextarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Комментарии для себя..."
            rows={3}
            className="w-full"
          />
        </div>

        {/* Active Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            inputId="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.checked || false })}
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Партнёр активен
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            label={isLoading ? 'Создание...' : 'Создать партнёра'}
            icon="pi pi-plus"
            loading={isLoading}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="button"
            label="Отмена"
            icon="pi pi-times"
            outlined
            onClick={handleClose}
            disabled={isLoading}
          />
        </div>
      </form>
    </Dialog>
  );
}
