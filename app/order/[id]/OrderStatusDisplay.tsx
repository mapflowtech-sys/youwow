'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Order } from '@/types/database'
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  XCircle,
  Clock,
  Music2,
  Sparkles,
  Download,
  Share2,
  Copy,
  Check
} from 'lucide-react'
import Link from 'next/link'

// Интересные факты о музыке для показа во время ожидания
const MUSIC_FACTS = [
  "Знаете ли вы? Музыка способна синхронизировать сердцебиение слушателей на концерте!",
  "Интересный факт: Самая короткая песня в мире длится всего 1.3 секунды и называется 'You Suffer'",
  "А вы знали? Прослушивание музыки снижает уровень стресса на 65%",
  "Факт дня: Растения растут быстрее под классическую музыку",
  "Знаете ли вы? Песня 'Happy Birthday' была защищена авторским правом до 2016 года",
  "Интересно: В среднем человек тратит 5 лет своей жизни на прослушивание музыки",
  "А вы знали? Музыка может помочь вам восстановить воспоминания даже при потере памяти",
  "Факт: Ваше сердцебиение подстраивается под ритм музыки, которую вы слушаете",
  "Знаете ли вы? Финская группа провела самый длинный концерт - 1154 часа (48 дней!)",
  "Интересно: Песни с темпом 120-140 ударов в минуту идеально подходят для тренировок"
];

export default function OrderStatusDisplayNew({ order }: { order: Order }) {
  const router = useRouter()
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  // Авто-обновление для статусов в процессе
  useEffect(() => {
    if (['pending', 'paid', 'processing'].includes(order.status)) {
      const interval = setInterval(() => {
        router.refresh()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [order.status, router])

  // Смена фактов каждые 8 секунд
  useEffect(() => {
    if (order.status === 'processing') {
      const interval = setInterval(() => {
        setCurrentFactIndex((prev) => (prev + 1) % MUSIC_FACTS.length)
      }, 8000)

      return () => clearInterval(interval)
    }
  }, [order.status])

  const getStatusConfig = () => {
    const configs = {
      pending: {
        icon: Clock,
        iconColor: 'text-yellow-500',
        bgGradient: 'from-yellow-500/10 to-orange-500/10',
        title: 'Ожидаем оплату',
        description: 'Заказ создан, переходите к оплате',
        showAnimation: false
      },
      paid: {
        icon: CheckCircle2,
        iconColor: 'text-green-500',
        bgGradient: 'from-green-500/10 to-emerald-500/10',
        title: 'Оплата получена!',
        description: 'Начинаем создавать вашу песню...',
        showAnimation: true
      },
      processing: {
        icon: Music2,
        iconColor: 'text-purple-500',
        bgGradient: 'from-purple-500/10 to-pink-500/10',
        title: 'Создаём вашу песню',
        description: 'Это займёт 3-5 минут. Можете вернуться позже - мы пришлём результат на email.',
        showAnimation: true
      },
      completed: {
        icon: CheckCircle2,
        iconColor: 'text-green-500',
        bgGradient: 'from-green-500/10 to-emerald-500/10',
        title: 'Ваша песня готова!',
        description: 'Слушайте и делитесь с друзьями',
        showAnimation: false
      },
      failed: {
        icon: XCircle,
        iconColor: 'text-red-500',
        bgGradient: 'from-red-500/10 to-rose-500/10',
        title: 'Что-то пошло не так',
        description: 'Произошла ошибка при создании',
        showAnimation: false
      }
    }

    return configs[order.status] || configs.pending
  }

  const config = getStatusConfig()
  const Icon = config.icon

  // Копирование ссылки
  const copyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Функции для шаринга
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Послушайте мою персональную песню от YouWow! ${window.location.href}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const shareToTelegram = () => {
    const text = encodeURIComponent(`Послушайте мою персональную песню!`)
    const url = encodeURIComponent(window.location.href)
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
  }

  const shareToVK = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://vk.com/share.php?url=${url}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        {/* Gradient Header */}
        <div className={`bg-gradient-to-br ${config.bgGradient} p-8`}>
          <div className="text-center">
            {/* Animated Icon */}
            <motion.div
              className="flex justify-center mb-4"
              animate={config.showAnimation ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{
                duration: 2,
                repeat: config.showAnimation ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <div className={`relative ${config.showAnimation ? 'animate-pulse' : ''}`}>
                <Icon className={`w-16 h-16 ${config.iconColor}`} />
                {config.showAnimation && (
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  >
                    <Sparkles className={`w-16 h-16 ${config.iconColor}`} />
                  </motion.div>
                )}
              </div>
            </motion.div>

            <CardTitle className="text-2xl md:text-3xl mb-2">{config.title}</CardTitle>
            <CardDescription className="text-base">{config.description}</CardDescription>
          </div>
        </div>

        <CardContent className="space-y-6 pt-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            <ProgressStep label="Форма" completed={true} />
            <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 mx-2">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: ['paid', 'processing', 'completed'].includes(order.status) ? '100%' : 0 }}
              />
            </div>
            <ProgressStep label="Оплата" completed={['paid', 'processing', 'completed'].includes(order.status)} />
            <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 mx-2">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: order.status === 'completed' ? '100%' : 0 }}
              />
            </div>
            <ProgressStep label="Генерация" completed={order.status === 'completed'} />
          </div>

          {/* Order Info */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Заказ:</span>
              <span className="font-mono">#{order.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span>{order.customer_email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Сумма:</span>
              <span className="font-bold">{order.amount} ₽</span>
            </div>
          </div>

          {/* Интересный факт во время обработки */}
          {order.status === 'processing' && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFactIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 text-center"
              >
                <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <p className="text-sm text-purple-900 dark:text-purple-100">
                  {MUSIC_FACTS[currentFactIndex]}
                </p>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Результат для completed */}
          {order.status === 'completed' && order.result_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Audio Player (if song) */}
              {order.service_type === 'song' && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                  <audio controls className="w-full" src={order.result_url}>
                    Ваш браузер не поддерживает аудио.
                  </audio>
                </div>
              )}

              {/* Download Button */}
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <a href={order.result_url} download>
                  <Download className="mr-2 h-5 w-5" />
                  Скачать песню
                </a>
              </Button>

              {/* Share Buttons */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-semibold">Поделиться:</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToWhatsApp}
                    className="w-full"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToTelegram}
                    className="w-full"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.042-1.362 5.362-.168.558-.5.744-.818.762-.696.033-1.224-.46-1.898-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.782-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.491-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.326.016.062.036.203.02.313z"/>
                    </svg>
                    Telegram
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToVK}
                    className="w-full"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.27.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.744-.576.744z"/>
                    </svg>
                    VK
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyLink}
                    className="w-full"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Скопировано
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Ссылка
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Песня также отправлена на {order.customer_email}
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          {order.status === 'failed' && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                {order.error_message || 'Произошла неизвестная ошибка'}
              </p>
              <p className="text-sm text-red-600 dark:text-red-300">
                Напишите нам в Telegram:{" "}
                <a
                  href="https://t.me/youwow_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  @youwow_support
                </a>
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-900">
          <Button asChild variant="outline" className="w-full">
            <Link href="/song">Создать ещё одну песню</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">Вернуться на главную</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Progress Step Component
function ProgressStep({ label, completed }: { label: string; completed: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
          completed
            ? 'bg-primary border-primary text-white'
            : 'border-slate-300 dark:border-slate-700 text-slate-400'
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {completed && <CheckCircle2 className="w-5 h-5" />}
      </motion.div>
      <p className={`text-xs mt-2 ${completed ? 'font-semibold' : 'text-muted-foreground'}`}>
        {label}
      </p>
    </div>
  )
}
