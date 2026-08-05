import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, message: "API funcionando!" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}
