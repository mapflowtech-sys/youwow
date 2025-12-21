'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingMagicProps {
  service: 'santa' | 'song'
  stage?: 'generating' | 'processing' | 'finalizing'
}

const MESSAGES = {
  santa: {
    generating: '🎅 Дед Мороз пишет поздравление...',
    processing: '🎤 Записываем голос Деда Мороза...',
    finalizing: '🎬 Монтируем персональное видео...',
  },
  song: {
    generating: '🎵 Композитор сочиняет мелодию...',
    processing: '🎙 Вокалист записывает трек...',
    finalizing: '🎧 Сводим и мастерим песню...',
  }
}

export function LoadingMagic({ service, stage = 'generating' }: LoadingMagicProps) {
  const message = MESSAGES[service][stage]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 space-y-6"
    >
      {/* Анимированный лоадер */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-16 h-16 text-primary" />
      </motion.div>

      {/* Сообщение */}
      <motion.p
        key={message} // Ключ для анимации при смене сообщения
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-medium text-center"
      >
        {message}
      </motion.p>

      {/* Подсказка */}
      <p className="text-sm text-muted-foreground text-center">
        Обычно занимает 10-15 секунд
      </p>
    </motion.div>
  )
}
