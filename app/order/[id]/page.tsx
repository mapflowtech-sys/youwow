import { getOrderById } from '@/lib/db-helpers'
import { notFound } from 'next/navigation'
import OrderStatusDisplay from './OrderStatusDisplay'

// Server Component
export default async function OrderPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let order

  try {
    order = await getOrderById(id)
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <OrderStatusDisplay order={order} />
      </div>
    </div>
  )
}
