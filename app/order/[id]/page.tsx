import { getOrderById } from '@/lib/db-helpers'
import { notFound } from 'next/navigation'
import OrderStatusDisplay from './OrderStatusDisplay'

// Server Component
export default async function OrderPage({
  params
}: {
  params: { id: string }
}) {
  let order

  try {
    order = await getOrderById(params.id)
  } catch (error) {
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
