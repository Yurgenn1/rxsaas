import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/orderService";
import { updateOrderStatusSchema } from "@/lib/validations/order";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await orderService.getOrder(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === "cancel") {
      const order = await orderService.cancelOrder(id);
      return NextResponse.json({ success: true, data: order });
    }

    const validatedData = updateOrderStatusSchema.parse(body);
    const order = await orderService.updateOrderStatus(id, validatedData);

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
