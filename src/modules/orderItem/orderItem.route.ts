import { OrderItemController } from './orderItem.controller';
const router = require('express').Router();

// Create
router.post('/', OrderItemController.createOrderItem);

// Read
router.get('/order/:orderId', OrderItemController.getOrderItems);

// Update
router.put('/:itemId', OrderItemController.updateOrderItem);

// Delete
router.delete('/:itemId', OrderItemController.deleteOrderItem);

export const orderItemRoutes = router;
