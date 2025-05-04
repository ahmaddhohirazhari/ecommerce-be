const router = require('express').Router();
import { UserController } from './user.controller';

// Create
router.post('/', UserController.createUser);

// Read
router.get('/', UserController.getUsers);
router.get('/:userId', UserController.getUser);

// Update
router.put('/:userId', UserController.updateUser);

// Delete
router.delete('/:userId', UserController.deleteUser);

export const userRoutes = router;
