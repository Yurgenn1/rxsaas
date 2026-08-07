import { db } from "@/lib/db";

export const tableService = {
  async listTables(restaurantId: string) {
    return db.table.findMany({
      where: { restaurantId, isActive: true },
      orderBy: { number: "asc" },
    });
  },
};
