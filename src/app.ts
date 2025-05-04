import express from 'express';
import cors from 'cors';
import { authRoutes } from './modules/auth/auth.route';
import { userRoutes } from './modules/user/user.route';
import { productRoutes } from './modules/product/product.route';
import { categoryRoutes } from './modules/category/category.route';
import { cartRoutes } from './modules/cart/cart.route';
import { cartItemRoutes } from './modules/cartItem/carItem.route';
import { orderRoutes } from './modules/order/order.route';
import { orderItemRoutes } from './modules/orderItem/orderItem.route';
import { checkoutRoutes } from './modules/checkout/checkout.route';

const app = express();

// PARSERS
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/checkout', checkoutRoutes);

app.get('/', (req, res) => {
  res.send('E-Commerce TS is running');
});

export default app;
