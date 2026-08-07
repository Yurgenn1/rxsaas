import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/services/categoryService";
import { createCategorySchema } from "@/lib/validations/category";
import { getDefaultRestaurantId } from "@/lib/restaurant";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const restaurantId = await getDefaultRestaurantId();
    const result = await categoryService.listCategories(restaurantId, page, limit, search);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);

    const restaurantId = await getDefaultRestaurantId();
    const category = await categoryService.createCategory(restaurantId, validatedData);

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create category" },
      { status: 400 }
    );
  }
}
