import type { IPaymentProvider } from './types';
import { OnePlatProvider } from './providers/oneplat';
import { YooKassaProvider } from './providers/yookassa';

export type PaymentProviderType = 'oneplat' | 'yookassa' | 'freekassa';

export function getPaymentProvider(): IPaymentProvider {
  // Switch payment provider via env variable
  const providerType = (process.env.PAYMENT_PROVIDER || 'yookassa') as PaymentProviderType;

  switch (providerType) {
    case 'yookassa':
      return new YooKassaProvider();
    case 'oneplat':
      return new OnePlatProvider();
    // case 'freekassa':
    //   return new FreeKassaProvider();
    default:
      throw new Error(`Unknown payment provider: ${providerType}`);
  }
}

// Price in rubles
export const SONG_PRICE = 590; // Production price: 590 rubles
