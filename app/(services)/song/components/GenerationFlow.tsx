'use client';

import React, { useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, CheckCircle, XCircle, Download, Mail, Loader2 } from 'lucide-react';
import { SongFormData } from '@/lib/genapi/text-generation';
import PaymentModal from './PaymentModal';

// State types
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
  const bypassEmail = process.env.NEXT_PUBLIC_TEST_BYPASS_EMAIL || process.env.TEST_BYPASS_EMAIL;
  const shouldBypassPayment = bypassEmail && formData.email.toLowerCase() === bypassEmail.toLowerCase();

  const initialStep = shouldBypassPayment ? 'generating-text' : 'payment-modal';
  const [state, dispatch] = useReducer(flowReducer, {
    step: initialStep as 'payment-modal',
    ...(shouldBypassPayment && { progress: 0 })
  });

  React.useEffect(() => {
    if (shouldBypassPayment && state.step === 'generating-text') {
      handleBypassPaymentAndStartGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldBypassPayment, state.step]);

  const handleBypassPaymentAndStartGeneration = async () => {
    try {
      console.log('[Bypass] Creating order without payment for:', formData.email);

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          formData: formData,
          bypass: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create test order');
      }

      const data = await response.json();
      console.log('[Bypass] Order created:', data.orderId);
    } catch (error) {
      console.error('[Bypass] Error:', error);
      dispatch({
        type: 'GENERATION_ERROR',
        message: 'Ошибка при создании тестового заказа'
      });
    }
  };

  const handleFormSubmit = () => {
    dispatch({ type: 'SHOW_PAYMENT' });
  };

  const handlePaymentInitiated = (paymentGuid: string) => {
    console.log('[Payment] Initiated, redirecting to 1plat:', paymentGuid);
  };

  if (state.step === 'idle') {
    return (
      <button
        onClick={handleFormSubmit}
        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl transition-colors"
      >
        Получить готовую песню
      </button>
    );
  }

  return (
    <>
      <AnimatePresence>
        {state.step === 'payment-modal' && (
          <PaymentModal
            formData={formData}
            onPaymentInitiated={handlePaymentInitiated}
            onClose={() => {
              dispatch({ type: 'CLOSE_PAYMENT' });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(state.step === 'generating-text' || state.step === 'generating-music') && (
          <GenerationScreen />
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

// Generation Screen
function GenerationScreen() {
  const [phase, setPhase] = React.useState<'text' | 'music'>('text');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('music');
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const isTextPhase = phase === 'text';

  return (
    <motion.div
      key="generating"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background"
    >
      <div className="text-center max-w-2xl w-full px-4">
        {/* Animated icon */}
        <div className="relative mb-12 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 bg-primary rounded-full flex items-center justify-center"
          >
            {isTextPhase ? (
              <Loader2 className="text-white animate-spin" size={40} />
            ) : (
              <Music className="text-white" size={40} />
            )}
          </motion.div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          {isTextPhase ? 'Создаём текст вашей песни' : 'Создаём ваш неповторимый трек'}
        </h2>

        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          {isTextPhase
            ? 'Подбираем идеальные слова и рифмы специально для вас'
            : 'Собираем мелодию, аранжировку и вокал в единую композицию'
          }
        </p>

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-border">
          <p className="text-muted-foreground mb-3">
            Обычно на создание песни уходит <span className="font-semibold text-primary">от 2 до 5 минут</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Вы можете заниматься своими делами. Песня будет доступна для скачивания
            здесь, а также мы отправим её на вашу почту
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
  const handleDownload = async () => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `my-song-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background overflow-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-8 my-8 border border-border"
      >
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="text-white" size={36} />
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">
          Песня готова!
        </h2>

        <p className="text-center text-muted-foreground mb-8">
          Ваша уникальная композиция создана и готова к прослушиванию
        </p>

        {/* Audio Player */}
        <div className="bg-muted rounded-xl p-6 mb-6">
          <audio controls className="w-full" src={audioUrl}>
            Ваш браузер не поддерживает аудио элемент.
          </audio>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 mb-4"
        >
          <Download size={20} />
          Скачать MP3
        </button>

        {/* Email Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
          <Mail size={16} />
          <span>Также отправили на email: {email}</span>
        </div>

        {/* New Song Button */}
        <button
          onClick={onNewSong}
          className="w-full border border-primary text-primary hover:bg-primary/5 font-semibold py-3 px-8 rounded-xl transition-colors"
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center border border-border"
      >
        <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-6">
          <XCircle className="text-white" size={36} />
        </div>

        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Что-то пошло не так
        </h2>

        <p className="text-muted-foreground mb-8">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl transition-colors mb-4"
        >
          Попробовать снова
        </button>

        <a
          href="https://t.me/youwow_support"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm"
        >
          Написать в поддержку
        </a>
      </motion.div>
    </motion.div>
  );
}
