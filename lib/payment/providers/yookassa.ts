import crypto from 'crypto';
import type {
  IPaymentProvider,
  CreatePaymentParams,
  PaymentResponse,
  PaymentWebhookData,
} from '../types';

const BASE_URL = 'https://api.yookassa.ru/v3';

interface YooKassaPayment {
  id: string;
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
  paid: boolean;
  amount: {
    value: string;
    currency: string;
  };
  confirmation?: {
    type: string;
    confirmation_url?: string;
    confirmation_token?: string;
  };
  created_at: string;
  description?: string;
  metadata?: Record<string, string>;
}

interface YooKassaWebhookEvent {
  type: 'notification';
  event: 'payment.succeeded' | 'payment.waiting_for_capture' | 'payment.canceled';
  object: YooKassaPayment;
}

export class YooKassaProvider implements IPaymentProvider {
  name = 'yookassa';
  private shopId: string;
  private secretKey: string;

  constructor() {
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;

    if (!shopId || !secretKey) {
      throw new Error('YooKassa credentials not configured');
    }

    this.shopId = shopId.trim();
    this.secretKey = secretKey.trim();
  }

  private getAuthHeader(): string {
    const credentials = `${this.shopId}:${this.secretKey}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
  }

  private generateIdempotenceKey(): string {
    return crypto.randomUUID();
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    const { orderId, userId, amount, email, useWidget } = params;

    try {
      console.log('[YooKassa] Creating payment with:', {
        shopId: this.shopId,
        orderId,
        amount,
        useWidget: useWidget ?? false,
      });

      const idempotenceKey = this.generateIdempotenceKey();

      // Prepare return URL - user will be redirected here after payment
      const returnUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderId}`
        : `http://localhost:3000/order/${orderId}`;

      const requestBody = {
        amount: {
          value: amount.toFixed(2),
          currency: 'RUB',
        },
        capture: true, // Auto-capture payment (one-stage payment)
        confirmation: useWidget
          ? {
              type: 'embedded', // Виджет ЮKassa
            }
          : {
              type: 'redirect',
              return_url: returnUrl,
            },
        description: `Заказ на генерацию песни №${orderId}`,
        metadata: {
          orderId: orderId,
          userId: userId,
          email: email || '',
        },
      };

      console.log('[YooKassa] Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader(),
          'Idempotence-Key': idempotenceKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[YooKassa] Payment creation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Failed to create payment: ${response.status} - ${errorText}`);
      }

      const data: YooKassaPayment = await response.json();
      console.log('[YooKassa] Payment creation response:', data);

      if (useWidget) {
        // For widget, return confirmation_token
        if (!data.confirmation?.confirmation_token) {
          throw new Error('No confirmation token in response');
        }

        return {
          success: true,
          guid: orderId,
          paymentId: data.id,
          paymentUrl: '', // No URL for widget
          confirmationToken: data.confirmation.confirmation_token,
          paymentData: {
            method: 'widget',
            note: data.metadata || {},
            status: data.status === 'pending' ? 0 : data.status === 'succeeded' ? 1 : 2,
          },
        };
      } else {
        // For redirect, return confirmation_url
        if (!data.confirmation?.confirmation_url) {
          throw new Error('No confirmation URL in response');
        }

        return {
          success: true,
          guid: orderId,
          paymentId: data.id,
          paymentUrl: data.confirmation.confirmation_url,
          paymentData: {
            method: 'redirect',
            note: data.metadata || {},
            status: data.status === 'pending' ? 0 : data.status === 'succeeded' ? 1 : 2,
          },
        };
      }
    } catch (error) {
      console.error('[YooKassa] Error creating payment:', error);
      throw error;
    }
  }

  async verifyWebhook(data: unknown): Promise<PaymentWebhookData> {
    const webhookData = data as YooKassaWebhookEvent;

    console.log('[YooKassa] Webhook received:', webhookData);

    if (webhookData.type !== 'notification') {
      throw new Error('Invalid webhook type');
    }

    const payment = webhookData.object;

    // Map YooKassa status to our internal status
    let status = 0;
    if (payment.status === 'succeeded') {
      status = 1; // paid
    } else if (payment.status === 'canceled') {
      status = 3; // canceled
    } else if (payment.status === 'waiting_for_capture') {
      status = 2; // waiting for capture
    }

    return {
      orderId: payment.metadata?.orderId || payment.id,
      paymentId: payment.id,
      status: status,
      amount: parseFloat(payment.amount.value),
      amountToShop: parseFloat(payment.amount.value), // YooKassa deducts commission automatically
      userId: payment.metadata?.userId || '',
    };
  }

  async getPaymentStatus(paymentId: string): Promise<{ status: number; paid: boolean }> {
    try {
      console.log('[YooKassa] Getting payment status for:', paymentId);

      const response = await fetch(`${BASE_URL}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[YooKassa] Failed to get payment status:', {
          status: response.status,
          error: errorText,
        });
        throw new Error(`Failed to get payment status: ${response.status}`);
      }

      const data: YooKassaPayment = await response.json();
      console.log('[YooKassa] Payment status response:', data);

      const paid = data.status === 'succeeded';
      let status = 0;

      if (data.status === 'succeeded') {
        status = 1;
      } else if (data.status === 'waiting_for_capture') {
        status = 2;
      } else if (data.status === 'canceled') {
        status = 3;
      }

      return { status, paid };
    } catch (error) {
      console.error('[YooKassa] Error getting payment status:', error);
      throw error;
    }
  }
}
