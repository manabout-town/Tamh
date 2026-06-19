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
    return {
      categories: (categories as Category[]) ?? [],
      menus: (menus as Menu[]) ?? [],
    };
  } catch {
    return { categories: [], menus: [] };
  }
}

export default async function MenuPage() {
  const { categories, menus } = await getData();
  return <MenuBoard categories={categories} menus={menus} />;
}
