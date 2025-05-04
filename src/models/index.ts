import Cart from '../modules/cart/cart.model';
import CartItem from '../modules/cartItem/cartItem.model';
import Category from '../modules/category/category.model';
import Order from '../modules/order/order.model';
import OrderItem from '../modules/orderItem/orderItem.model';
import Product from '../modules/product/product.model';
import User from '../modules/user/user.model';

// User Associations
User.hasMany(Cart, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });

// Cart Associations
Cart.belongsTo(User, { foreignKey: 'user_id' });
Cart.hasMany(CartItem, {
  foreignKey: 'cart_id',
  as: 'cartItems', // Added explicit alias
});

// CartItem Associations
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
CartItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'cartProduct', // Changed to unique alias
});

// Product Associations
Product.belongsTo(Category, { foreignKey: 'category_id' });
Product.hasMany(CartItem, {
  foreignKey: 'product_id',
  as: 'inCarts', // Changed to unique alias
});

// Category Associations
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'categoryProducts', // Added explicit alias
});

// Order Associations
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'orderItems', // Changed to be more explicit
});

// OrderItem Associations
OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'parentOrder', // Added explicit alias
});
OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'orderProduct', // Changed to unique alias
});

export { Product, User, Cart, CartItem, Order, OrderItem, Category };
