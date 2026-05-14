import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FloorPlan } from "@/components/store/FloorPlan";
import type { BarTable, Category, Menu, TableGroup } from "@/types/database";

export const dynamic = "force-dynamic";

async function getData(): Promise<{
  tables: BarTable[];
  groups: TableGroup[];
  menus: Menu[];
  categories: Category[];
}> {
  try {
    const supabase = createSupabaseServerClient();
    const [t, g, m, c] = await Promise.all([
      supabase.from("tables").select("*").order("created_at"),
      supabase.from("table_groups").select("*"),
      supabase.from("menus").select("*").eq("is_active", true).order("price"),
      supabase.from("categories").select("*").order("priority"),
    ]);
    return {
      tables: t.data ?? [],
      groups: g.data ?? [],
      menus: m.data ?? [],
      categories: c.data ?? [],
    };
  } catch {
    return { tables: [], groups: [], menus: [], categories: [] };
  }
}

export default async function StorePage() {
  const { tables, groups, menus, categories } = await getData();

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-8 lg:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs uppercase tracking-widest2 text-gold">
            Floor Plan
          </p>
          <h1 className="font-korean mt-2 text-5xl font-bold text-ivory">매장</h1>
        </div>
        <p className="font-korean text-sm text-ivory/50">
          이동/리사이즈 · 합치기 · 주문 · 합산 계산
        </p>
      </header>

      <FloorPlan
        initialTables={tables}
        initialGroups={groups}
        menus={menus}
        categories={categories}
      />
    </div>
  );
}
