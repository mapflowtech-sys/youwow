"use client";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Music, Sparkles, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, Suspense } from "react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Получаем orderId из URL параметров или localStorage
    const orderIdParam = searchParams.get('orderId');

    // Try to get from localStorage if not in URL
    const savedOrder = localStorage.getItem('currentOrder');
    let foundOrderId = orderIdParam;

    if (!foundOrderId && savedOrder) {
      try {
        const { orderId: savedOrderId } = JSON.parse(savedOrder);
        foundOrderId = savedOrderId;
      } catch (e) {
        console.error('Failed to parse saved order:', e);
      }
    }

    setOrderId(foundOrderId);

    // Auto-redirect to order page after 5 seconds
    if (foundOrderId) {
      const timer = setTimeout(() => {
        router.push(`/order/${foundOrderId}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  const handleGoToOrder = () => {
    if (orderId) {
      router.push(`/order/${orderId}`);
    } else {
      router.push('/orders');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-2 border-green-200 dark:border-green-900 shadow-2xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            {/* Success Icon with Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                {/* Pulsing background */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-green-400 dark:bg-green-600 rounded-full blur-2xl"
                />

                {/* Main icon */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>

                {/* Floating sparkles */}
                {[...Array(6)].map((_, i) => {
                  const angle = (i * 60 * Math.PI) / 180;
                  const radius = 60;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        y: [0, -20]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeOut"
                      }}
                      className="absolute"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                    >
                      <Sparkles className="w-5 h-5 text-green-500 dark:text-green-400" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Оплата прошла успешно!
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
                Спасибо за ваш заказ. Мы уже начали создавать вашу песню
              </p>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-4 mb-8"
            >
              {/* Processing Info */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                      Ваша песня уже в работе
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Обычно генерация занимает от 2 до 5 минут. Готовый трек будет доступен для скачивания на странице заказа и отправлен на вашу почту.
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white">
                  Что дальше?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-400">
                      Мы создадим уникальный текст с вашими историями и именами
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-400">
                      Запишем профессиональный вокал в выбранном вами жанре
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-400">
                      Отправим готовый MP3-файл на указанную почту
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={handleGoToOrder}
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 shadow-lg"
              >
                {orderId ? 'Посмотреть заказ' : 'Мои заказы'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                onClick={handleGoHome}
                size="lg"
                variant="outline"
                className="flex-1 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-lg py-6"
              >
                <Home className="mr-2 w-5 h-5" />
                На главную
              </Button>
            </motion.div>

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Возникли вопросы? Напишите нам в{" "}
                <a
                  href="https://t.me/youwow_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  Telegram
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Загрузка...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
