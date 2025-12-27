import type { IPaymentProvider } from './types';
import { OnePlatProvider } from './providers/oneplat';

export type PaymentProviderType = 'oneplat' | 'freekassa';

export function getPaymentProvider(): IPaymentProvider {
  // For now, use 1plat as default
  // Later can be switched via env variable: process.env.PAYMENT_PROVIDER
  const providerType: PaymentProviderType = 'oneplat';

  switch (providerType) {
    case 'oneplat':
      return new OnePlatProvider();
    // case 'freekassa':
    //   return new FreeKassaProvider();
    default:
      throw new Error(`Unknown payment provider: ${providerType}`);
  }
}

// Price in rubles
export const SONG_PRICE = 50; // Test price: 50 rubles (will be changed to 590 after testing)
