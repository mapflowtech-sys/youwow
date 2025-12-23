'use client';

import { useReducer, useEffect, useRef } from 'react';
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
        const response = await fetch(`/api/song/status?orderId=${orderId}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Ошибка получения статуса');
        }

        const { order } = data;

        // Обновляем прогресс в зависимости от статуса
        if (order.status === 'processing') {
          const metadata = order.resultMetadata;

          if (metadata?.step === 'text_generated') {
            // Текст готов, переходим к музыке
            dispatch({ type: 'TEXT_COMPLETED', songText: metadata.songText });
          } else {
            // Ещё генерируем текст
            const progress = Math.min(90, attempt * 3);
            dispatch({ type: 'UPDATE_TEXT_PROGRESS', progress });
          }
        } else if (order.status === 'completed') {
          // Всё готово!
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

  // Fake прогресс для музыки
  useEffect(() => {
    if (state.step === 'generating-music') {
      const interval = setInterval(() => {
        dispatch({
          type: 'UPDATE_MUSIC_PROGRESS',
          progress: Math.min(95, state.progress + 2)
        });
      }, 3000); // Каждые 3 секунды +2%

      return () => clearInterval(interval);
    }
  }, [state]);

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
        {state.step === 'generating-text' && (
          <GeneratingTextScreen progress={state.progress} />
        )}
        {state.step === 'generating-music' && (
          <GeneratingMusicScreen progress={state.progress} />
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

// Generating Text Screen
function GeneratingTextScreen({ progress }: { progress: number }) {
  return (
    <motion.div
      key="generating-text"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="text-center max-w-md w-full">
        {/* Animated Icon */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-8 shadow-lg"
        >
          <Sparkles className="text-white" size={48} />
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Пишем текст вашей песни...
        </h2>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8">
          Создаём уникальные слова специально для вас
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {progress}%
        </p>
      </div>
    </motion.div>
  );
}

// Generating Music Screen
function GeneratingMusicScreen({ progress }: { progress: number }) {
  const getStatusText = () => {
    if (progress < 20) return 'Анализируем текст песни';
    if (progress < 50) return 'Создаём мелодию';
    if (progress < 80) return 'Записываем вокал';
    return 'Финальная обработка';
  };

  return (
    <motion.div
      key="generating-music"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="text-center max-w-md w-full">
        {/* Animated Music Icon with Equalizer Effect */}
        <motion.div
          className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-8 shadow-lg relative overflow-hidden"
        >
          <Music className="text-white relative z-10" size={48} />

          {/* Equalizer bars */}
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
                className="w-1 bg-white/30 rounded-full"
                style={{ height: '50%' }}
              />
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Создаём музыку...
        </h2>

        {/* Dynamic Status Text */}
        <motion.p
          key={getStatusText()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8"
        >
          {getStatusText()}
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {progress}%
        </p>

        {/* Info Text */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl p-6 text-sm md:text-base text-gray-700 dark:text-gray-300">
          <p className="mb-3">
            По готовности вы сможете скачать результат прямо здесь, и мы продублируем его на ваш email.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Обычно создание занимает 5-7 минут. Не закрывайте эту страницу, чтобы получить песню сразу после завершения.
          </p>
        </div>
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
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `my-song-${Date.now()}.mp3`;
    link.click();
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
