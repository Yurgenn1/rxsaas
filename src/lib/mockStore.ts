/**
 * Temporary in-memory store for features without a UI yet (product options).
 * Categories, products and orders now persist via Prisma/PostgreSQL — see
 * src/services/*.ts. Data here resets whenever the dev server restarts.
 */

interface OptionGroup {
  id: string;
  name: string;
  type: "SIZE" | "FLAVOR" | "ADDITIONAL" | "REMOVAL" | "CUSTOM";
  isRequired: boolean;
  minSelect: number;
  maxSelect: number | null;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

const optionGroups: OptionGroup[] = [];
let optionGroupCounter = 0;

export const mockStore = {
  optionGroups: {
    listByProduct(productId: string) {
      return optionGroups.filter((g) => g.productId === productId);
    },
    create(data: {
      name: string;
      type: OptionGroup["type"];
      isRequired?: boolean;
      minSelect?: number;
      maxSelect?: number | null;
      productId: string;
    }) {
      const group: OptionGroup = {
        id: `optgrp_${Date.now()}_${optionGroupCounter++}`,
        name: data.name,
        type: data.type,
        isRequired: data.isRequired ?? false,
        minSelect: data.minSelect ?? 0,
        maxSelect: data.maxSelect ?? null,
        productId: data.productId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      optionGroups.push(group);
      return group;
    },
  },
};
