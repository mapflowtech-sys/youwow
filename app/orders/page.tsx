'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function OrdersPage() {
  const [email, setEmail] = useState('')

  // TODO: В будущем здесь будет поиск всех заказов по email
  // Пока просим ввести ID заказа

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Мои заказы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Введите email, который указывали при заказе
            </p>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full" disabled>
              Скоро будет доступно
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Пока проверяйте заказы по ссылке из email
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
