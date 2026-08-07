import { db } from "@/lib/db";

let cachedDefaultRestaurantId: string | null = null;

export async function getDefaultRestaurantId(): Promise<string> {
  if (cachedDefaultRestaurantId) return cachedDefaultRestaurantId;

  const restaurant = await db.restaurant.findUnique({ where: { slug: "default" } });
  if (!restaurant) {
    throw new Error(
      "Restaurante padrão não encontrado. Rode o seed: node prisma/seed.js"
    );
  }

  cachedDefaultRestaurantId = restaurant.id;
  return restaurant.id;
}

let cachedGuestCustomerId: string | null = null;

export async function getGuestCustomerId(): Promise<string> {
  if (cachedGuestCustomerId) return cachedGuestCustomerId;

  const customer = await db.user.findUnique({ where: { email: "guest@rxsaas.local" } });
  if (!customer) {
    throw new Error(
      "Cliente padrão não encontrado. Rode o seed: node prisma/seed.js"
    );
  }

  cachedGuestCustomerId = customer.id;
  return customer.id;
}
