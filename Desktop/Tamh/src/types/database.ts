/**
 * TÀMH — Database Type Definitions
 * 메뉴판 전용. 매장(POS) 기능은 제거되었습니다.
 */

// =============================================================
// Domain entities
// =============================================================
export interface Category {
  id: string;
  name: string;
  priority: number;
  subtitle: string | null;
  icon: string | null;
  created_at: string;
}

export interface Menu {
  id: string;
  category_id: string;
  name: string;
  name_ko: string | null;
  description: string | null;
  price: number;
  bottle_price: number | null;
  image_url: string | null;
  is_active: boolean;
  is_recommended: boolean;
  origin: string | null;
  abv: number | null;
  cask_type: string | null;
  created_at: string;
  updated_at: string;
}
