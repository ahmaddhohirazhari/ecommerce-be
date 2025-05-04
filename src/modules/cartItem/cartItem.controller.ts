import { Request, Response } from 'express';
import { CartItemService } from './cartItem.service';

export const addItem = async (req: Request, res: Response) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    const cartItem = await CartItemService.addItemToCart(
      cartId,
      productId,
      quantity
    );

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cartItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add item to cart',
    });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const updatedItem = await CartItemService.updateCartItem(itemId, {
      quantity,
    });

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update cart item',
    });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const result = await CartItemService.removeCartItem(itemId);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to remove item from cart',
    });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const { cartId } = req.params;
    const items = await CartItemService.getCartItems(cartId);

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to get cart items',
    });
  }
};

export const CartItemController = {
  addItem,
  updateItem,
  removeItem,
  getItems,
};
