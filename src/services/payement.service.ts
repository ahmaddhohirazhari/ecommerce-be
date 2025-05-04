// payment.service.ts
import { snap } from '../config/midtrans';

interface SnapTransactionParams {
  order_id: string;
  gross_amount: number;
  customer_details: {
    first_name: string;
    email: string;
    phone?: string;
  };
  item_details: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export const paymentService = {
  async createSnapTransaction(params: SnapTransactionParams) {
    try {
      const parameter = {
        transaction_details: {
          order_id: params.order_id,
          gross_amount: params.gross_amount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: params.customer_details,
        item_details: params.item_details,
      };

      const transaction = await snap.createTransaction(parameter);

      return {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      };
    } catch (error) {
      console.error('Midtrans Error:', error);
      throw new Error('Failed to create payment transaction');
    }
  },

  async handleNotification(payload: any) {
    // Implementasi webhook handler
  },
};
