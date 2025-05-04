import { CartController } from './cart.controller';

const router = require('express').Router();

router.post('/', CartController.createCart);
router.get('/:userId', CartController.getCart);
router.post('/:userId/items', CartController.addItem);
router.put('/:userId/items/:itemId', CartController.updateItem);
router.delete('/:userId/items/:itemId', CartController.removeItem);
router.delete('/:userId/clear', CartController.clear);

export const cartRoutes = router;
