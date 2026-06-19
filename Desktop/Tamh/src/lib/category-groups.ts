/**
 * TÀMH — 카테고리 그룹 정의
 * 큰 탭 3개(위스키/칵테일/푸드) → 서브 태그(시그니처/국가/지역) 매핑.
 */

export type GroupKey = "whisky" | "cocktail" | "food";

export interface GroupDef {
  key: GroupKey;
  label: string;             // 한글 라벨
  sub: string;               // 영문 부제
  categoryNames: string[];   // 이 그룹에 속하는 카테고리 영문명
}

/**
 * Whisky 그룹은 시그니처(Signature, Random Whisky) 먼저 → 지역/국가별 순.
 * 이 배열의 순서가 서브 태그의 정렬 순서가 됩니다.
 */
export const PRIMARY_GROUPS: GroupDef[] = [
  {
    key: "whisky",
    label: "위스키",
    sub: "Whisky",
    categoryNames: [
      "Signature",
      "Random Whisky",
      "Highland",
      "Speyside",
      "Campbeltown",
      "Islay",
      "Island",
      "Blended",
      "Bourbon",
      "Japan",
      "Australia",
      "India",
      "Taiwan",
      "Brandy",
    ],
  },
  {
    key: "cocktail",
    label: "칵테일",
    sub: "Cocktail",
    categoryNames: ["Cocktail"],
  },
  {
    key: "food",
    label: "푸드",
    sub: "Food",
    categoryNames: ["Food"],
  },
];

/**
 * 카테고리 이름이 어떤 그룹에 속하는지 빠르게 찾기.
 * 매핑에 없는 카테고리는 기본적으로 whisky 그룹으로 분류 (안전한 fallback).
 */
export function groupOf(categoryName: string): GroupKey {
  for (const g of PRIMARY_GROUPS) {
    if (g.categoryNames.includes(categoryName)) return g.key;
  }
  return "whisky";
}
