import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";

function checkPin(req: NextRequest) {
  return req.headers.get("x-admin-pin") === process.env.ADMIN_PIN;
}

export async function POST(req: NextRequest) {
  if (!checkPin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await req.json();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("menus")
    .insert({ ...payload, is_active: true })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
