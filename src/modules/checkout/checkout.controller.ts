// src/controllers/checkout.controller.ts
import { Request, Response } from 'express';
import { checkoutService } from './checkout.service';
import { User } from '../../models';
import jwt from 'jsonwebtoken';

export const checkoutController = {
  async processCheckout(req: Request, res: Response) {
    const { userId, selectedCartItemIds, paymentMethod, shippingAddress } =
      req.body;

    // Validasi input dasar
    if (!userId || !selectedCartItemIds || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error:
          'Missing required fields: userId, selectedCartItemIds, paymentMethod',
      });
    }

    try {
      const order = await checkoutService.checkoutCartItems(
        userId,
        selectedCartItemIds,
        paymentMethod,
        shippingAddress
      );

      return res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      const statusCode = error.message.includes('stock') ? 409 : 400;
      return res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  },
  // Direct checkout (buy now)
  async directCheckout(req: Request, res: Response) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res
          .status(401)
          .json({ success: false, error: 'Authentication required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      const { productId, quantity, paymentMethod, shippingAddress } = req.body;
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found' });
      }

      // Add user to Request with proper typing
      (req as any).user = user;

      if (!productId || !quantity || !paymentMethod) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: productId, quantity, paymentMethod',
        });
      }

      const result = await checkoutService.directCheckout({
        userId: user.id,
        productId,
        quantity,
        paymentMethod,
        userData: {
          email: user.email,
          name: user.name,
          //   phone: user.phone,
        },
        shippingAddress,
      });

      return res.status(201).json({
        success: true,
        data: {
          order: result.order,
          payment: result.payment,
        },
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found')
        ? 404
        : error.message.includes('stock')
        ? 409
        : 400;

      return res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Common error handler
  handleError(error: Error) {
    // Add your custom error handling logic here
    console.error('Checkout error:', error);
    return {
      success: false,
      error: error.message,
    };
  },
};
