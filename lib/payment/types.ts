// Payment provider types

export type PaymentMethod = 'card' | 'sbp' | 'qr' | 'crypto';

export interface CreatePaymentParams {
  orderId: string;
  userId: string;
  amount: number;
  email: string;
  method?: PaymentMethod;
  currency?: string;
  useWidget?: boolean; // Use ЮKassa widget instead of redirect
}

export interface PaymentResponse {
  success: boolean;
  guid: string;
  paymentId: string | number;
  paymentUrl: string;
  confirmationToken?: string; // For ЮKassa widget
  paymentData?: {
    method: string;
    note: Record<string, unknown>;
    status: number;
    expired?: string;
  };
}

export interface PaymentWebhookData {
  orderId: string;
  paymentId: string;
  status: number;
  amount: number;
  amountToShop: number;
  userId: string;
  signature?: string;
}

export interface IPaymentProvider {
  name: string;
  createPayment(params: CreatePaymentParams): Promise<PaymentResponse>;
  verifyWebhook(data: unknown): Promise<PaymentWebhookData>;
  getPaymentStatus(guid: string): Promise<{ status: number; paid: boolean }>;
}
