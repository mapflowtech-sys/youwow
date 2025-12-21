import { supabase } from "./supabase";
import type { Order, ServiceOption } from "@/types/database";

// Создать или получить пользователя по email
export async function getOrCreateUser(email: string) {
  // Проверяем существует ли
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existing) return existing;

  // Создаём нового
  const { data: newUser, error } = await supabase
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

  const { data: order, error } = await supabase
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
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) throw error;
  return data as Order;
}

// Обновить статус заказа
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  additionalData?: Partial<Order>
) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      ...additionalData,
      ...(status === "processing" && {
        processing_started_at: new Date().toISOString(),
      }),
      ...(status === "completed" && {
        completed_at: new Date().toISOString(),
      }),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
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
