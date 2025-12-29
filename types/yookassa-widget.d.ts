// Type definitions for YooKassa Checkout Widget
// Documentation: https://yookassa.ru/developers/payment-acceptance/integration-scenarios/widget

declare global {
  interface Window {
    YooMoneyCheckoutWidget?: new (config: YooKassaWidgetConfig) => YooKassaWidget;
  }
}

export interface YooKassaWidgetConfig {
  confirmation_token: string;
  return_url?: string;
  customization?: {
    modal?: boolean;
    colors?: {
      control_primary?: string;
      control_primary_content?: string;
      background?: string;
      text?: string;
      border?: string;
      control_secondary?: string;
    };
  };
  error_callback?: (error: YooKassaError) => void;
}

export interface YooKassaWidget {
  render(containerId?: string): Promise<void>;
  destroy(): void;
  on(event: 'success' | 'fail' | 'complete' | 'modal_close', callback: () => void): void;
}

export interface YooKassaError {
  code: string;
  description: string;
}

export {};
