// User Types
export type UserType = "ADMIN" | "CUSTOMER";

// Product Types
export type ProductType = "REGULAR" | "COMBO" | "SEASONAL";
export type OptionGroupType = "SIZE" | "FLAVOR" | "ADDITIONAL" | "REMOVAL" | "CUSTOM";

// Order Types
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface CreateProductForm {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: File;
}

export interface CreateCategoryForm {
  name: string;
  description?: string;
  image?: File;
}

export interface OrderItemForm {
  productId: string;
  quantity: number;
  modifiers?: string[]; // Option IDs
}

export interface CreateOrderForm {
  restaurantId: string;
  items: OrderItemForm[];
  notes?: string;
  couponCode?: string;
  tip?: number;
}
