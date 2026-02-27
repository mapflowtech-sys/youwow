"use client";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RefreshCw, Home, Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, Suspense } from "react";

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Получаем сообщение об ошибке из URL параметров
    const errorParam = searchParams.get('error') || searchParams.get('message');
    setErrorMessage(errorParam || "");
  }, [searchParams]);

  const handleTryAgain = () => {
    // Возвращаем пользователя к форме заказа
    router.push('/song');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleContactSupport = () => {
    window.open('https://t.me/youwow_support', '_blank');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-2 border-red-200 dark:border-red-900 shadow-2xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            {/* Error Icon with Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
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
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-red-400 dark:bg-red-600 rounded-full blur-2xl"
                />

                {/* Main icon */}
                <div className="relative w-24 h-24 bg-linear-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
                  <XCircle className="w-16 h-16 text-white" />
                </div>

                {/* Floating alert icons */}
                {[...Array(4)].map((_, i) => {
                  const angle = (i * 90 * Math.PI) / 180;
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
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut"
                      }}
                      className="absolute"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                    >
                      <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Оплата не прошла
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
                К сожалению, при обработке платежа произошла ошибка
              </p>
            </motion.div>

            {/* Error Message (if provided) */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mb-8"
              >
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-sm text-red-800 dark:text-red-300 text-center">
                    <span className="font-semibold">Причина:</span> {errorMessage}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Possible Reasons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-4 mb-8"
            >
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white">
                  Возможные причины:
                </h3>
                <ul className="space-y-2.5 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Недостаточно средств на карте</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Карта заблокирована или истек срок действия</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Превышен лимит операций по карте</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Технический сбой на стороне банка</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Платёж отклонён системой безопасности</span>
                  </li>
                </ul>
              </div>

              {/* What to Do */}
              <div className="bg-linear-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white">
                  Что делать?
                </h3>
                <ul className="space-y-2.5 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>Проверьте баланс карты и лимиты</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>Попробуйте использовать другую карту</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>Свяжитесь с банком для уточнения деталей</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>Если проблема сохраняется - напишите нам в поддержку</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-3"
            >
              {/* Primary CTA - Try Again */}
              <Button
                onClick={handleTryAgain}
                size="lg"
                className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 shadow-lg"
              >
                <RefreshCw className="mr-2 w-5 h-5" />
                Попробовать снова
              </Button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleContactSupport}
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-6"
                >
                  <Mail className="mr-2 w-5 h-5" />
                  Написать в поддержку
                </Button>

                <Button
                  onClick={handleGoHome}
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 py-6"
                >
                  <Home className="mr-2 w-5 h-5" />
                  На главную
                </Button>
              </div>
            </motion.div>

            {/* Guarantee Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-8 text-center p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800"
            >
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-amber-700 dark:text-amber-400">Важно:</span> Деньги с вашей карты не были списаны. Вы можете безопасно попробовать оплату снова.
              </p>
            </motion.div>

            {/* Support Contact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Мы всегда на связи:{" "}
                <a
                  href="https://t.me/youwow_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  @youwow_support
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Загрузка...</p>
        </div>
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  );
}
