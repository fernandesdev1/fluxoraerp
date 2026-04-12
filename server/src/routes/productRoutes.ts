import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, getStats } from '../controllers/productController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getProducts);
router.get('/stats', authenticate, getStats);
router.post('/', authenticate, authorize(['ADMIN']), createProduct);
router.put('/:id', authenticate, authorize(['ADMIN']), updateProduct);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteProduct);

export default router;
