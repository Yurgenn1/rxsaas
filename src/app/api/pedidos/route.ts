import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/orderService";
import { createPedidoSchema } from "@/lib/validators/pedidos";
import { getDefaultRestaurantId, getGuestCustomerId } from "@/lib/restaurant";
import { notifyNewOrder } from "@/lib/whatsapp-notify";

/**
 * GET /api/pedidos
 * List all orders for a restaurant
 * Query params: page (default: 1), limit (default: 10), status (optional)
 * Returns: { success: true, data: { orders: Order[], total: number, page: number, limit: number } }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { success: false, error: "page and limit must be greater than 0" },
        { status: 400 }
      );
    }

    const restaurantId = await getDefaultRestaurantId();
    const result = await orderService.listOrders(restaurantId, page, limit, status);

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pedidos
 * Create a new order
 * Body: {
 *   customerName: string,
 *   customerPhone: string,
 *   orderType: "PICKUP" | "DELIVERY" | "DINE_IN",
 *   deliveryAddress?: string (required if orderType is DELIVERY),
 *   tableId?: string (required if orderType is DINE_IN),
 *   paymentMethod: "PIX" | "DINHEIRO" | "CARTAO_ENTREGA",
 *   notes?: string,
 *   items: [{ productId: string, quantity: int, notes?: string }]
 * }
 * Returns: { success: true, data: { order: Order } }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createPedidoSchema.parse(body);

    const restaurantId = await getDefaultRestaurantId();
    const customerId = await getGuestCustomerId();

    const order = await orderService.createOrder(restaurantId, customerId, {
      ...validatedData,
      comandaNumber: undefined, // Not used in pedidos schema
    } as any);

    // Notify about new order (async, don't wait)
    notifyNewOrder(order).catch((err) =>
      console.error("Error sending WhatsApp notification:", err)
    );

    return NextResponse.json(
      { success: true, data: { order } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed: " + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 400 }
    );
  }
}
