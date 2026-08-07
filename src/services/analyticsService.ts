import { db } from "@/lib/db";

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
function pctChange(curr: number, prev: number) {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
}

const IN_PROGRESS_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY"] as const;

export const analyticsService = {
  async getKpis(restaurantId: string) {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yStart = startOfDay(yesterday);
    const yEnd = endOfDay(yesterday);

    const [
      ordersToday,
      ordersYesterday,
      revenueToday,
      revenueYesterday,
      inProgress,
      customerOrderCounts,
    ] = await Promise.all([
      db.order.count({ where: { restaurantId, createdAt: { gte: todayStart, lte: todayEnd } } }),
      db.order.count({ where: { restaurantId, createdAt: { gte: yStart, lte: yEnd } } }),
      db.order.aggregate({
        where: { restaurantId, createdAt: { gte: todayStart, lte: todayEnd }, status: { not: "CANCELLED" } },
        _sum: { total: true },
      }),
      db.order.aggregate({
        where: { restaurantId, createdAt: { gte: yStart, lte: yEnd }, status: { not: "CANCELLED" } },
        _sum: { total: true },
      }),
      db.order.count({
        where: { restaurantId, status: { in: [...IN_PROGRESS_STATUSES] } },
      }),
      db.order.groupBy({
        by: ["customerId"],
        where: { restaurantId },
        _count: { _all: true },
      }),
    ]);

    const recurringCustomers = customerOrderCounts.filter((g) => g._count._all > 1).length;
    const revenueTodayNum = Number(revenueToday._sum.total ?? 0);
    const revenueYesterdayNum = Number(revenueYesterday._sum.total ?? 0);

    return {
      pedidosHoje: { value: ordersToday, trendPct: pctChange(ordersToday, ordersYesterday) },
      faturamentoHoje: { value: revenueTodayNum, trendPct: pctChange(revenueTodayNum, revenueYesterdayNum) },
      pedidosEmAndamento: { value: inProgress, trendPct: null },
      clientesRecorrentes: { value: recurringCustomers, trendPct: null },
    };
  },

  async getOrdersChart(restaurantId: string, days = 14) {
    const rows = await db.$queryRaw<{ day: Date; revenue: number; orders: bigint }[]>`
      SELECT date_trunc('day', "createdAt") AS day,
             COALESCE(SUM("total"), 0)::float AS revenue,
             COUNT(*) AS orders
      FROM "Order"
      WHERE "restaurantId" = ${restaurantId}
        AND "createdAt" >= NOW() - (${days} || ' days')::interval
        AND "status" != 'CANCELLED'
      GROUP BY 1
      ORDER BY 1 ASC;
    `;

    const byDay = new Map(
      rows.map((r) => [r.day.toISOString().slice(0, 10), { revenue: r.revenue, orders: Number(r.orders) }])
    );

    const result: { date: string; revenue: number; orders: number }[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const entry = byDay.get(key);
      result.push({ date: key, revenue: entry?.revenue ?? 0, orders: entry?.orders ?? 0 });
    }
    return result;
  },

  async getTopProducts(restaurantId: string, limit = 5, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const orders = await db.order.findMany({
      where: { restaurantId, createdAt: { gte: since }, status: { not: "CANCELLED" } },
      select: { id: true },
    });
    if (orders.length === 0) return [];

    const grouped = await db.orderItem.groupBy({
      by: ["productId"],
      where: { orderId: { in: orders.map((o) => o.id) } },
      _sum: { quantity: true },
    });

    const top = grouped
      .sort((a, b) => (b._sum.quantity ?? 0) - (a._sum.quantity ?? 0))
      .slice(0, limit);
    if (top.length === 0) return [];

    const products = await db.product.findMany({
      where: { id: { in: top.map((t) => t.productId) } },
      select: { id: true, name: true },
    });

    return top.map((t) => ({
      productId: t.productId,
      name: products.find((p) => p.id === t.productId)?.name ?? "—",
      quantity: t._sum.quantity ?? 0,
    }));
  },

  async getOrdersByStatus(restaurantId: string) {
    const grouped = await db.order.groupBy({
      by: ["status"],
      where: { restaurantId },
      _count: { _all: true },
    });
    const counts: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      PREPARING: 0,
      READY: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    for (const g of grouped) counts[g.status] = g._count._all;
    return counts;
  },
};
