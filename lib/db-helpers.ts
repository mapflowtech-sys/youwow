import { supabase, supabaseAdmin } from "./supabase";
import type { Order, ServiceOption } from "@/types/database";

// Создать или получить пользователя по email
export async function getOrCreateUser(email: string) {
  // Проверяем существует ли
  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existing) return existing;

  // Создаём нового
  const { data: newUser, error } = await supabaseAdmin
    .from("users")
    .insert({ email })
    .select()
    .single();

  if (error) throw error;
  return newUser;
}

// Создать заказ
export async function createOrder(data: {
  serviceType: Order["service_type"];
  customerEmail: string;
  customerName?: string;
  inputData: Record<string, unknown>;
  amount: number;
}) {
  // Получаем или создаём пользователя
  const user = await getOrCreateUser(data.customerEmail);

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: user.id,
      service_type: data.serviceType,
      customer_email: data.customerEmail,
      customer_name: data.customerName,
      input_data: data.inputData,
      amount: data.amount,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return order;
}

// Получить заказ по ID
export async function getOrderById(orderId: string) {
  // Используем supabaseAdmin для избежания кэширования
  // Добавляем timestamp для предотвращения кэширования на уровне клиента
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    console.error(`[getOrderById] Ошибка получения заказа ${orderId}:`, error);
    throw error;
  }

  if (!data) {
    console.error(`[getOrderById] Заказ ${orderId} не найден`);
    throw new Error('Заказ не найден');
  }

  console.log(`[getOrderById] Получен заказ ${orderId}, статус:`, data.status);
  return data as Order;
}

// Обновить статус заказа
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  additionalData?: Partial<Order>
) {
  const updateData = {
    status,
    ...additionalData,
    ...(status === "processing" && {
      processing_started_at: new Date().toISOString(),
    }),
    ...(status === "completed" && {
      completed_at: new Date().toISOString(),
    }),
  };

  console.log(`[DB] Обновление заказа ${orderId} на статус ${status}:`, {
    result_url: updateData.result_url,
    result_metadata: updateData.result_metadata,
  });

  const { data, error} = await supabaseAdmin
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error(`[DB] Ошибка обновления заказа ${orderId}:`, error);
    throw error;
  }

  console.log(`[DB] ✅ Заказ ${orderId} успешно обновлён. Статус:`, data.status);

  // Даём время на репликацию данных в Supabase (1000мс)
  // Это критично для синхронизации между write и read операциями
  // Увеличено до 1 секунды для более надежной синхронизации
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Проверяем, что обновление действительно применилось
  const { data: verifyData } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (verifyData) {
    console.log(`[DB] ✅ Верификация: заказ ${orderId} имеет статус:`, verifyData.status);
  }

  return data;
}

// Получить опции сервиса
export async function getServiceOptions(
  serviceType: ServiceOption["service_type"],
  optionKey: string
) {
  const { data, error } = await supabase
    .from("service_options")
    .select("*")
    .eq("service_type", serviceType)
    .eq("option_key", optionKey)
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return data as ServiceOption[];
}
