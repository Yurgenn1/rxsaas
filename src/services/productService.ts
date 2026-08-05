import { db } from "@/lib/db";
import { CreateProductInput, UpdateProductInput } from "@/lib/validations/product";

export const productService = {
  async listProducts(restaurantId: string, page = 1, limit = 10, search = "", categoryId?: string) {
    const skip = (page - 1) * limit;

    const where = {
      restaurantId,
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { order: "asc" },
      }),
      db.product.count({ where }),
    ]);

    return { products, total, page, limit };
  },

  async getProduct(id: string) {
    return db.product.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  async createProduct(restaurantId: string, data: CreateProductInput) {
    return db.product.create({
      data: {
        ...data,
        restaurantId,
      },
      include: { category: true },
    });
  },

  async updateProduct(id: string, data: UpdateProductInput) {
    return db.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  },

  async deleteProduct(id: string) {
    return db.product.delete({ where: { id } });
  },

  async toggleActive(id: string) {
    const product = await db.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");

    return db.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });
  },

  async duplicateProduct(id: string) {
    const product = await db.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");

    const { id: _, ...data } = product;
    return db.product.create({
      data: {
        ...data,
        name: `${product.name} (Cópia)`,
      },
      include: { category: true },
    });
  },
};
