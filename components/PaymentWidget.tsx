"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Zap, RefreshCw, CheckCircle2, Music2 } from "lucide-react";
import type { YooKassaWidget, YooKassaWidgetConfig } from "@/types/yookassa-widget";

interface PaymentWidgetProps {
  confirmationToken: string;
  orderId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function PaymentWidget({
  confirmationToken,
  orderId,
  onSuccess,
  onError,
}: PaymentWidgetProps) {
  const router = useRouter();
  const widgetRef = useRef<YooKassaWidget | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Load YooKassa script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if script is already loaded
    if (window.YooMoneyCheckoutWidget) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';
    script.async = true;
    script.onload = () => {
      console.log('[PaymentWidget] YooKassa script loaded');
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('[PaymentWidget] Failed to load YooKassa script');
      onError?.(new Error('Failed to load payment widget'));
    };

    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount to avoid reloading
    };
  }, [onError]);

  // Initialize widget
  useEffect(() => {
    if (!isScriptLoaded || !window.YooMoneyCheckoutWidget || !confirmationToken) {
      return;
    }

    console.log('[PaymentWidget] Initializing widget with token:', confirmationToken.substring(0, 10) + '...');

    try {
      const config: YooKassaWidgetConfig = {
        confirmation_token: confirmationToken,

        // Customization to match our design - organic and beautiful colors
        customization: {
          colors: {
            control_primary: '#a855f7', // Purple-500 - более мягкий фиолетовый
            control_primary_content: '#ffffff', // Белый текст на кнопках
            background: '#ffffff',
            text: '#1f2937', // Gray-800 - основной текст
            border: '#e5e7eb', // Gray-200 - мягкие границы
            control_secondary: '#f3f4f6', // Gray-100 - вторичные элементы
          },
        },

        error_callback: (error) => {
          console.error('[PaymentWidget] Widget error:', error);
          setPaymentStatus('error');
          onError?.(new Error(error.description || 'Payment widget error'));
        },
      };

      const widget = new window.YooMoneyCheckoutWidget(config);

      // Handle success event
      widget.on('success', async () => {
        console.log('[PaymentWidget] Payment successful!');
        setPaymentStatus('success');

        // Trigger song generation immediately (don't wait for webhook in dev mode)
        try {
          console.log('[PaymentWidget] Triggering song generation...');
          const processResponse = await fetch('/api/song/process', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: orderId,
            }),
          });

          if (!processResponse.ok) {
            console.error('[PaymentWidget] Failed to trigger generation:', await processResponse.text());
          } else {
            console.log('[PaymentWidget] Song generation triggered successfully!');
          }
        } catch (error) {
          console.error('[PaymentWidget] Error triggering generation:', error);
        }

        // Wait a bit to show success animation, then redirect
        setTimeout(() => {
          router.push(`/order/${orderId}`);
          onSuccess?.();
        }, 1500);
      });

      // Handle failure event
      widget.on('fail', () => {
        console.log('[PaymentWidget] Payment failed');
        setPaymentStatus('error');
      });

      // Render widget
      widget.render('payment-widget-container')
        .then(() => {
          console.log('[PaymentWidget] Widget rendered successfully');
          setIsWidgetReady(true);
        })
        .catch((err) => {
          console.error('[PaymentWidget] Failed to render widget:', err);
          onError?.(err);
        });

      widgetRef.current = widget;

      return () => {
        // Cleanup: destroy widget on unmount
        if (widgetRef.current) {
          try {
            widgetRef.current.destroy();
          } catch (err) {
            console.error('[PaymentWidget] Error destroying widget:', err);
          }
        }
      };
    } catch (err) {
      console.error('[PaymentWidget] Error initializing widget:', err);
      onError?.(err as Error);
    }
  }, [isScriptLoaded, confirmationToken, orderId, router, onSuccess, onError]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* Шаг 1: Форма - всегда завершён */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Форма</span>
          </div>

          <div className={`h-0.5 w-12 transition-colors duration-500 ${
            paymentStatus === 'success' ? 'bg-green-500' : 'bg-primary'
          }`} />

          {/* Шаг 2: Оплата - активен до успешной оплаты */}
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold transition-all duration-500 ${
              paymentStatus === 'success'
                ? 'bg-green-500'
                : 'bg-primary'
            }`}>
              {paymentStatus === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                '2'
              )}
            </div>
            <span className={`text-sm font-medium transition-colors duration-500 ${
              paymentStatus === 'success' ? 'text-green-600' : 'text-primary'
            }`}>
              Оплата
            </span>
          </div>

          <div className={`h-0.5 w-12 transition-colors duration-500 ${
            paymentStatus === 'success' ? 'bg-green-500' : 'bg-slate-300'
          }`} />

          {/* Шаг 3: Генерация - активируется после успешной оплаты */}
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                paymentStatus === 'success'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-300 text-slate-600'
              }`}
              animate={paymentStatus === 'success' ? {
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0],
              } : {}}
              transition={{
                duration: 2,
                repeat: paymentStatus === 'success' ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <Music2 className="w-5 h-5" />
            </motion.div>
            <span className={`text-sm font-medium transition-colors duration-500 ${
              paymentStatus === 'success' ? 'text-purple-600' : 'text-slate-500'
            }`}>
              Генерация
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Оплата заказа #{orderId.slice(0, 8)}
        </h2>
      </motion.div>

      {/* Trust Indicators - Компактный стиль как в модальном окне */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-2 mb-6"
      >
        <div className="flex items-center gap-3 text-sm">
          <Shield className="text-green-500 flex-shrink-0" size={20} />
          <span className="text-gray-700 dark:text-gray-300">Безопасная оплата</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Zap className="text-purple-500 flex-shrink-0" size={20} />
          <span className="text-gray-700 dark:text-gray-300">Мгновенное начало генерации</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <CheckCircle2 className="text-blue-500 flex-shrink-0" size={20} />
          <span className="text-gray-700 dark:text-gray-300">Гарантия возврата средств</span>
        </div>
      </motion.div>

      {/* Widget Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        {/* Loading State */}
        {!isWidgetReady && paymentStatus === 'idle' && (
          <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center min-h-[500px] z-10">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-slate-600 dark:text-slate-300">
                Загружаем платёжную форму...
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {paymentStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl border-2 border-green-500 flex items-center justify-center min-h-[500px] z-20"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Оплата прошла успешно!
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Перенаправляем на страницу заказа...
              </p>
            </div>
          </motion.div>
        )}

        {/* Widget Container - будет заполнен ЮKassa */}
        <div
          id="payment-widget-container"
          ref={containerRef}
          className="w-full min-h-[500px] bg-white dark:bg-slate-800 rounded-2xl border-2 border-primary/20 overflow-hidden"
        />
      </motion.div>

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6"
      >
        После оплаты песня будет готова через 3-5 минут. Мы пришлём её на указанный email и покажем на сайте.
      </motion.p>
    </div>
  );
}
