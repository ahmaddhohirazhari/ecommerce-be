import { Request, Response } from 'express';
import { OrderService } from './order.service';

interface CreateOrderRequest {
  user_id: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  payment_method: string;
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData: CreateOrderRequest = req.body;

    // Validate required fields
    if (!orderData.user_id || !orderData.items || !orderData.payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, items, or payment_method',
      });
    }

    // Validate items array
    if (!Array.isArray(orderData.items)) {
      return res.status(400).json({
        success: false,
        message: 'Items must be an array',
      });
    }

    // Create order with items
    const result = await OrderService.createOrderWithItems(orderData);

    res.status(201).json({
      success: true,
      message: 'Order created successfully with items',
      data: result,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await OrderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch order',
    });
  }
};

export const getUserOrderHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await OrderService.getUserOrders(userId);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch order history',
    });
  }
};

export const handleMidtransWebhook = async (req: Request, res: Response) => {
  try {
    const { order_id, transaction_status, settlement_time } = req.body;

    // Validasi payload webhook
    if (!order_id || !transaction_status) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook payload',
      });
    }

    // Update order berdasarkan status pembayaran dari Midtrans
    const updatedOrder = await OrderService.handlePaymentStatusUpdate({
      orderId: order_id,
      transactionStatus: transaction_status,
      settlementTime: settlement_time,
    });

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      data: updatedOrder,
    });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    const statusCode = error.message === 'Order not found' ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to process webhook',
    });
  }
};

export const cancelUserOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await OrderService.cancelOrder(orderId);

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or cannot be cancelled',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to cancel order',
    });
  }
};

export const handlePaymentWebhook = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log('paylod: ', payload);

    // Validasi signature Midtrans (jika diperlukan)
    // ...

    // Validasi payload penting
    if (!payload?.order_id || !payload?.transaction_status) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid webhook payload: Missing order_id or transaction_status',
      });
    }

    // Verifikasi payload dari Midtrans
    if (payload?.fraud_status === 'deny') {
      return res.status(400).json({
        success: false,
        error: 'Payment denied by fraud detection',
      });
    }

    // Proses webhook
    const updatedOrder = await OrderService.handlePaymentStatusUpdate({
      orderId: payload.order_id,
      transactionStatus: payload.transaction_status,
      settlementTime: payload.settlement_time || payload.transaction_time,
    });

    // Response untuk Midtrans
    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        orderId: updatedOrder.id,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.payment_status,
      },
    });
  } catch (error: any) {
    console.error('[Payment Webhook Error]:', error);

    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('Invalid')
      ? 400
      : 500;

    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to process payment webhook',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};
export const OrderController = {
  createOrder,
  getOrder,
  getUserOrderHistory,
  handleMidtransWebhook,
  handlePaymentWebhook,
  cancelUserOrder,
};
