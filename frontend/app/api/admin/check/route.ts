export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const admin = !!token && token === process.env.ADMIN_SECRET;
  return NextResponse.json({ admin });
}
