import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mockStore";

export async function GET(request: NextRequest) {
  try {
    const restaurantId = request.nextUrl.searchParams.get("restaurantId") || "default";
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const status = request.nextUrl.searchParams.get("status") || undefined;

    const result = mockStore.orders.list(restaurantId, page, limit, status);
    return NextResponse.json({ success: true, data: result });
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

    if (body.subtotal === undefined || body.total === undefined) {
      throw new Error("Subtotal e total são obrigatórios");
    }

    const order = mockStore.orders.create({
      restaurantId: body.restaurantId || "default",
      subtotal: Number(body.subtotal),
      tax: Number(body.tax) || 0,
      discount: Number(body.discount) || 0,
      tip: Number(body.tip) || 0,
      total: Number(body.total),
      orderType: body.orderType || "dine_in",
      notes: body.notes || null,
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
