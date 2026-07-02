import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/static-db";

function checkPin(req: NextRequest) {
  return req.headers.get("x-admin-pin") === process.env.ADMIN_PIN;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkPin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const updates = await req.json();
  const menu = db.updateMenu(params.id, updates);
  if (!menu) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(menu);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkPin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = db.deleteMenu(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
