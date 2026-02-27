"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Music } from "lucide-react";
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

    return () => {};
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

        customization: {
          colors: {
            control_primary: '#E8567F',
            control_primary_content: '#ffffff',
            background: '#ffffff',
            text: '#1A1814',
            border: '#E5E0DA',
            control_secondary: '#F5F3F0',
          },
        },

        error_callback: (error) => {
          console.error('[PaymentWidget] Widget error:', error);
          setPaymentStatus('error');
          onError?.(new Error(error.description || 'Payment widget error'));
        },
      };

      const widget = new window.YooMoneyCheckoutWidget(config);

      widget.on('success', async () => {
        console.log('[PaymentWidget] Payment successful!');
        setPaymentStatus('success');

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

        setTimeout(() => {
          router.push(`/order/${orderId}`);
          onSuccess?.();
        }, 1500);
      });

      widget.on('fail', () => {
        console.log('[PaymentWidget] Payment failed');
        setPaymentStatus('error');
      });

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
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* Step 1: Form - always completed */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-foreground">Форма</span>
          </div>

          <div className={`h-0.5 w-12 transition-colors duration-500 ${
            paymentStatus === 'success' ? 'bg-green-500' : 'bg-primary'
          }`} />

          {/* Step 2: Payment */}
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold transition-all duration-500 ${
              paymentStatus === 'success' ? 'bg-green-500' : 'bg-primary'
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
            paymentStatus === 'success' ? 'bg-green-500' : 'bg-border'
          }`} />

          {/* Step 3: Generation */}
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
              paymentStatus === 'success'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground'
            }`}>
              <Music className="w-4 h-4" />
            </div>
            <span className={`text-sm font-medium transition-colors duration-500 ${
              paymentStatus === 'success' ? 'text-primary' : 'text-muted-foreground'
            }`}>
              Генерация
            </span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
          Оплата заказа #{orderId.slice(0, 8)}
        </h2>
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-3 text-sm">
          <Shield className="text-green-600 flex-shrink-0" size={18} />
          <span className="text-muted-foreground">Безопасная оплата</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
          <span className="text-muted-foreground">Гарантия возврата средств</span>
        </div>
      </div>

      {/* Widget Container */}
      <div className="relative">
        {/* Loading State */}
        {!isWidgetReady && paymentStatus === 'idle' && (
          <div className="absolute inset-0 bg-white rounded-2xl border border-border flex items-center justify-center min-h-[500px] z-10">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4"
                style={{ borderWidth: '3px' }}
              />
              <p className="text-muted-foreground">
                Загружаем платёжную форму...
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {paymentStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-white rounded-2xl border border-green-500 flex items-center justify-center min-h-[500px] z-20"
          >
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Оплата прошла успешно!
              </h3>
              <p className="text-muted-foreground">
                Перенаправляем на страницу заказа...
              </p>
            </div>
          </motion.div>
        )}

        {/* Widget Container */}
        <div
          id="payment-widget-container"
          ref={containerRef}
          className="w-full min-h-[500px] bg-white rounded-2xl border border-border overflow-hidden"
        />
      </div>

      {/* Footer Note */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        После оплаты песня будет готова через 3-5 минут. Мы пришлём её на указанный email и покажем на сайте.
      </p>
    </div>
  );
}
