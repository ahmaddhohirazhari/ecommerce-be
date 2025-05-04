import Cart from './cart.model';
import { ICartAttributes } from './cart.interface';
import Product from '../product/product.model';
import CartItem from '../cartItem/cartItem.model';

const createCart = async (cartData: { cartData: ICartAttributes }) => {
  const cart = await Cart.create(cartData);
  return cart;
};

const getCartByUser = async (userId: string) => {
  return await Cart.findOne({
    where: { user_id: userId },
    include: ['items'],
  });
};

const addItemToCart = async (
  userId: string,
  itemData: {
    product_id: string;
    quantity: number;
    price: number;
  }
) => {
  // First verify the product exists
  const product = await Product.findOne({ where: { id: itemData.product_id } });
  if (!product) {
    throw new Error('Product not found');
  }

  const cart = await Cart.findOne({ where: { user_id: userId } });
  if (!cart) throw new Error('Cart not found');

  // Make sure to use the correct field names that match your model
  const cartItem = await CartItem.create({
    cart_id: cart.id as string,
    product_id: itemData.product_id,
    quantity: itemData.quantity,
    price: itemData.price,
  });

  return cartItem;
};

const updateCartItem = async (
  userId: string,
  itemId: string,
  updateData: {
    quantity?: number;
  }
) => {
  // 1. Find the user's cart
  const cart = await Cart.findOne({ where: { user_id: userId } });
  if (!cart) throw new Error('Cart not found');

  // 2. Find and update the cart item
  const [affectedCount] = await CartItem.update(updateData, {
    where: {
      id: itemId,
      cart_id: cart.id,
    },
  });

  if (affectedCount === 0) {
    throw new Error('Cart item not found or not updated');
  }

  // 3. Return the updated item
  const updatedItem = await CartItem.findOne({
    where: { id: itemId },
  });

  return updatedItem;
};

const removeCartItem = async (userId: string, itemId: string) => {
  const cart = await Cart.findOne({ where: { user_id: userId } });
  if (!cart) throw new Error('Cart not found');

  const deletedCount = await CartItem.destroy({
    where: {
      id: itemId,
      cart_id: cart.id,
    },
  });

  if (deletedCount === 0) {
    throw new Error('Cart item not found or already removed');
  }

  return { success: true, deletedCount };
};
const clearCart = async (userId: string) => {
  const cart = await Cart.findOne({ where: { user_id: userId } });
  if (!cart) throw new Error('Cart not found');

  const deletedCount = await CartItem.destroy({
    where: { cart_id: cart.id },
  });

  return {
    success: true,
    deletedCount,
    message: `Successfully cleared ${deletedCount} items from cart`,
  };
};

export const CartService = {
  createCart,
  getCartByUser,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
