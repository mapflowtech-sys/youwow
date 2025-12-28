import crypto from 'crypto';
import type {
  IPaymentProvider,
  CreatePaymentParams,
  PaymentResponse,
  PaymentWebhookData,
  PaymentMethod
} from '../types';

const BASE_URL = 'https://1plat.cash';

export class OnePlatProvider implements IPaymentProvider {
  name = '1plat';
  private shopId: string;
  private secret: string;

  constructor() {
    const shopId = process.env.ONEPLAT_SHOP_ID;
    const secret = process.env.ONEPLAT_SECRET;

    if (!shopId || !secret) {
      throw new Error('1plat credentials not configured');
    }

    // Trim whitespace and control characters (like \r\n) from credentials
    this.shopId = shopId.trim();
    this.secret = secret.trim();
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    const { orderId, userId, amount, email, method = 'card' } = params;

    try {
      // Convert userId (UUID string) to a numeric ID for 1plat API
      // 1plat requires numeric user_id, so we generate a hash from the userId
      const numericUserId = Math.abs(
        userId.split('').reduce((acc, char) => {
          return acc * 31 + char.charCodeAt(0);
        }, 0)
      ) % 2147483647; // Keep within 32-bit integer range

      // DEBUG: Log what we're sending
      console.log('[1plat] Creating payment with:', {
        shopId: this.shopId,
        secretLength: this.secret?.length,
        secretPreview: this.secret ? `${this.secret.slice(0, 5)}...` : 'undefined',
        orderId,
        amount,
        method,
      });

      const requestBody = {
        merchant_order_id: orderId,
        user_id: numericUserId,
        amount: amount,
        email: email || `${userId}@temp.com`,
        method: method as PaymentMethod,
      };

      console.log('[1plat] Request body:', requestBody);

      const response = await fetch(`${BASE_URL}/api/merchant/order/create/by-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-shop': String(this.shopId),
          'x-secret': String(this.secret),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[1plat] Payment creation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Failed to create payment: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('[1plat] Payment creation response:', data);

      if (!data.success) {
        console.error('[1plat] API returned success=false:', data);
        throw new Error(`Payment creation failed: ${JSON.stringify(data)}`);
      }

      return {
        success: true,
        guid: data.guid,
        paymentId: data.payment.id,
        paymentUrl: data.url,
        paymentData: {
          method: data.payment.method_group,
          note: data.payment.note,
          status: data.payment.status,
          expired: data.payment.expired,
        },
      };
    } catch (error) {
      console.error('[1plat] Error creating payment:', error);
      throw error;
    }
  }

  async verifyWebhook(data: unknown): Promise<PaymentWebhookData> {
    const body = data as Record<string, unknown>;

    const {
      signature,
      signature_v2,
      payment_id,
      guid,
      merchant_id,
      user_id,
      status,
      amount,
      amount_to_shop,
    } = body;

    // Verify merchant ID
    if (merchant_id !== this.shopId) {
      throw new Error('Invalid merchant ID');
    }

    // Verify signature (using signature_v2 - MD5)
    const payloadForSignature = { ...body };
    delete payloadForSignature.signature;
    delete payloadForSignature.signature_v2;

    // signature (HMAC SHA256)
    const calculatedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(JSON.stringify(payloadForSignature))
      .digest('hex');

    // signature_v2 (MD5)
    const calculatedSignatureV2 = crypto
      .createHash('md5')
      .update(`${merchant_id}${amount}${this.shopId}${this.secret}`)
      .digest('hex');

    const isSignatureValid =
      signature === calculatedSignature ||
      signature_v2 === calculatedSignatureV2;

    if (!isSignatureValid) {
      console.error('[1plat] Signature verification failed:', {
        received_signature: signature,
        calculated_signature: calculatedSignature,
        received_signature_v2: signature_v2,
        calculated_signature_v2: calculatedSignatureV2,
      });
      throw new Error('Invalid signature');
    }

    return {
      orderId: guid as string,
      paymentId: String(payment_id),
      status: status as number,
      amount: amount as number,
      amountToShop: amount_to_shop as number,
      userId: String(user_id),
      signature: signature as string,
    };
  }

  async getPaymentStatus(guid: string): Promise<{ status: number; paid: boolean }> {
    try {
      const response = await fetch(`${BASE_URL}/api/merchant/order/info/${guid}/by-api`, {
        method: 'GET',
        headers: {
          'x-shop': this.shopId,
          'x-secret': this.secret,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to get payment status');
      }

      const status = data.payment.status;
      const paid = status === 1 || status === 2; // 1 = paid, 2 = confirmed

      return { status, paid };
    } catch (error) {
      console.error('[1plat] Error getting payment status:', error);
      throw error;
    }
  }
}
