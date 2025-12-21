'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order } from '@/types/database'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default function OrderStatusDisplay({ order }: { order: Order }) {
  const router = useRouter()

  // Авто-обновление для статусов в процессе
  useEffect(() => {
    // Если заказ ещё обрабатывается, обновляем каждые 5 секунд
    if (['pending', 'paid', 'processing'].includes(order.status)) {
      const interval = setInterval(() => {
        router.refresh() // Перезагружает server component
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [order.status, router])

  // Определяем что показывать в зависимости от статуса
  const statusConfig = {
    pending: {
      icon: Clock,
      iconColor: 'text-yellow-500',
      title: '⏳ Ожидаем оплату',
      description: 'Заказ создан, но ещё не оплачен'
    },
    paid: {
      icon: Loader2,
      iconColor: 'text-blue-500',
      title: '💳 Оплата получена!',
      description: 'Начинаем создавать магию...',
      spin: true
    },
    processing: {
      icon: Loader2,
      iconColor: 'text-purple-500',
      title: '✨ Создаём ваш подарок',
      description: getProcessingMessage(order.service_type),
      spin: true
    },
    completed: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      title: '🎉 Готово!',
      description: 'Ваш подарок успешно создан'
    },
    failed: {
      icon: XCircle,
      iconColor: 'text-red-500',
      title: '❌ Что-то пошло не так',
      description: 'Произошла ошибка при создании'
    }
  }

  const config = statusConfig[order.status]
  const Icon = config.icon

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Icon
            className={`w-16 h-16 ${config.iconColor} ${config.spin ? 'animate-spin' : ''}`}
          />
        </div>
        <CardTitle className="text-2xl">{config.title}</CardTitle>
        <CardDescription className="text-lg">{config.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Информация о заказе */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Номер заказа:</span>
            <span className="font-mono text-sm">{order.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Сервис:</span>
            <span className="font-semibold">{getServiceName(order.service_type)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span>{order.customer_email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Сумма:</span>
            <span className="font-bold">{order.amount} ₽</span>
          </div>
        </div>

        {/* Таймлайн статусов */}
        <div className="space-y-3">
          <StatusStep
            label="Создан"
            completed={true}
            date={order.created_at}
          />
          <StatusStep
            label="Оплачен"
            completed={['paid', 'processing', 'completed'].includes(order.status)}
          />
          <StatusStep
            label="В обработке"
            completed={['processing', 'completed'].includes(order.status)}
            date={order.processing_started_at}
          />
          <StatusStep
            label="Готов"
            completed={order.status === 'completed'}
            date={order.completed_at}
          />
        </div>

        {/* Сообщение в зависимости от статуса */}
        {order.status === 'processing' && (
          <div className="text-center text-muted-foreground">
            <p>Обычно занимает 5-10 минут</p>
            <p className="text-sm mt-1">Результат придёт на {order.customer_email}</p>
          </div>
        )}

        {order.status === 'completed' && order.result_url && (
          <div className="space-y-4">
            {/* Превью результата (если картинка) */}
            {order.service_type === 'tarot' && (
              <div className="flex justify-center">
                <img
                  src={order.result_url}
                  alt="Карта Таро"
                  className="max-w-sm rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Кнопка скачивания */}
            <Button
              asChild
              size="lg"
              className="w-full bg-primary"
            >
              <a href={order.result_url} download target="_blank">
                Скачать результат
              </a>
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Результат также отправлен на {order.customer_email}
            </p>
          </div>
        )}

        {order.status === 'failed' && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              {order.error_message || 'Произошла неизвестная ошибка'}
            </p>
            <p className="text-sm text-red-600 dark:text-red-300 mt-2">
              Напишите в поддержку: support@vibegift.ru
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/">← Вернуться на главную</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/">Создать ещё подарок</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Вспомогательные функции
function getServiceName(type: string) {
  const names: Record<string, string> = {
    tarot: 'Гадание Таро',
    santa: 'Видео от Деда Мороза',
    song: 'Персональная песня'
  }
  return names[type] || type
}

function getProcessingMessage(type: string) {
  const messages: Record<string, string> = {
    tarot: '🔮 Вселенная раскладывает карты...',
    santa: '🎅 Дед Мороз записывает поздравление...',
    song: '🎵 Музыканты записывают трек...'
  }
  return messages[type] || 'Создаём магию...'
}

// Компонент шага в таймлайне
function StatusStep({
  label,
  completed,
  date
}: {
  label: string
  completed: boolean
  date?: string | null
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 rounded-full border-2 ${
        completed
          ? 'bg-primary border-primary'
          : 'border-slate-300 dark:border-slate-700'
      }`} />
      <div className="flex-1">
        <p className={completed ? 'font-medium' : 'text-muted-foreground'}>
          {label}
        </p>
        {date && (
          <p className="text-xs text-muted-foreground">
            {new Date(date).toLocaleString('ru-RU')}
          </p>
        )}
      </div>
    </div>
  )
}
