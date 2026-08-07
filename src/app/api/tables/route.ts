import { NextResponse } from "next/server";
import { tableService } from "@/services/tableService";
import { getDefaultRestaurantId } from "@/lib/restaurant";

export async function GET() {
  try {
    const restaurantId = await getDefaultRestaurantId();
    const tables = await tableService.listTables(restaurantId);
    return NextResponse.json({ success: true, data: { tables } });
  } catch (error: any) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch tables" },
      { status: 500 }
    );
  }
}
