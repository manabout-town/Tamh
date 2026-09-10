import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { isSupabaseEnabled, uploadMenuImage } from "@/lib/menu-store";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseEnabled) {
    return NextResponse.json(
      { error: "이미지 업로드는 Supabase 연결이 필요합니다. 이미지 주소를 직접 붙여넣어 주세요." },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "8MB 이하 이미지만 올릴 수 있습니다." }, { status: 400 });
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "이미지 파일만 올릴 수 있습니다." }, { status: 400 });
  }

  try {
    const url = await uploadMenuImage(file);
    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "업로드 실패" }, { status: 500 });
  }
}
