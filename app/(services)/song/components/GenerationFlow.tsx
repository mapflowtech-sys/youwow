'use client';

import React, { useReducer, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Music, CheckCircle, XCircle, X, Download, Mail } from 'lucide-react';
import { SongFormData } from '@/lib/genapi/text-generation';

// Типы состояний
type FlowState =
  | { step: 'idle' }
  | { step: 'payment-modal' }
  | { step: 'generating-text'; progress: number }
  | { step: 'generating-music'; progress: number; songText: string }
  | { step: 'success'; audioUrl: string; songText: string }
  | { step: 'error'; message: string };

type FlowAction =
  | { type: 'SHOW_PAYMENT' }
  | { type: 'CLOSE_PAYMENT' }
  | { type: 'START_GENERATION'; orderId: string }
  | { type: 'UPDATE_TEXT_PROGRESS'; progress: number }
  | { type: 'TEXT_COMPLETED'; songText: string }
  | { type: 'UPDATE_MUSIC_PROGRESS'; progress: number }
  | { type: 'GENERATION_SUCCESS'; audioUrl: string; songText: string }
  | { type: 'GENERATION_ERROR'; message: string }
  | { type: 'RETRY' };

// Reducer для управления состоянием
function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'SHOW_PAYMENT':
      return { step: 'payment-modal' };
    case 'CLOSE_PAYMENT':
      return { step: 'idle' };
    case 'START_GENERATION':
      return { step: 'generating-text', progress: 0 };
    case 'UPDATE_TEXT_PROGRESS':
      return state.step === 'generating-text'
        ? { ...state, progress: action.progress }
        : state;
    case 'TEXT_COMPLETED':
      return { step: 'generating-music', progress: 0, songText: action.songText };
    case 'UPDATE_MUSIC_PROGRESS':
      return state.step === 'generating-music'
        ? { ...state, progress: action.progress }
        : state;
    case 'GENERATION_SUCCESS':
      return { step: 'success', audioUrl: action.audioUrl, songText: action.songText };
    case 'GENERATION_ERROR':
      return { step: 'error', message: action.message };
    case 'RETRY':
      return { step: 'idle' };
    default:
      return state;
  }
}

interface GenerationFlowProps {
  formData: SongFormData;
  onSubmit: () => void;
  onReset: () => void;
}

export default function GenerationFlow({ formData, onReset }: GenerationFlowProps) {
  const [state, dispatch] = useReducer(flowReducer, { step: 'idle' });
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentOrderIdRef = useRef<string | null>(null);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Обработка отправки формы
  const handleFormSubmit = () => {
    dispatch({ type: 'SHOW_PAYMENT' });
  };

  // Обработка "оплаты"
  const handlePayment = async () => {
    dispatch({ type: 'CLOSE_PAYMENT' });

    try {
      // Создаём заказ
      const createResponse = await fetch('/api/song/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!createResponse.ok) {
        throw new Error('Ошибка создания заказа');
      }

      const { orderId } = await createResponse.json();
      currentOrderIdRef.current = orderId;

      // Сохраняем в localStorage
      localStorage.setItem('currentOrder', JSON.stringify({
        orderId,
        formData,
        timestamp: Date.now(),
      }));

      dispatch({ type: 'START_GENERATION', orderId });

      // Запускаем "оплату" и обработку
      const processResponse = await fetch('/api/song/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      if (!processResponse.ok) {
        throw new Error('Ошибка запуска генерации');
      }

      // Начинаем polling статуса
      startPolling(orderId);

    } catch (error) {
      console.error('Payment error:', error);
      dispatch({
        type: 'GENERATION_ERROR',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      });
    }
  };

  // Polling статуса заказа
  const startPolling = (orderId: string) => {
    let attempt = 0;
    const maxAttempts = 180; // 15 минут (каждые 5 сек)

    pollingIntervalRef.current = setInterval(async () => {
      attempt++;

      if (attempt > maxAttempts) {
        clearInterval(pollingIntervalRef.current!);
        dispatch({
          type: 'GENERATION_ERROR',
          message: 'Превышено время ожидания. Мы отправим результат на ваш email.'
        });
        return;
      }

      try {
        const response = await fetch(`/api/song/status?orderId=${orderId}&t=${Date.now()}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          cache: 'no-store',
        });
        const data = await response.json();

        console.log(`[Polling #${attempt}]`, 'Status:', data.order?.status, 'Step:', data.order?.resultMetadata?.step);

        if (!data.success) {
          throw new Error(data.error || 'Ошибка получения статуса');
        }

        const { order } = data;

        // Обновляем прогресс в зависимости от статуса
        if (order.status === 'processing') {
          const metadata = order.resultMetadata;

          if (metadata?.step === 'text_generated' && state.step === 'generating-text') {
            // Текст готов, переходим к музыке
            console.log('[State Change] Переход к генерации музыки');
            dispatch({ type: 'TEXT_COMPLETED', songText: metadata.songText });
          } else if (state.step === 'generating-text') {
            // Генерируем текст - показываем плавный прогресс
            // 2 минуты генерации = 24 попытки по 5 сек
            // Делаем прогресс до 95%, чтобы оставить место на финал
            const progress = Math.min(95, Math.floor((attempt / 24) * 100));
            dispatch({ type: 'UPDATE_TEXT_PROGRESS', progress });
          } else if (state.step === 'generating-music') {
            // Генерируем музыку - показываем плавный прогресс
            const progress = Math.min(95, Math.floor((attempt / 60) * 100));
            dispatch({ type: 'UPDATE_MUSIC_PROGRESS', progress });
          }
        } else if (order.status === 'completed') {
          // Всё готово!
          console.log('[SUCCESS]', 'Audio URL:', order.resultUrl);
          clearInterval(pollingIntervalRef.current!);
          localStorage.removeItem('currentOrder');

          dispatch({
            type: 'GENERATION_SUCCESS',
            audioUrl: order.resultUrl,
            songText: order.resultMetadata?.songText || ''
          });
        } else if (order.status === 'failed') {
          clearInterval(pollingIntervalRef.current!);
          dispatch({
            type: 'GENERATION_ERROR',
            message: order.errorMessage || 'Ошибка генерации'
          });
        }
      } catch (error) {
        console.error('Polling error:', error);
        // Не останавливаем polling при единичной ошибке
      }
    }, 5000); // Каждые 5 секунд
  };

  // Удалили fake прогресс для музыки - теперь прогресс управляется через polling

  // Рендер в зависимости от состояния
  if (state.step === 'idle') {
    return (
      <button
        onClick={handleFormSubmit}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Попробовать бесплатно
      </button>
    );
  }

  return (
    <>
      {/* Payment Modal */}
      <AnimatePresence>
        {state.step === 'payment-modal' && (
          <PaymentModal
            onConfirm={handlePayment}
            onClose={() => dispatch({ type: 'CLOSE_PAYMENT' })}
          />
        )}
      </AnimatePresence>

      {/* Generation Screens */}
      <AnimatePresence mode="wait">
        {(state.step === 'generating-text' || state.step === 'generating-music') && (
          <UnifiedGenerationScreen />
        )}
        {state.step === 'success' && (
          <SuccessScreen
            audioUrl={state.audioUrl}
            songText={state.songText}
            email={formData.email}
            onNewSong={onReset}
          />
        )}
        {state.step === 'error' && (
          <ErrorScreen
            message={state.message}
            onRetry={() => {
              dispatch({ type: 'RETRY' });
              onReset();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Payment Modal Component
function PaymentModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
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
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6"
          >
            <Music className="text-white" size={32} />
          </motion.div>

          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Пробная версия
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Сейчас вы можете создать свою песню совершенно бесплатно!
            В будущем эта функция станет платной.
          </p>

          {/* Price Display */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Обычная цена
            </div>
            <div className="text-3xl font-bold text-gray-400 dark:text-gray-500 line-through mb-2">
              1 990 ₽
            </div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              БЕСПЛАТНО
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Создать песню бесплатно
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Нажимая кнопку, вы соглашаетесь с условиями использования
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Unified Generation Screen (combines text and music generation)
function UnifiedGenerationScreen() {
  const [phase, setPhase] = React.useState<'text' | 'music'>('text');

  // Auto-switch from text to music phase after 20 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('music');
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, []);

  const isTextPhase = phase === 'text';

  return (
    <motion.div
      key="generating"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="text-center max-w-2xl w-full px-4">
        {/* Animated Icon Container */}
        <div className="relative mb-12 h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isTextPhase ? (
              <motion.div
                key="text-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Main Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-28 h-28 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl relative z-10"
                >
                  <Sparkles className="text-white" size={56} />
                </motion.div>

                {/* Floating particles around the icon */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180;
                    const radius = 65;
                    const startX = Math.cos(angle) * radius;
                    const startY = Math.sin(angle) * radius;

                    return (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -15, 0],
                          opacity: [0.4, 1, 0.4],
                          scale: [0.6, 1.2, 0.6]
                        }}
                        transition={{
                          duration: 2 + i * 0.15,
                          repeat: Infinity,
                          delay: i * 0.12,
                          ease: "easeInOut"
                        }}
                        className="absolute w-3 h-3 bg-purple-400 rounded-full shadow-lg"
                        style={{
                          left: `calc(50% + ${startX}px)`,
                          top: `calc(50% + ${startY}px)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="music-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Main Music Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl relative"
                >
                  <Music className="text-white relative z-20" size={56} />

                  {/* Equalizer bars */}
                  <div className="absolute inset-0 flex items-center justify-center gap-0.5 z-10">
                    {[...Array(7)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scaleY: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 0.5 + i * 0.08,
                          repeat: Infinity,
                          delay: i * 0.06,
                          ease: "easeInOut"
                        }}
                        className="w-1.5 bg-white/30 rounded-full"
                        style={{ height: '50%' }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Sound waves expanding outward */}
                <div className="absolute inset-0">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 2.2],
                        opacity: [0.5, 0]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "easeOut"
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-3 border-blue-400 dark:border-blue-500 rounded-full"
                      style={{ borderWidth: '3px' }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Title and Subtitle with smooth transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              {isTextPhase ? 'Создаём текст вашей песни' : 'Создаём ваш неповторимый трек'}
            </h2>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
              {isTextPhase
                ? 'Подбираем идеальные слова и рифмы специально для вас'
                : 'Собираем мелодию, аранжировку и вокал в единую композицию'
              }
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Static Info Box - remains unchanged during phase transition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-purple-200 dark:border-purple-800 shadow-xl"
        >
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Обычно на создание полноценной песни уходит <span className="font-semibold text-purple-600 dark:text-purple-400">от 2 до 5 минут</span>
          </p>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Вы можете заниматься своими делами. По завершению работы песня будет доступна для скачивания прямо здесь, а также мы отправим её на указанную вами почту
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Success Screen
function SuccessScreen({
  audioUrl,
  email,
  onNewSong
}: {
  audioUrl: string;
  songText: string;
  email: string;
  onNewSong: () => void;
}) {
  const handleDownload = async () => {
    try {
      // Fetch the file as blob to force download without redirect
      const response = await fetch(audioUrl);
      const blob = await response.blob();

      // Create object URL from blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `my-song-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback to direct link if fetch fails
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `my-song-${Date.now()}.mp3`;
      link.click();
    }
  };

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="text-white" size={48} />
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Песня готова! 🎵
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Ваша уникальная композиция создана и готова к прослушиванию
        </p>

        {/* Audio Player */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-6">
          <audio controls className="w-full" src={audioUrl}>
            Ваш браузер не поддерживает аудио элемент.
          </audio>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-4"
        >
          <Download size={20} />
          Скачать MP3
        </button>

        {/* Email Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Mail size={16} />
          <span>Также отправили на email: {email}</span>
        </div>

        {/* New Song Button */}
        <button
          onClick={onNewSong}
          className="w-full border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold py-3 px-8 rounded-xl transition-all duration-200"
        >
          Заказать ещё песню
        </button>
      </motion.div>
    </motion.div>
  );
}

// Error Screen
function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6"
        >
          <XCircle className="text-white" size={48} />
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Что-то пошло не так
        </h2>

        {/* Error Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {message}
        </p>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
        >
          Попробовать снова
        </button>

        {/* Support Link */}
        <a
          href="https://t.me/your_support"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
        >
          Написать в поддержку
        </a>
      </motion.div>
    </motion.div>
  );
}
