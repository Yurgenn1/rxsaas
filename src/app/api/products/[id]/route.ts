import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mockStore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = mockStore.products.get(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.name || body.name.trim().length < 2) {
      throw new Error("Nome deve ter no mínimo 2 caracteres");
    }
    if (body.price === undefined || Number(body.price) <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }

    const product = mockStore.products.update(id, {
      name: body.name,
      description: body.description || null,
      price: Number(body.price),
      categoryId: body.categoryId,
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    mockStore.products.delete(id);
    return NextResponse.json({ success: true, data: { id } });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 400 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    if (action === "toggle-active") {
      const existing = mockStore.products.get(id);
      if (!existing) throw new Error("Product not found");
      const product = mockStore.products.update(id, { isActive: !existing.isActive });
      return NextResponse.json({ success: true, data: product });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error patching product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 400 }
    );
  }
}
