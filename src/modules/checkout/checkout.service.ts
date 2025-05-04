// checkout.service.ts
import sequelize from '../../config/database';
import { CartItem, Order, OrderItem, Product, User } from '../../models';
import { notificationService } from '../../services/notification.service';
import { paymentService } from '../../services/payement.service';

import { PaymentMethod } from '../order/order.interface';

interface CheckoutResult {
  order: Order;
  payment?: {
    token: string;
    redirect_url: string;
  };
}

interface DirectCheckoutParams {
  userId: string;
  productId: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  userData: Pick<User, 'email' | 'name'>;
  shippingAddress?: string;
}

interface CheckoutResult {
  order: Order;
  payment?: {
    token: string;
    redirect_url: string;
  };
}

export const checkoutService = {
  async checkoutCartItems(
    userId: string,
    selectedCartItemIds: string[],
    paymentMethod: PaymentMethod,
    userData: Pick<User, 'email' | 'name'> // Added phone to match notification requirements
  ): Promise<CheckoutResult> {
    // Validasi input
    if (
      !Array.isArray(selectedCartItemIds) ||
      selectedCartItemIds.length === 0
    ) {
      throw new Error('Invalid cart items selection');
    }

    const transaction = await sequelize.transaction();

    try {
      // 1. Get and validate cart items
      const cartItems = await CartItem.findAll({
        where: { id: selectedCartItemIds, user_id: userId },
        include: [
          {
            model: Product,
            as: 'product',
            required: true,
          },
        ],
        transaction,
      });

      // 2. Validate all items exist
      if (cartItems.length !== selectedCartItemIds.length) {
        const missingIds = selectedCartItemIds.filter(
          (id) => !cartItems.some((item) => item.id === id)
        );
        throw new Error(`Items not found in cart: ${missingIds.join(', ')}`);
      }

      // 3. Validate stock
      const outOfStockItems = cartItems.filter((item) => {
        if (!item.product) {
          throw new Error(`Product data missing for item ${item.id}`);
        }
        return item.quantity > item.product.stock;
      });

      if (outOfStockItems.length > 0) {
        throw new Error(
          `Insufficient stock for: ${outOfStockItems
            .map((item) => item.product?.name ?? 'Unknown')
            .join(', ')}`
        );
      }

      // 4. Calculate total
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );

      // 5. Create order
      const newOrder = await Order.create(
        {
          user_id: userId,
          total_price: totalPrice,
          payment_method: paymentMethod,
          status: 'pending',
          payment_status: 'unpaid',
        },
        { transaction }
      );

      // 6. Create order items and update stock
      await Promise.all([
        ...cartItems.map((item) =>
          OrderItem.create(
            {
              order_id: newOrder.id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
            },
            { transaction }
          )
        ),
        ...cartItems.map((item) =>
          Product.decrement('stock', {
            by: item.quantity,
            where: { id: item.product_id },
            transaction,
          })
        ),
      ]);

      // 7. Clear cart
      await CartItem.destroy({
        where: { id: selectedCartItemIds },
        transaction,
      });

      // 8. Send checkout notification - Updated to match CheckoutNotificationData interface
      await notificationService.sendCheckoutNotification(userData.email, {
        orderId: newOrder.id, // Changed from 'id' to 'orderId'
        customerName: userData.name, // Added to match interface
        totalAmount: newOrder.total_price, // Changed from 'total_price' to 'totalAmount'
        paymentMethod: paymentMethod, // Added to match interface
        items: cartItems.map((item) => ({
          name: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: 'Will be confirmed', // Default value, can be updated
      });

      // 9. Process payment (if not COD)
      let paymentResult;
      if (paymentMethod !== 'cod') {
        paymentResult = await paymentService.createSnapTransaction({
          order_id: newOrder.id,
          gross_amount: totalPrice,
          customer_details: {
            first_name: userData.name,
            email: userData.email,
            // phone: userData.phone,
          },
          item_details: cartItems.map((item) => ({
            id: item.product_id,
            name: item.product?.name || 'Unknown Product',
            price: item.price,
            quantity: item.quantity,
          })),
        });

        await newOrder.update(
          {
            snap_token: paymentResult.token,
            snap_redirect_url: paymentResult.redirect_url,
          },
          { transaction }
        );
      }

      await transaction.commit();

      return {
        order: newOrder,
        payment: paymentResult,
      };
    } catch (error) {
      await transaction.rollback();

      if (error instanceof Error) {
        throw new Error(`Checkout failed: ${error.message}`);
      }
      throw new Error('Checkout failed due to unknown error');
    }
  },
  async directCheckout(params: DirectCheckoutParams): Promise<CheckoutResult> {
    const transaction = await sequelize.transaction();

    try {
      // 1. Validate product and stock
      const product = await Product.findByPk(params.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock < params.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      // 2. Calculate total
      const totalPrice = product.price * params.quantity;

      // 3. Create order
      const newOrder = await Order.create(
        {
          user_id: params.userId,
          total_price: totalPrice,
          payment_method: params.paymentMethod,
          status: 'pending',
          payment_status: 'unpaid',
        },
        { transaction }
      );

      // 4. Create order item and update stock
      await Promise.all([
        OrderItem.create(
          {
            order_id: newOrder.id,
            product_id: params.productId,
            quantity: params.quantity,
            price: product.price,
          },
          { transaction }
        ),
        Product.decrement('stock', {
          by: params.quantity,
          where: { id: params.productId },
          transaction,
        }),
      ]);

      // 5. Send checkout notification
      await notificationService.sendCheckoutNotification(
        params.userData.email,
        {
          orderId: newOrder.id,
          customerName: params.userData.name,
          totalAmount: newOrder.total_price,
          paymentMethod: params.paymentMethod,
          items: [
            {
              name: product.name,
              quantity: params.quantity,
              price: product.price,
            },
          ],
          shippingAddress: params.shippingAddress || 'Will be confirmed',
        }
      );

      // 6. Process payment (if not COD)
      let paymentResult;
      if (params.paymentMethod !== 'cod') {
        paymentResult = await paymentService.createSnapTransaction({
          order_id: newOrder.id,
          gross_amount: totalPrice,
          customer_details: {
            first_name: params.userData.name,
            email: params.userData.email,
            // phone: params.userData.phone,
          },
          item_details: [
            {
              id: params.productId,
              name: product.name,
              price: product.price,
              quantity: params.quantity,
            },
          ],
        });

        await newOrder.update(
          {
            snap_token: paymentResult.token,
            snap_redirect_url: paymentResult.redirect_url,
          },
          { transaction }
        );
      }

      await transaction.commit();

      return {
        order: newOrder,
        payment: paymentResult,
      };
    } catch (error) {
      await transaction.rollback();

      if (error instanceof Error) {
        throw new Error(`Direct checkout failed: ${error.message}`);
      }
      throw new Error('Direct checkout failed due to unknown error');
    }
  },
};
