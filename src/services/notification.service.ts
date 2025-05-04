import { sendEmail } from '../config/mailer';
import { OrderStatus, PaymentStatus } from '../modules/order/order.interface';
import { loadTemplate } from '../utils/templates-loader';

// Type definitions
interface OrderStatusNotification {
  email: string;
  orderId: string;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
}

interface PaymentNotification {
  email: string;
  orderId: string;
  paymentStatus: PaymentStatus;
  amount: number;
  paymentMethod: string;
}

interface CheckoutNotificationData {
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

interface PaymentNotificationData {
  orderId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
  paymentStatus: string;
}

export const notificationService = {
  async sendCheckoutNotification(
    email: string,
    data: CheckoutNotificationData
  ) {
    const html = loadTemplate('checkout-email', {
      orderId: data.orderId,
      customerName: data.customerName,
      totalAmount: data.totalAmount.toLocaleString(),
      paymentMethod: data.paymentMethod,
      items: data.items
        .map(
          (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.price.toLocaleString()}</td>
        </tr>
      `
        )
        .join(''),
      shippingAddress: data.shippingAddress || 'Will be confirmed',
      orderDate: new Date().toLocaleDateString(),
    });

    await sendEmail({
      to: email,
      subject: `Order Confirmation #${data.orderId}`,
      html,
    });
  },

  async sendPaymentNotification(email: string, data: PaymentNotificationData) {
    const html = loadTemplate('payment-success', {
      orderId: data.orderId,
      customerName: data.customerName,
      amount: data.amount.toLocaleString(),
      paymentMethod: data.paymentMethod,
      transactionDate: data.transactionDate,
    });

    await sendEmail({
      to: email,
      subject: `Payment Confirmation #${data.orderId}`,
      html,
    });
  },

  async sendOrderStatusUpdate(data: OrderStatusNotification) {
    const statusMessages: Record<OrderStatus, string> = {
      pending: 'is pending confirmation',
      processing: 'is being processed',
      shipped: 'has been shipped',
      delivered: 'has been delivered',
      cancelled: 'has been cancelled',
    };

    const html = loadTemplate('order-status-update', {
      orderId: data.orderId,
      previousStatus: statusMessages[data.previousStatus],
      newStatus: statusMessages[data.newStatus],
      updateDate: new Date().toLocaleDateString(),
    });

    await sendEmail({
      to: data.email,
      subject: `Order Status Update #${data.orderId}`,
      html,
    });
  },
};
