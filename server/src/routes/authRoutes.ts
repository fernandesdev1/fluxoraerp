import { Router } from 'express';
import { login, logout, me, getUsers, createUser } from '../controllers/authController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, me);
router.get('/users', authenticate, authorize(['ADMIN']), getUsers);
router.post('/register', authenticate, authorize(['ADMIN']), createUser);

export default router;
