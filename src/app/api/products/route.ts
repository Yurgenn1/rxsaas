import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/productService";
import { createProductSchema } from "@/lib/validations/product";
import { getDefaultRestaurantId } from "@/lib/restaurant";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || undefined;

    const restaurantId = await getDefaultRestaurantId();
    const result = await productService.listProducts(restaurantId, page, limit, search, categoryId);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    const restaurantId = await getDefaultRestaurantId();
    const product = await productService.createProduct(restaurantId, validatedData);

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}
