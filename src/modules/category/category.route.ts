const router = require('express').Router();
import { authenticate, authorize } from '../../middlewares/auth';
import { categoryControllers } from './category.controller';

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  categoryControllers.createCategory
);

router.put(
  '/:categoryId',
  authenticate,
  authorize(['admin']),
  categoryControllers.updateCategoryById
);

router.delete(
  '/:categoryId',
  authenticate,
  authorize(['admin']),
  categoryControllers.deleteCategoryById
);

router.get('/', categoryControllers.getAllCategories);
router.get('/:categoryId', categoryControllers.getCategoryById);
export const categoryRoutes = router;
