import { db } from "@/lib/db";
import { CreateOptionGroupInput, CreateOptionInput } from "@/lib/validations/option";

export const optionService = {
  async listOptionGroups(productId: string) {
    return db.productOptionGroup.findMany({
      where: { productId },
      include: { options: true },
      orderBy: { order: "asc" },
    });
  },

  async createOptionGroup(data: CreateOptionGroupInput) {
    return db.productOptionGroup.create({
      data,
      include: { options: true },
    });
  },

  async updateOptionGroup(id: string, data: Partial<CreateOptionGroupInput>) {
    return db.productOptionGroup.update({
      where: { id },
      data,
      include: { options: true },
    });
  },

  async deleteOptionGroup(id: string) {
    return db.productOptionGroup.delete({ where: { id } });
  },

  async createOption(data: CreateOptionInput) {
    return db.productOption.create({ data });
  },

  async updateOption(id: string, data: Partial<CreateOptionInput>) {
    return db.productOption.update({ where: { id }, data });
  },

  async deleteOption(id: string) {
    return db.productOption.delete({ where: { id } });
  },
};
