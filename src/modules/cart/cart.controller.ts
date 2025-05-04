import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { ICartAttributes } from './cart.interface';

export const createCart = async (req: Request, res: Response) => {
  try {
    const cartData = req.body;
    console.log('data:', cartData);
    const cart = await CartService.createCart(cartData);

    res.status(201).json({
      success: true,
      message: 'Cart created successfully',
      data: cart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create cart',
    });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const cart = await CartService.getCartByUser(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch cart',
    });
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const itemData = req.body;

    const cartItem = await CartService.addItemToCart(userId, itemData);

    res.status(201).json({
      status: true,
      message: 'Item added to cart successfully',
      data: cartItem,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || 'Failed to add item to cart',
    });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    const updateData = req.body;

    const result = await CartService.updateCartItem(userId, itemId, updateData);

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update cart item',
    });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const itemId = req.params.itemId;

    const result = await CartService.removeCartItem(userId, itemId);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove item from cart',
    });
  }
};

export const clear = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const result = await CartService.clearCart(userId);

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to clear cart',
    });
  }
};

export const CartController = {
  createCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  clear,
};
