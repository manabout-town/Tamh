import { MenuManager } from "@/components/admin/MenuManager";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminMenusPage() {
  let categories: any[] = [];
  let menus: any[] = [];
  try {
    const supabase = createSupabaseServerClient();
    const [c, m] = await Promise.all([
      supabase.from("categories").select("*").order("priority"),
      supabase.from("menus").select("*").order("created_at", { ascending: false }),
    ]);
    categories = c.data ?? [];
    menus = m.data ?? [];
  } catch {
    /* DB 미설정 — 빈 화면 표시 */
  }

  return <MenuManager initialCategories={categories} initialMenus={menus} />;
}
