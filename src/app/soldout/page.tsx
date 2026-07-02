import { db } from "@/lib/static-db";
import { SoldoutBoard } from "@/components/menu/SoldoutBoard";

export const dynamic = "force-dynamic";

export default async function SoldoutPage() {
  const categories = db.getCategories();
  const menus = db.getMenus();
  return <SoldoutBoard categories={categories} menus={menus} />;
}
