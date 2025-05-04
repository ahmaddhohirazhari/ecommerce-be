// src/types/notification.types.ts
export interface CheckoutNotificationData {
  orderId: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: string;
}

export interface PaymentNotificationData {
  orderId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
}
