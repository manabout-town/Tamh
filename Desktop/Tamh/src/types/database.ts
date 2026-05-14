/**
 * TÀMH — Database Type Definitions
 * POS 시스템(메뉴 + 매장 도면)용. Supabase 호환 형식.
 */

// =============================================================
// Enums
// =============================================================
export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLOSED";
export type TableShape = "rect" | "circle";
export type OrderStatus = "OPEN" | "CLOSED" | "CANCELED";

// =============================================================
// Domain entities (Row types)
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

export interface TableGroup {
  id: string;
  name: string | null;
  color: string;
  created_at: string;
}

export interface BarTable {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: TableShape;
  capacity: number;
  status: TableStatus;
  group_id: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  menu_id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  table_id: string | null;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================================
// Supabase-compatible Database schema
// (Tables · Views · Functions · Enums · CompositeTypes · Relationships)
// =============================================================
type NeverMap = { [_ in never]: never };

export type DatabaseSchema = {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Partial<Omit<Category, "id" | "created_at">> &
          Pick<Category, "name" | "priority"> & {
            id?: string;
            created_at?: string;
          };
        Update: Partial<Omit<Category, "id" | "created_at">>;
        Relationships: [];
      };
      menus: {
        Row: Menu;
        Insert: Partial<Omit<Menu, "id" | "created_at" | "updated_at">> &
          Pick<Menu, "category_id" | "name" | "price"> & {
            id?: string;
            created_at?: string;
            updated_at?: string;
          };
        Update: Partial<Omit<Menu, "id" | "created_at">>;
        Relationships: [];
      };
      table_groups: {
        Row: TableGroup;
        Insert: Partial<Omit<TableGroup, "id" | "created_at">> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<TableGroup, "id" | "created_at">>;
        Relationships: [];
      };
      tables: {
        Row: BarTable;
        Insert: Partial<Omit<BarTable, "id" | "created_at" | "updated_at">> &
          Pick<BarTable, "label"> & {
            id?: string;
            created_at?: string;
            updated_at?: string;
          };
        Update: Partial<Omit<BarTable, "id" | "created_at">>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Partial<Omit<Order, "id" | "created_at" | "updated_at">> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Order, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: NeverMap;
    Functions: NeverMap;
    Enums: {
      table_status: TableStatus;
      order_status: OrderStatus;
    };
    CompositeTypes: NeverMap;
  };
};
