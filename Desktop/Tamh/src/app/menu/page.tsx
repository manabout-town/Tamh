import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MenuBoard } from "@/components/menu/MenuBoard";
import type { Category, Menu } from "@/types/database";

export const dynamic = "force-dynamic";

async function getData(): Promise<{ categories: Category[]; menus: Menu[] }> {
  try {
    const supabase = createSupabaseServerClient();
    const [{ data: categories }, { data: menus }] = await Promise.all([
      supabase.from("categories").select("*").order("priority", { ascending: true }),
      supabase.from("menus").select("*").order("price", { ascending: true }),
    ]);
    return { categories: categories ?? [], menus: menus ?? [] };
  } catch {
    return { categories: [], menus: [] };
  }
}

export default async function MenuPage() {
  const { categories, menus } = await getData();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-serif text-xs uppercase tracking-widest2 text-gold">
            Menu Board
          </p>
          <h1 className="font-korean mt-2 text-5xl font-bold text-ivory">메뉴</h1>
        </div>
        <p className="font-korean text-sm text-ivory/50">
          가격을 탭하여 즉시 수정 · 우측 아이콘으로 품절 처리
        </p>
      </header>

      <MenuBoard categories={categories} menus={menus} />
    </div>
  );
}
