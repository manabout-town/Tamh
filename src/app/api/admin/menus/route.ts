import { NextRequest, NextResponse } from "next/server";
import { createMenu } from "@/lib/menu-store";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const menu = await createMenu(await req.json());
    return NextResponse.json(menu, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "메뉴 추가 실패" }, { status: 500 });
  }
}
