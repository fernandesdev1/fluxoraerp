import { Request, Response } from 'express';
import prisma from '../db.js';

export const getExportData = async (req: Request, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        user: { select: { name: true } },
        items: { 
          include: { 
            product: { select: { name: true, sku: true } } 
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Formatting for a cleaner JSON export
    const exportData = sales.map(sale => ({
      id: sale.id,
      date: sale.createdAt,
      total: sale.totalAmount,
      seller: sale.user.name,
      itemsCount: sale.items.length,
      items: sale.items.map(item => ({
        product: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        price: item.price
      }))
    }));

    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate export data' });
  }
};
