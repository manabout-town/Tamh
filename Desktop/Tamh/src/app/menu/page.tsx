import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MenuMagazineLayout } from "@/components/menu/MenuMagazineLayout";
import type { Category, Menu } from "@/types/database";

export const dynamic = "force-dynamic";

async function getData(): Promise<{ categories: Category[]; menus: Menu[] }> {
  try {
    const supabase = createSupabaseServerClient();
    const [{ data: categories }, { data: menus }] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .order("priority", { ascending: true }),
      supabase
        .from("menus")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true }),
    ]);
    return { categories: categories ?? [], menus: menus ?? [] };
  } catch {
    return { categories: [], menus: [] };
  }
}

export default async function MenuPage() {
  const { categories, menus } = await getData();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-32 pt-16 lg:px-10">
      {/* Magazine masthead */}
      <header className="mb-16 border-b border-gold/15 pb-12">
        <p className="font-serif text-xs uppercase tracking-widest2 text-gold">
          Vol. 01 · Spring 2026
        </p>
        <h1 className="display-heading mt-4 text-[clamp(3rem,8vw,6rem)] leading-[0.95]">
          The Menu
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-lg italic leading-relaxed text-ivory/70">
          TÀMH의 셀렉션은 큐레이터의 시선으로 정리된 한 권의 잡지처럼,
          느리고 깊게 읽혀지길 바라며 구성되었습니다.
        </p>
      </header>

      <MenuMagazineLayout categories={categories} menus={menus} />
    </div>
  );
}
