declare module 'midtrans-client' {
  interface MidtransConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CustomerDetails {
    first_name: string;
    last_name?: string;
    email: string;
    phone?: string;
    billing_address?: Address;
    shipping_address?: Address;
  }

  interface Address {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country_code?: string;
  }

  interface ItemDetail {
    id: string;
    price: number;
    quantity: number;
    name: string;
    category?: string;
    merchant_name?: string;
  }

  interface SnapTransactionResult {
    token: string;
    redirect_url: string;
  }

  interface NotificationPayload {
    transaction_status: string;
    order_id: string;
    gross_amount: string;
    [key: string]: any;
  }

  export class Snap {
    constructor(options: MidtransConfig);

    createTransaction(parameters: {
      transaction_details: TransactionDetails;
      customer_details?: CustomerDetails;
      item_details?: ItemDetail[];
      credit_card?: {
        secure?: boolean;
        save_card?: boolean;
        bank?: string;
      };
      expiry?: {
        start_time?: string;
        unit?: 'minute' | 'hour' | 'day';
        duration?: number;
      };
    }): Promise<SnapTransactionResult>;

    transaction: {
      notification(
        notification: NotificationPayload
      ): Promise<NotificationPayload>;
    };
  }
}
