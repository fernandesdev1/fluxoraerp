import { Request, Response } from 'express';
import prisma from '../db.js';

export const createSale = async (req: Request, res: Response) => {
  const { items, totalAmount } = req.body;
  const userId = (req as any).user.id;

  try {
    const sale = await prisma.$transaction(async (tx) => {
      // 1. Create the sale
      const newSale = await tx.sale.create({
        data: {
          userId,
          totalAmount,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: { items: true }
      });

      // 2. Update stock for each product
      for (const item of items) {
        const product = await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });

        // 3. Emit real-time notification if stock is low
        if (product.stock <= product.minStock) {
          const io = req.app.get('io');
          io.emit('notification', {
            type: 'ALERT',
            message: `Critical Stock: ${product.name} is now at ${product.stock} units!`,
            productId: product.id
          });
        }
      }

      return newSale;
    });

    // Notify dashboard about new sale
    const io = req.app.get('io');
    io.emit('new_sale', {
      amount: totalAmount,
      timestamp: new Date()
    });

    res.status(201).json(sale);
  } catch (error) {
    console.error('Sale error:', error);
    res.status(500).json({ error: 'Failed to process sale' });
  }
};

export const getSalesHistory = async (req: Request, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        user: { select: { name: true } },
        items: { include: { product: { select: { name: true, sku: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales history' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current Month Revenue
    const currentRevenue = await prisma.sale.aggregate({
      where: { createdAt: { gte: firstDayCurrentMonth } },
      _sum: { totalAmount: true }
    });

    // Last Month Revenue
    const lastRevenue = await prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth
        }
      },
      _sum: { totalAmount: true }
    });

    // Current Month Sales Count
    const currentSalesCount = await prisma.sale.count({
      where: { createdAt: { gte: firstDayCurrentMonth } }
    });

    // Last Month Sales Count
    const lastSalesCount = await prisma.sale.count({
      where: {
        createdAt: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth
        }
      }
    });

    // Calculations
    const totalRevenue = await prisma.sale.aggregate({ _sum: { totalAmount: true } });
    const totalSales = await prisma.sale.count();

    const revenueTrend = lastRevenue._sum.totalAmount 
      ? ((currentRevenue._sum.totalAmount || 0) - lastRevenue._sum.totalAmount) / lastRevenue._sum.totalAmount * 100
      : 0;

    const salesTrend = lastSalesCount 
      ? (currentSalesCount - lastSalesCount) / lastSalesCount * 100
      : 0;

    const topProducts = await prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });

    const detailedTopProducts = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, sku: true }
        });
        return {
          ...product,
          totalSold: item._sum.quantity
        };
      })
    );

    res.json({
      revenue: totalRevenue._sum.totalAmount || 0,
      salesCount: totalSales,
      revenueTrend: revenueTrend.toFixed(1),
      salesTrend: salesTrend.toFixed(1),
      topProducts: detailedTopProducts
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
