/**
 * Shared in-memory data store used by all API routes during development.
 * Avoids depending on a live PostgreSQL connection while the DB setup is unverified.
 * Data resets whenever the dev server restarts.
 */

interface Category {
  id: string;
  name: string;
  description: string | null;
  restaurantId: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  restaurantId: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  restaurantId: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
  subtotal: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  orderType: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

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

const categories: Category[] = [];
const products: Product[] = [];
const orders: Order[] = [];
const optionGroups: OptionGroup[] = [];

let categoryCounter = 0;
let productCounter = 0;
let orderCounter = 0;
let optionGroupCounter = 0;

function paginate<T>(items: T[], page: number, limit: number) {
  const skip = (page - 1) * limit;
  return items.slice(skip, skip + limit);
}

export const mockStore = {
  categories: {
    list(restaurantId: string, page = 1, limit = 10, search = "") {
      let filtered = categories.filter((c) => c.restaurantId === restaurantId);
      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            (c.description && c.description.toLowerCase().includes(term))
        );
      }
      return {
        categories: paginate(filtered, page, limit),
        total: filtered.length,
        page,
        limit,
      };
    },
    get(id: string) {
      return categories.find((c) => c.id === id) || null;
    },
    create(data: { name: string; description?: string | null; restaurantId: string }) {
      const category: Category = {
        id: `cat_${Date.now()}_${categoryCounter++}`,
        name: data.name,
        description: data.description || null,
        restaurantId: data.restaurantId,
        isActive: true,
        order: categories.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      categories.push(category);
      return category;
    },
    update(id: string, data: Partial<Pick<Category, "name" | "description" | "isActive">>) {
      const category = categories.find((c) => c.id === id);
      if (!category) throw new Error("Category not found");
      Object.assign(category, data, { updatedAt: new Date().toISOString() });
      return category;
    },
    delete(id: string) {
      const index = categories.findIndex((c) => c.id === id);
      if (index === -1) throw new Error("Category not found");
      categories.splice(index, 1);
    },
  },

  products: {
    list(restaurantId: string, page = 1, limit = 10, search = "", categoryId?: string) {
      let filtered = products.filter((p) => p.restaurantId === restaurantId);
      if (categoryId) {
        filtered = filtered.filter((p) => p.categoryId === categoryId);
      }
      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            (p.description && p.description.toLowerCase().includes(term))
        );
      }
      const paged = paginate(filtered, page, limit);
      const withCategory = paged.map((p) => ({
        ...p,
        category: mockStore.categories.get(p.categoryId),
      }));
      return { products: withCategory, total: filtered.length, page, limit };
    },
    get(id: string) {
      const product = products.find((p) => p.id === id);
      if (!product) return null;
      return { ...product, category: mockStore.categories.get(product.categoryId) };
    },
    create(data: {
      name: string;
      description?: string | null;
      price: number;
      categoryId: string;
      restaurantId: string;
      isActive?: boolean;
      isFeatured?: boolean;
    }) {
      const product: Product = {
        id: `prod_${Date.now()}_${productCounter++}`,
        name: data.name,
        description: data.description || null,
        price: data.price,
        categoryId: data.categoryId,
        restaurantId: data.restaurantId,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      products.push(product);
      return product;
    },
    update(
      id: string,
      data: Partial<
        Pick<Product, "name" | "description" | "price" | "categoryId" | "isActive" | "isFeatured">
      >
    ) {
      const product = products.find((p) => p.id === id);
      if (!product) throw new Error("Product not found");
      Object.assign(product, data, { updatedAt: new Date().toISOString() });
      return product;
    },
    delete(id: string) {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) throw new Error("Product not found");
      products.splice(index, 1);
    },
  },

  orders: {
    list(restaurantId: string, page = 1, limit = 10, status?: string) {
      let filtered = orders.filter((o) => o.restaurantId === restaurantId);
      if (status) {
        filtered = filtered.filter((o) => o.status === status);
      }
      return { orders: paginate(filtered, page, limit), total: filtered.length, page, limit };
    },
    get(id: string) {
      return orders.find((o) => o.id === id) || null;
    },
    create(data: {
      restaurantId: string;
      subtotal: number;
      tax?: number;
      discount?: number;
      tip?: number;
      total: number;
      orderType: string;
      notes?: string | null;
    }) {
      const order: Order = {
        id: `order_${Date.now()}_${orderCounter++}`,
        restaurantId: data.restaurantId,
        status: "pending",
        subtotal: data.subtotal,
        tax: data.tax || 0,
        discount: data.discount || 0,
        tip: data.tip || 0,
        total: data.total,
        orderType: data.orderType,
        notes: data.notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      orders.push(order);
      return order;
    },
    updateStatus(id: string, status: Order["status"]) {
      const order = orders.find((o) => o.id === id);
      if (!order) throw new Error("Order not found");
      order.status = status;
      order.updatedAt = new Date().toISOString();
      return order;
    },
    cancel(id: string) {
      return mockStore.orders.updateStatus(id, "cancelled");
    },
  },

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
