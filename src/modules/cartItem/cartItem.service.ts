import CartItem from './cartItem.model';
import Product from '../product/product.model';

const addItemToCart = async (
  cartId: string,
  productId: string,
  quantity: number
) => {
  // Dapatkan harga produk terbaru
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');

  // Cek apakah item sudah ada di cart
  const existingItem = await CartItem.findOne({
    where: { cart_id: cartId, product_id: productId },
  });

  if (existingItem) {
    // Update quantity jika sudah ada
    existingItem.quantity += quantity;
    return await existingItem.save();
  }

  // Buat item baru
  return await CartItem.create({
    cart_id: cartId,
    product_id: productId,
    quantity,
    price: product.price,
  });
};

const updateCartItem = async (
  itemId: string,
  updateData: {
    quantity?: number;
  }
) => {
  const item = await CartItem.findByPk(itemId);
  if (!item) throw new Error('Cart item not found');

  if (updateData.quantity !== undefined) {
    if (updateData.quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    item.quantity = updateData.quantity;
  }

  return await item.save();
};

const removeCartItem = async (itemId: string) => {
  const deletedCount = await CartItem.destroy({
    where: { id: itemId },
  });
  return { deletedCount };
};

const getCartItems = async (cartId: string) => {
  return await CartItem.findAll({
    where: { cart_id: cartId },
    include: ['product'], // Include product details
  });
};

export const CartItemService = {
  addItemToCart,
  updateCartItem,
  removeCartItem,
  getCartItems,
};
