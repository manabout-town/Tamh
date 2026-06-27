import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";

function checkPin(req: NextRequest) {
  return req.headers.get("x-admin-pin") === process.env.ADMIN_PIN;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkPin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updates = await req.json();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("menus")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkPin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("menus").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
