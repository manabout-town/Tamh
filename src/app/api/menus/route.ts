import { NextResponse } from "next/server";
import { getMenus } from "@/lib/menu-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getMenus());
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "메뉴 조회 실패" }, { status: 500 });
  }
}
