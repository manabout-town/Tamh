import { getCategories, getMenus } from "@/lib/menu-store";
import { SoldoutBoard } from "@/components/menu/SoldoutBoard";

export const dynamic = "force-dynamic";

export default async function SoldoutPage() {
  const [categories, menus] = await Promise.all([getCategories(), getMenus()]);
  return <SoldoutBoard categories={categories} menus={menus} />;
}
