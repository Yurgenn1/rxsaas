const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Iutr5fTa2GK9P4";

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const owner = await db.user.upsert({
    where: { email: "admin@rxsaas.local" },
    update: { password: hashedPassword },
    create: {
      email: "admin@rxsaas.local",
      name: "Administrador",
      password: hashedPassword,
      type: "ADMIN",
    },
  });

  const restaurant = await db.restaurant.upsert({
    where: { slug: "default" },
    update: {},
    create: {
      name: "Meu Restaurante",
      slug: "default",
      ownerId: owner.id,
    },
  });

  const guest = await db.user.upsert({
    where: { email: "guest@rxsaas.local" },
    update: {},
    create: {
      email: "guest@rxsaas.local",
      name: "Cliente Balcão",
      password: "not-implemented-yet",
      type: "CUSTOMER",
    },
  });

  console.log("✅ Restaurante e usuários base prontos.");
  console.log(`🔐 Login admin: admin@rxsaas.local / senha: ${ADMIN_PASSWORD}`);

  // --- Mesas (idempotente, garante 12 mesas mesmo em restarts) ---
  const demoTables = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    capacity: [2, 4, 6][i % 3],
  }));
  for (const t of demoTables) {
    await db.table.upsert({
      where: { restaurantId_number: { restaurantId: restaurant.id, number: t.number } },
      update: {},
      create: { ...t, restaurantId: restaurant.id },
    });
  }
  console.log(`✅ ${demoTables.length} mesas garantidas.`);

  // --- Dados de demonstração (categorias, produtos, pedidos) ---
  const existingOrders = await db.order.count({ where: { restaurantId: restaurant.id } });
  if (existingOrders > 0) {
    console.log(`ℹ️  Já existem ${existingOrders} pedidos — pulando seed de demonstração.`);
    return;
  }

  const demoCategories = [
    { name: "Pizzas", description: "Pizzas artesanais", order: 0 },
    { name: "Bebidas", description: "Refrigerantes e sucos", order: 1 },
    { name: "Sobremesas", description: "Doces da casa", order: 2 },
  ];

  const categories = [];
  for (const c of demoCategories) {
    const category = await db.category.upsert({
      where: { restaurantId_name: { restaurantId: restaurant.id, name: c.name } },
      update: {},
      create: { ...c, restaurantId: restaurant.id },
    });
    categories.push(category);
  }

  const demoProducts = [
    { name: "Pizza Margherita", price: 42.9, categoryIndex: 0 },
    { name: "Pizza Calabresa", price: 45.9, categoryIndex: 0 },
    { name: "Pizza Quatro Queijos", price: 49.9, categoryIndex: 0 },
    { name: "Refrigerante Lata", price: 6.5, categoryIndex: 1 },
    { name: "Suco Natural", price: 9.9, categoryIndex: 1 },
    { name: "Pudim", price: 12.9, categoryIndex: 2 },
    { name: "Petit Gateau", price: 18.9, categoryIndex: 2 },
  ];

  const products = [];
  for (const p of demoProducts) {
    const product = await db.product.create({
      data: {
        name: p.name,
        price: p.price,
        restaurantId: restaurant.id,
        categoryId: categories[p.categoryIndex].id,
      },
    });
    products.push(product);
  }

  const statusPool = [
    "PENDING",
    "PENDING",
    "CONFIRMED",
    "CONFIRMED",
    "PREPARING",
    "PREPARING",
    "READY",
    "COMPLETED",
    "COMPLETED",
    "COMPLETED",
    "COMPLETED",
    "COMPLETED",
    "COMPLETED",
    "COMPLETED",
    "COMPLETED",
    "COMPLETED",
    "CANCELLED",
    "CANCELLED",
  ];

  const orderTypes = ["PICKUP", "DELIVERY", "DINE_IN"];

  for (let i = 0; i < statusPool.length; i++) {
    const status = statusPool[i];
    // Distribute createdAt across the last 13 days, most weighted to recent days.
    const daysAgo = Math.floor(i / 1.5);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(11 + (i % 10), (i * 7) % 60, 0, 0);

    const itemCount = 1 + (i % 3);
    const chosenProducts = [];
    for (let j = 0; j < itemCount; j++) {
      chosenProducts.push(products[(i + j) % products.length]);
    }
    const subtotal = chosenProducts.reduce((sum, p) => sum + Number(p.price), 0);
    const tax = 0;
    const discount = 0;
    const tip = 0;
    const total = subtotal + tax + tip - discount;

    await db.order.create({
      data: {
        orderNumber: `PED-DEMO-${1000 + i}`,
        status,
        orderType: orderTypes[i % orderTypes.length],
        restaurantId: restaurant.id,
        customerId: guest.id,
        subtotal,
        tax,
        discount,
        tip,
        total,
        createdAt,
        updatedAt: createdAt,
        completedAt: status === "COMPLETED" ? createdAt : null,
        items: {
          create: chosenProducts.map((p) => ({
            productId: p.id,
            quantity: 1,
            unitPrice: p.price,
          })),
        },
      },
    });
  }

  console.log(`✅ Seed de demonstração: ${categories.length} categorias, ${products.length} produtos, ${statusPool.length} pedidos.`);
}

main()
  .catch((error) => {
    console.error("Erro ao rodar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
