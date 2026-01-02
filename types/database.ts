export type ServiceType = "tarot" | "santa" | "song";

export type OrderStatus =
  | "pending" // Создан, ждёт оплаты
  | "paid" // Оплачен
  | "processing" // Генерация в процессе
  | "completed" // Готово
  | "failed"; // Ошибка

export interface User {
  id: string;
  email: string;
  created_at: string;
  total_orders: number;
  last_order_at: string | null;
}

export interface Order {
  id: string;
  created_at: string;
  user_id: string | null;
  service_type: ServiceType;
  status: OrderStatus;
  customer_email: string;
  customer_name: string | null;
  input_data: Record<string, any>; // JSONB
  result_url: string | null;
  result_metadata: Record<string, any> | null;
  payment_id: string | null;
  payment_provider: string | null;
  amount: number;
  error_message: string | null;
  processing_started_at: string | null;
  completed_at: string | null;
  partner_id: string | null; // ID партнёра из таблицы partners
  partner_session_id: string | null; // Session ID из партнёрского cookie
}

export interface ServiceOption {
  id: string;
  service_type: ServiceType;
  option_key: string;
  option_value: string;
  display_label: string;
  description: string | null;
  price_modifier: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}
