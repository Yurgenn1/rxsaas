import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDefaultRestaurantId } from "@/lib/restaurant";

/**
 * Helper functions for date calculations
 */
function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

/**
 * GET /api/dashboard/kpis
 * Get dashboard KPIs for today
 * Returns: {
 *   success: true,
 *   data: {
 *     receita_do_dia: number (sum of order totals for today),
 *     pedidos_do_dia: number (count of orders for today),
 *     mesas_ativas: number (count of occupied tables),
 *     produtos_no_cardapio: number (count of active products),
 *     pedidos_em_andamento: number (count of orders in progress)
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const restaurantId = await getDefaultRestaurantId();
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    // Fetch all KPI data in parallel for better performance
    const [
      revenueResult,
      ordersCountResult,
      activeTables,
      productsCount,
      ordersInProgress,
    ] = await Promise.all([
      // Receita do Dia: SUM(total) WHERE createdAt >= TODAY
      db.order.aggregate({
        where: {
          restaurantId,
          createdAt: { gte: todayStart, lte: todayEnd },
          status: { not: "CANCELLED" },
        },
        _sum: { total: true },
      }),
      // Pedidos do Dia: COUNT(*) WHERE createdAt >= TODAY
      db.order.count({
        where: {
          restaurantId,
          createdAt: { gte: todayStart, lte: todayEnd },
          status: { not: "CANCELLED" },
        },
      }),
      // Mesas Ativas: COUNT(*) WHERE status = 'OCCUPIED'
      // Note: Table model doesn't have status, we check if table has orders in progress
      db.order.findMany({
        where: {
          restaurantId,
          tableId: { not: null },
          status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] },
        },
        distinct: ["tableId"],
        select: { tableId: true },
      }),
      // Produtos no Cardápio: COUNT(*) FROM products WHERE restaurantId = X
      db.product.count({
        where: {
          restaurantId,
          isActive: true,
        },
      }),
      // Pedidos em andamento: COUNT(*) WHERE status IN (PENDING, CONFIRMED, PREPARING, READY)
      db.order.count({
        where: {
          restaurantId,
          status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] },
        },
      }),
    ]);

    // Calculate revenue as number
    const receitaDoDia = Number(revenueResult._sum.total ?? 0);

    // Count unique tables
    const mesasAtivasCount = new Set(
      activeTables.map((order) => order.tableId).filter((id) => id !== null)
    ).size;

    return NextResponse.json(
      {
        success: true,
        data: {
          receita_do_dia: receitaDoDia,
          pedidos_do_dia: ordersCountResult,
          mesas_ativas: mesasAtivasCount,
          produtos_no_cardapio: productsCount,
          pedidos_em_andamento: ordersInProgress,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching KPIs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch KPIs" },
      { status: 500 }
    );
  }
}
