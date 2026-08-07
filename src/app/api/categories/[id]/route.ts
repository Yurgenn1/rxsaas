import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/services/categoryService";
import { updateCategorySchema } from "@/lib/validations/category";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await categoryService.getCategory(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
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
    const validatedData = updateCategorySchema.parse(body);

    const category = await categoryService.updateCategory(id, validatedData);

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update category" },
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
    await categoryService.deleteCategory(id);
    return NextResponse.json({ success: true, data: { id } });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete category" },
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
      const category = await categoryService.toggleActive(id);
      return NextResponse.json({ success: true, data: category });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error patching category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update category" },
      { status: 400 }
    );
  }
}
