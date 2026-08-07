import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/productService";
import { updateProductSchema } from "@/lib/validations/product";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await productService.getProduct(id);

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
    const validatedData = updateProductSchema.parse(body);

    const product = await productService.updateProduct(id, validatedData);

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
    await productService.deleteProduct(id);
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
      const product = await productService.toggleActive(id);
      return NextResponse.json({ success: true, data: product });
    }

    if (action === "duplicate") {
      const product = await productService.duplicateProduct(id);
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
