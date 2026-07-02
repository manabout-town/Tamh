import { db } from "@/lib/static-db";
import { MenuBoard } from "@/components/menu/MenuBoard";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const categories = db.getCategories();
  const menus = db.getMenus();
  return <MenuBoard categories={categories} menus={menus} />;
}
