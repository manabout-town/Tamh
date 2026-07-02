import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/static-db";

function checkPin(req: NextRequest) {
  return req.headers.get("x-admin-pin") === process.env.ADMIN_PIN;
}

export async function POST(req: NextRequest) {
  if (!checkPin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await req.json();
  const menu = db.insertMenu(payload);
  return NextResponse.json(menu, { status: 201 });
}
