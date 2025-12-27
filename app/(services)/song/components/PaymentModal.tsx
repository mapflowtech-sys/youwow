'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  CreditCard,
  Smartphone,
  Shield,
  Zap,
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
      // Create payment
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          formData: formData,
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

      // Notify parent and redirect to payment page
      onPaymentInitiated(data.payment.guid);

      // Redirect to 1plat payment page
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          disabled={isLoading}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4"
          >
            <CreditCard className="text-white" size={32} />
          </motion.div>

          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Оплата заказа
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Выберите удобный способ оплаты
          </p>
        </div>

        {/* Price Display */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-6 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Стоимость песни
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl text-gray-400 dark:text-gray-500 line-through">
              1 190₽
            </span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              -50%
            </span>
          </div>
          <div className="text-5xl font-bold text-purple-600 dark:text-purple-400">
            590₽
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Способ оплаты
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedMethod('card')}
              disabled={isLoading}
              className={`p-4 border-2 rounded-xl transition-all ${
                selectedMethod === 'card'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <CreditCard className={`mx-auto mb-2 ${selectedMethod === 'card' ? 'text-purple-600' : 'text-gray-400'}`} size={24} />
              <div className="text-sm font-medium">Банковская карта</div>
            </button>
            <button
              onClick={() => setSelectedMethod('sbp')}
              disabled={isLoading}
              className={`p-4 border-2 rounded-xl transition-all ${
                selectedMethod === 'sbp'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Smartphone className={`mx-auto mb-2 ${selectedMethod === 'sbp' ? 'text-purple-600' : 'text-gray-400'}`} size={24} />
              <div className="text-sm font-medium">СБП</div>
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Shield className="text-green-500 flex-shrink-0" size={20} />
            <span className="text-gray-700 dark:text-gray-300">Безопасная оплата</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Zap className="text-purple-500 flex-shrink-0" size={20} />
            <span className="text-gray-700 dark:text-gray-300">Мгновенное начало генерации</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle className="text-blue-500 flex-shrink-0" size={20} />
            <span className="text-gray-700 dark:text-gray-300">Гарантия возврата средств</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Создаём платёж...
            </>
          ) : (
            <>
              Перейти к оплате 590₽
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          Нажимая кнопку, вы соглашаетесь с{' '}
          <a href="/legal/offer" className="text-purple-600 hover:underline" target="_blank">
            условиями оферты
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
