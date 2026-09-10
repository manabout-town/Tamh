import { getCategories, getMenus } from "@/lib/menu-store";
import { MenuBoard } from "@/components/menu/MenuBoard";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [categories, menus] = await Promise.all([getCategories(), getMenus()]);
  return <MenuBoard categories={categories} menus={menus} />;
}
