import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDefaultRestaurantId } from "@/lib/restaurant";

/**
 * GET /api/cardapio
 * Get the complete menu with categories and products
 * Returns: { success: true, data: { categories: Category[], products: Product[] } }
 */
export async function GET(request: NextRequest) {
  try {
    const restaurantId = await getDefaultRestaurantId();

    // Fetch categories and products in parallel
    const [categories, products] = await Promise.all([
      db.category.findMany({
        where: {
          restaurantId,
          isActive: true,
        },
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
      }),
      db.product.findMany({
        where: {
          restaurantId,
          isActive: true,
          isAvailable: true,
        },
        orderBy: { order: "asc" },
        include: {
          category: true,
          optionGroups: {
            orderBy: { order: "asc" },
            include: {
              options: {
                where: { isActive: true },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      }),
    ]);

    // Transform Decimal prices to numbers
    const transformedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
      optionGroups: product.optionGroups.map((group) => ({
        ...group,
        options: group.options.map((option) => ({
          ...option,
          price: Number(option.price),
        })),
      })),
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          categories: categories.map((cat) => ({
            ...cat,
            productCount: cat._count.products,
            _count: undefined, // Remove the _count field from response
          })),
          products: transformedProducts,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching cardapio:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch cardapio" },
      { status: 500 }
    );
  }
}
