import { NextResponse } from "next/server";
import { analyticsService } from "@/services/analyticsService";
import { getDefaultRestaurantId } from "@/lib/restaurant";

export async function GET() {
  try {
    const restaurantId = await getDefaultRestaurantId();

    const [kpis, chart, topProducts] = await Promise.all([
      analyticsService.getKpis(restaurantId),
      analyticsService.getOrdersChart(restaurantId, 14),
      analyticsService.getTopProducts(restaurantId, 5, 30),
    ]);

    return NextResponse.json({ success: true, data: { kpis, chart, topProducts } });
  } catch (error: any) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
