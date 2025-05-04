// src/routes/checkout.route.ts

import { authenticate } from '../../middlewares/auth';
import { checkoutController } from './checkout.controller';

const router = require('express').Router();

// src/routes/checkout.route.ts

// Cart checkout route
router.post('/cart', authenticate, checkoutController.processCheckout);

// Direct checkout route
router.post('/direct', checkoutController.directCheckout);

export const checkoutRoutes = router;
