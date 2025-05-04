import { OrderController } from './order.controller';
const router = require('express').Router();

// Create
router.post('/', OrderController.createOrder);

// Read
router.get('/:orderId', OrderController.getOrder);
router.get('/user/:userId', OrderController.getUserOrderHistory);

// Update
// router.patch('/:orderId/status', OrderController.updateOrder);
router.post('/webhook', OrderController.handlePaymentWebhook);

// Cancel
router.post('/:orderId/cancel', OrderController.cancelUserOrder);

export const orderRoutes = router;
