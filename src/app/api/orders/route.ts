import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/orderService";
import { createOrderSchema } from "@/lib/validations/order";
import { getDefaultRestaurantId, getGuestCustomerId } from "@/lib/restaurant";
import { notifyNewOrder } from "@/lib/whatsapp-notify";

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const status = request.nextUrl.searchParams.get("status") || undefined;

    const restaurantId = await getDefaultRestaurantId();
    const result = await orderService.listOrders(restaurantId, page, limit, status);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const restaurantId = await getDefaultRestaurantId();
    const customerId = await getGuestCustomerId();

    const validatedData = createOrderSchema.parse(body);
    const order = await orderService.createOrder(restaurantId, customerId, validatedData);

    notifyNewOrder(order).catch((err) =>
      console.error("🚨 [notifyNewOrder] Failed to send WhatsApp notification:", err)
    );

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
