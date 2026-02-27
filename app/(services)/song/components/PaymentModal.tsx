'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  CreditCard,
  Smartphone,
  Shield,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { SongFormData } from '@/lib/genapi/text-generation';

interface PaymentModalProps {
  onPaymentInitiated: (paymentGuid: string) => void;
  onClose: () => void;
  formData: SongFormData;
}

export default function PaymentModal({ onPaymentInitiated, onClose, formData }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'sbp'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      localStorage.setItem('song_form_draft', JSON.stringify(formData));

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          formData: formData,
          method: selectedMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка создания платежа');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Не удалось создать платёж');
      }

      console.log('[Payment] Created:', data);
      onPaymentInitiated(data.payment.guid);
      window.location.href = data.payment.url;

    } catch (err) {
      console.error('[Payment] Error:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании платежа');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto border border-border/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4">
            <CreditCard className="text-white" size={28} />
          </div>

          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Оплата заказа
          </h2>
          <p className="text-muted-foreground">
            Выберите удобный способ оплаты
          </p>
        </div>

        {/* Price Display */}
        <div className="bg-muted rounded-xl p-6 mb-6 text-center">
          <div className="text-sm text-muted-foreground mb-1">
            Стоимость песни
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-xl text-muted-foreground line-through">
              1 190 &#8381;
            </span>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
              &minus;50%
            </span>
          </div>
          <div className="text-4xl font-bold text-foreground">
            590 &#8381;
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Способ оплаты
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedMethod('card')}
              disabled={isLoading}
              className={`p-4 border rounded-xl transition-colors ${
                selectedMethod === 'card'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <CreditCard className={`mx-auto mb-2 ${selectedMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} size={24} />
              <div className="text-sm font-medium">Банковская карта</div>
            </button>
            <button
              onClick={() => setSelectedMethod('sbp')}
              disabled={isLoading}
              className={`p-4 border rounded-xl transition-colors ${
                selectedMethod === 'sbp'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Smartphone className={`mx-auto mb-2 ${selectedMethod === 'sbp' ? 'text-primary' : 'text-muted-foreground'}`} size={24} />
              <div className="text-sm font-medium">СБП</div>
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Shield className="text-green-600 shrink-0" size={18} />
            <span className="text-muted-foreground">Безопасная оплата</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle className="text-green-600 shrink-0" size={18} />
            <span className="text-muted-foreground">Гарантия возврата средств</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Создаём платёж...
            </>
          ) : (
            <>Перейти к оплате 590 &#8381;</>
          )}
        </button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Нажимая кнопку, вы соглашаетесь с{' '}
          <a href="/legal/terms" className="text-primary hover:underline" target="_blank">
            Пользовательским соглашением
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
