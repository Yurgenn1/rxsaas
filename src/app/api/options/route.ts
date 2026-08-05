import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mockStore";

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "productId required" },
        { status: 400 }
      );
    }

    const groups = mockStore.optionGroups.listByProduct(productId);
    return NextResponse.json({ success: true, data: groups });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.type || !body.productId) {
      throw new Error("name, type e productId são obrigatórios");
    }

    const group = mockStore.optionGroups.create({
      name: body.name,
      type: body.type,
      isRequired: body.isRequired,
      minSelect: body.minSelect,
      maxSelect: body.maxSelect,
      productId: body.productId,
    });

    return NextResponse.json({ success: true, data: group }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
