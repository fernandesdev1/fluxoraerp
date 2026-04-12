import bcrypt from 'bcrypt';
import prisma from './db.js';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fluxora.com' },
    update: {},
    create: {
      name: 'Fluxora Admin',
      email: 'admin@fluxora.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create Employee
  const employeePassword = await bcrypt.hash('user123', 10);
  const employee = await prisma.user.upsert({
    where: { email: 'emp@fluxora.com' },
    update: {},
    create: {
      name: 'John Employee',
      email: 'emp@fluxora.com',
      password: employeePassword,
      role: 'EMPLOYEE',
    },
  });

  console.log('✅ Employee user created:', employee.email);

  // Create Categories
  const catNames = ['Eletrônicos', 'Acessórios', 'Hardware', 'Software'];
  const categories: any = {};
  for (const name of catNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    categories[name] = cat.id;
  }
  console.log('✅ Categories seeded');

  // Seed some products
  const products = [
    { sku: 'LP-001', name: 'Laptop Pro 15', categoryId: categories['Eletrônicos'], price: 4500.0, stock: 12, minStock: 5 },
    { sku: 'MN-002', name: 'Monitor 4K 27"', categoryId: categories['Eletrônicos'], price: 2100.0, stock: 3, minStock: 5 },
    { sku: 'KB-003', name: 'Teclado Mecânico RGB', categoryId: categories['Acessórios'], price: 350.0, stock: 25, minStock: 10 },
    { sku: 'MS-004', name: 'Mouse Gamer Wireless', categoryId: categories['Acessórios'], price: 280.0, stock: 18, minStock: 8 },
    { sku: 'HD-005', name: 'SSD NVMe 1TB', categoryId: categories['Hardware'], price: 550.0, stock: 2, minStock: 10 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }

  console.log('✅ Products seeded');
  console.log('🌱 Seeding completed!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
