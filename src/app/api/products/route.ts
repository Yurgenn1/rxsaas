import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mockStore";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || undefined;
    const restaurantId = searchParams.get("restaurantId") || "default";

    const result = mockStore.products.list(restaurantId, page, limit, search, categoryId);

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

    if (!body.name || body.name.trim().length < 2) {
      throw new Error("Nome deve ter no mínimo 2 caracteres");
    }
    if (body.price === undefined || Number(body.price) <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }
    if (!body.categoryId) {
      throw new Error("Categoria é obrigatória");
    }

    const product = mockStore.products.create({
      name: body.name,
      description: body.description || null,
      price: Number(body.price),
      categoryId: body.categoryId,
      restaurantId: body.restaurantId || "default",
      isActive: body.isActive,
      isFeatured: body.isFeatured,
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}
