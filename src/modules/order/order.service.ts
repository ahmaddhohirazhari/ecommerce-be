import { Transaction } from 'sequelize';
import {
  IOrderAttributes,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from './order.interface';

import { Order, OrderItem, Product, User } from '../../models';
import sequelize from '../../config/database';
import { notificationService } from '../../services/notification.service';

interface CreateOrderParams {
  user_id: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  payment_method: string;
}

export const createOrderWithItems = async (
  orderParams: CreateOrderParams,
  transaction?: Transaction
) => {
  const { user_id, items, payment_method } = orderParams;
  let createdTransaction = false;

  try {
    // Validate payment method
    const validPaymentMethods: PaymentMethod[] = [
      'credit_card',
      'bank_transfer',
      'e_wallet',
      'cod',
    ];

    if (!validPaymentMethods.includes(payment_method as PaymentMethod)) {
      throw new Error(`Invalid payment method: ${payment_method}`);
    }

    // Start transaction if not provided
    if (!transaction) {
      transaction = await sequelize.transaction();
      createdTransaction = true;
    }

    // Calculate total price
    const total_price = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create the order
    const order = await Order.create(
      {
        user_id,
        total_price,
        payment_method: payment_method as PaymentMethod, // Type assertion
        status: 'pending',
        payment_status: 'unpaid',
      },
      { transaction }
    );

    // Create order items
    const orderItems = await OrderItem.bulkCreate(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
      { transaction }
    );

    // Commit if we created the transaction
    if (createdTransaction) {
      await transaction.commit();
    }

    return {
      order: order.get({ plain: true }),
      items: orderItems.map((item) => item.get({ plain: true })),
    };
  } catch (error) {
    // Rollback if we created the transaction
    if (createdTransaction && transaction) {
      await transaction.rollback();
    }
    throw error;
  }
};

export const createOrder = async (
  orderData: IOrderAttributes,
  transaction?: Transaction
) => {
  return await Order.create(orderData, { transaction });
};

const getOrderById = async (orderId: string) => {
  return await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Product,
            as: 'orderProduct',
          },
        ],
      },
    ],
  });
};

const getUserOrders = async (userId: string) => {
  return await Order.findAll({
    where: { user_id: userId },
    include: ['orderItems'],
    order: [['createdAt', 'DESC']],
  });
};

const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: IOrderAttributes['payment_status']
) => {
  const order = await Order.findByPk(orderId);
  if (!order) return null;

  return await order.update({ payment_status: paymentStatus });
};

const cancelOrder = async (orderId: string) => {
  const order = await Order.findByPk(orderId);
  if (!order) return null;

  // Only allow cancellation if order is still pending
  if (order.status !== 'pending') {
    throw new Error('Order can only be cancelled when in pending status');
  }

  return await order.update({ status: 'cancelled' });
};

interface UpdateOrderStatusParams {
  orderId: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  snapToken?: string;
  snapRedirectUrl?: string;
}

interface PaymentUpdateParams {
  orderId: string;
  transactionStatus: string;
  settlementTime?: string;
}

interface PaymentUpdateParams {
  orderId: string;
  transactionStatus: string;
  settlementTime?: string;
}

interface PaymentUpdateParams {
  orderId: string;
  transactionStatus: string;
  settlementTime?: string;
}

export const handlePaymentStatusUpdate = async (
  params: PaymentUpdateParams
) => {
  const { orderId, transactionStatus, settlementTime } = params;

  // Validasi input
  if (!orderId || !transactionStatus) {
    throw new Error('Order ID and transaction status are required');
  }

  // 1. Dapatkan order terlebih dahulu tanpa include user
  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  // 2. Dapatkan user secara terpisah
  const user = await User.findByPk(order.user_id);
  if (!user) {
    throw new Error('User not found');
  }

  const previousPaymentStatus = order.payment_status;
  let newOrderStatus: OrderStatus = order.status;
  let newPaymentStatus: PaymentStatus;

  // Mapping status Midtrans ke status internal
  const statusMapping: Record<string, PaymentStatus> = {
    settlement: 'paid',
    pending: 'unpaid',
    expire: 'failed',
    cancel: 'failed',
    deny: 'failed',
    refund: 'refunded',
  };

  // Validasi status
  const mappedStatus = statusMapping[transactionStatus.toLowerCase()];
  if (!mappedStatus) {
    throw new Error(`Invalid transaction status: ${transactionStatus}`);
  }
  newPaymentStatus = mappedStatus;

  // Update status order
  if (newPaymentStatus === 'paid') {
    newOrderStatus = 'processing';
  } else if (newPaymentStatus === 'failed') {
    newOrderStatus = 'cancelled';
  }

  // Persiapkan updates
  const updates: Partial<Order> = {};
  if (newPaymentStatus !== previousPaymentStatus) {
    updates.payment_status = newPaymentStatus;
  }
  if (newOrderStatus !== order.status) {
    updates.status = newOrderStatus;
  }
  // if (settlementTime) {
  //   updates.updatedAt = new Date(settlementTime);
  // }

  // Lakukan update jika ada perubahan
  if (Object.keys(updates).length > 0) {
    await order.update(updates);
  }

  // Kirim notifikasi
  if (newPaymentStatus !== previousPaymentStatus) {
    const paymentDate = settlementTime ? new Date(settlementTime) : new Date();

    const notificationData = {
      orderId: order.id,
      customerName: user.name || 'Customer',
      amount: order.total_price,
      paymentMethod: order.payment_method,
      transactionDate: paymentDate.toISOString(),
      paymentStatus: newPaymentStatus,
    };

    try {
      await notificationService.sendPaymentNotification(
        user.email,
        notificationData
      );

      if (newOrderStatus !== order.status) {
        await notificationService.sendOrderStatusUpdate({
          email: user.email,
          orderId: order.id,
          previousStatus: order.status,
          newStatus: newOrderStatus,
        });
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  return order;
};

export const getOrderDetails = async (orderId: string) => {
  return Order.findByPk(orderId, {
    include: ['items'], // Menggunakan alias yang sudah didefinisikan di model
  });
};

export const OrderService = {
  createOrder,
  getOrderById,
  getUserOrders,

  updatePaymentStatus,
  cancelOrder,
  createOrderWithItems,
  handlePaymentStatusUpdate,
};
