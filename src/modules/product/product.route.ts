const router = require('express').Router();
import { authenticate, authorize } from '../../middlewares/auth';
import { uploadProductImage } from '../../middlewares/uploadFile';

import { ProductControllers } from './product.controller';

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  uploadProductImage,
  ProductControllers.createProduct
);
router.get('/', ProductControllers.getAllProducts);
router.get('/:productId', ProductControllers.getProductById);
router.put(
  '/:productId',
  authenticate,
  authorize(['admin']),
  ProductControllers.updateProductById
);
router.delete(
  '/:productId',
  authenticate,
  authorize(['admin']),
  ProductControllers.deleteProductById
);

export const productRoutes = router;
