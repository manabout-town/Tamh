import { NextResponse } from "next/server";
import { db } from "@/lib/static-db";

export async function GET() {
  return NextResponse.json(db.getMenus());
}
