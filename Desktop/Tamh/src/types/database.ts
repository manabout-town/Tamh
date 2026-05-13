/**
 * TÀMH — Database Type Definitions
 *
 * Supabase 테이블에 1:1 매핑되는 타입 모음.
 * Supabase CLI로 자동 생성하길 권장하지만(`supabase gen types typescript`),
 * 초기 셋업 단계에서 수동 정의해두면 컴파일 안정성이 올라간다.
 */

// =============================================================
// Enum types
// =============================================================
export type OrderStatus = "PENDING" | "SERVED" | "PAID" | "CANCELED";

// =============================================================
// Domain entities
// =============================================================
export interface Category {
  id: string;
  name: string;
  /** 낮을수록 상단에 노출 (예: Signature=0, Single Malt=10, Cocktail=20 …) */
  priority: number;
  /** 영문/한글 부제 (e.g. "Single Malt Whisky") */
  subtitle: string | null;
  /** 카테고리 아이콘 키 (lucide-react 이름) */
  icon: string | null;
  created_at: string;
}

export interface Menu {
  id: string;
  category_id: string;
  name: string;
  /** 한글 표기 (예: "맥켈란 12년") */
  name_ko: string | null;
  /** 우아한 문체의 설명문 — Gemini로 자동 생성 가능 */
  description: string | null;
  /** 30ml 잔 가격 (KRW) */
  price: number;
  /** 보틀 가격 (KRW) — nullable (잔 전용 메뉴 대응) */
  bottle_price: number | null;
  image_url: string | null;
  /** 표시 여부 */
  is_active: boolean;
  /** 시그니처/추천 메뉴 강조 */
  is_recommended: boolean;
  /** 도수, 지역 등 부가 정보 */
  origin: string | null;
  abv: number | null;
  cask_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  menu_id: string;
  name: string;
  price: number;
  quantity: number;
  /** 옵션 메모 (e.g. "얼음 X", "물 1방울") */
  note?: string;
}

export interface Order {
  id: string;
  table_number: number;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  /** 주문자 메모 */
  memo: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================================
// Supabase database schema (typed)
// =============================================================
export type DatabaseSchema = {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Category, "id" | "created_at">>;
      };
      menus: {
        Row: Menu;
        Insert: Omit<Menu, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Menu, "id" | "created_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Order, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
    };
  };
};

// =============================================================
// Composite (UI-friendly) types
// =============================================================
export interface MenuWithCategory extends Menu {
  category: Pick<Category, "id" | "name" | "subtitle" | "priority">;
}

export interface CategoryWithMenus extends Category {
  menus: Menu[];
}
