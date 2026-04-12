import { Request, Response } from 'express';
import prisma from '../db.js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { name: 'asc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { sku, name, description, categoryId, price, stock, minStock } = req.body;

  try {
    const product = await prisma.product.create({
      data: { sku, name, description, categoryId, price, stock: Number(stock), minStock: Number(minStock) },
      include: { category: true }
    });
    res.status(201).json(product);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, categoryId, price, stock, minStock } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: id as string },
      data: { name, description, categoryId, price, stock: Number(stock), minStock: Number(minStock) },
      include: { category: true }
    });
    
    // Check for low stock after update
    if (product.stock <= product.minStock) {
      const io = req.app.get('io');
      io.emit('notification', {
        type: 'WARNING',
        message: `Low stock alert: ${product.name} (${product.sku}) is at ${product.stock} units.`
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({ where: { id: id as string } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    const totalProducts = await prisma.product.count();
    
    // Count items created in last 7 days
    const newItemsCount = await prisma.product.count({
      where: { createdAt: { gte: sevenDaysAgo } }
    });

    const products = await prisma.product.findMany();
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

    res.json({
      totalProducts,
      lowStockCount,
      newItemsCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
