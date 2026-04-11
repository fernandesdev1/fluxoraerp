import { Router } from 'express';
import { createSale, getSalesHistory, getDashboardStats } from '../controllers/saleController.js';
import { getExportData } from '../controllers/reportController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/history', authenticate, getSalesHistory);
router.get('/dashboard', authenticate, getDashboardStats);
router.get('/export', authenticate, authorize(['ADMIN']), getExportData);
router.post('/', authenticate, createSale);

export default router;
