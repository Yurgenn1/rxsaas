import { db } from "@/lib/db";
import { CreateCategoryInput, UpdateCategoryInput } from "@/lib/validations/category";

export const categoryService = {
  async listCategories(restaurantId: string, page = 1, limit = 10, search = "") {
    const skip = (page - 1) * limit;

    const where = {
      restaurantId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [categories, total] = await Promise.all([
      db.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
      }),
      db.category.count({ where }),
    ]);

    return { categories, total, page, limit };
  },

  async getCategory(id: string) {
    return db.category.findUnique({ where: { id } });
  },

  async createCategory(restaurantId: string, data: CreateCategoryInput) {
    return db.category.create({
      data: {
        ...data,
        restaurantId,
      },
    });
  },

  async updateCategory(id: string, data: UpdateCategoryInput) {
    return db.category.update({
      where: { id },
      data,
    });
  },

  async deleteCategory(id: string) {
    return db.category.delete({ where: { id } });
  },

  async toggleActive(id: string) {
    const category = await db.category.findUnique({ where: { id } });
    if (!category) throw new Error("Category not found");

    return db.category.update({
      where: { id },
      data: { isActive: !category.isActive },
    });
  },
};
