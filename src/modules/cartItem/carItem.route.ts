import { Router } from 'express';
import { CartItemController } from './cartItem.controller';

const router = Router();

// POST /carts/:cartId/items - Add item to cart
router.post('/:cartId/items', CartItemController.addItem);

// GET /carts/:cartId/items - Get all cart items
router.get('/:cartId/items', CartItemController.getItems);

// PUT /items/:itemId - Update cart item
router.put('/items/:itemId', CartItemController.updateItem);

// DELETE /items/:itemId - Remove item from cart
router.delete('/items/:itemId', CartItemController.removeItem);

export const cartItemRoutes = router;
