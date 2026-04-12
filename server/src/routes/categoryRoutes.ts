import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getCategories);
router.post('/', authenticate, authorize(['ADMIN']), createCategory);
router.put('/:id', authenticate, authorize(['ADMIN']), updateCategory);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteCategory);

export default router;
