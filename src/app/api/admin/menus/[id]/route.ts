import { NextRequest, NextResponse } from "next/server";
import { deleteMenu, updateMenu } from "@/lib/menu-store";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const menu = await updateMenu(params.id, await req.json());
    if (!menu) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(menu);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "메뉴 수정 실패" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const ok = await deleteMenu(params.id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "메뉴 삭제 실패" }, { status: 500 });
  }
}
