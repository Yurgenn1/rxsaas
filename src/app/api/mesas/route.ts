import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDefaultRestaurantId } from "@/lib/restaurant";
import { createMesaSchema } from "@/lib/validators/mesas";

/**
 * GET /api/mesas
 * List all tables for a restaurant
 * Query params: page, limit
 * Returns: { success: true, data: { tables: Table[], total: number, page: number, limit: number } }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { success: false, error: "page and limit must be greater than 0" },
        { status: 400 }
      );
    }

    const restaurantId = await getDefaultRestaurantId();

    const [tables, total] = await Promise.all([
      db.table.findMany({
        where: { restaurantId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { number: "asc" },
      }),
      db.table.count({ where: { restaurantId } }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          tables,
          total,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch tables" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mesas
 * Create a new table for a restaurant
 * Body: { number: int, capacity?: int, isActive?: boolean }
 * Returns: { success: true, data: { table: Table } }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMesaSchema.parse(body);

    const restaurantId = await getDefaultRestaurantId();

    // Check if table number already exists
    const existingTable = await db.table.findUnique({
      where: { restaurantId_number: { restaurantId, number: validatedData.number } },
    });

    if (existingTable) {
      return NextResponse.json(
        { success: false, error: "Mesa com este número já existe neste restaurante" },
        { status: 409 }
      );
    }

    const table = await db.table.create({
      data: {
        number: validatedData.number,
        capacity: validatedData.capacity,
        isActive: validatedData.isActive,
        restaurantId,
      },
    });

    return NextResponse.json(
      { success: true, data: { table } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating table:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed: " + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to create table" },
      { status: 400 }
    );
  }
}
