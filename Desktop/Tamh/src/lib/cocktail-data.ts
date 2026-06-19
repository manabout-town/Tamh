export interface CocktailInfo {
  image: string;
  desc?: string;
  alc?: string;
}

export const COCKTAIL_DATA: Record<string, CocktailInfo> = {
  "불오름": {
    image: "https://cdn.imweb.me/thumbnail/20260210/72a040093da62.jpg",
    desc: "Hazelnut, Lime etc.",
    alc: "15% alc./vol.",
  },
  "두유하이": {
    image: "https://cdn.imweb.me/thumbnail/20260210/87946912efaad.jpg",
    desc: "bourbon, butterscotch etc.",
    alc: "10% alc./vol.",
  },
  "라프로익 패션드": {
    image: "https://cdn.imweb.me/thumbnail/20260210/f926fab1042b7.jpg",
  },
  "라프로익 페니실린": {
    image: "https://cdn.imweb.me/thumbnail/20260210/ca9f7c5990613.jpg",
  },
  "비터진": {
    image: "https://cdn.imweb.me/thumbnail/20260210/71526f47e9660.jpg",
  },
  "커피앤시가렛": {
    image: "https://cdn.imweb.me/thumbnail/20260210/f25376f3afe91.jpg",
    desc: "라프로익베이스의 피트 칵테일, 템므만의 피트를 재해석한 시그니처 칵테일",
  },
  "갓파더": {
    image: "https://cdn.imweb.me/thumbnail/20240609/f8fa6c5070965.jpg",
    desc: "bourbon, disaronno etc.",
    alc: "33% alc./vol.",
  },
  "체리 올드패션드": {
    image: "https://cdn.imweb.me/thumbnail/20240609/b999cc178d4f4.jpg",
    desc: "bourbon, angostura etc.",
    alc: "26% alc./vol.",
  },
  "와일드 플라워 쥴렙": {
    image: "https://cdn.imweb.me/thumbnail/20250301/7abd0dbc60b22.jpg",
  },
  "버진 베리 모히또": {
    image: "https://cdn.imweb.me/thumbnail/20250302/d2c47b5d73cc1.jpg",
    desc: "논알콜 / 알콜 +3,000원",
  },
  "버진 라임 모히또": {
    image: "https://cdn.imweb.me/thumbnail/20250302/181750e136b2e.jpg",
    desc: "논알콜 / 알콜 +3,000원",
  },
  "파우스트": {
    image: "https://cdn.imweb.me/thumbnail/20250302/6a0344bd1efcd.jpg",
  },
  "진토닉": {
    image: "https://cdn.imweb.me/thumbnail/20250918/7dc7080982c16.jpg",
  },
  "진피즈": {
    image: "https://cdn.imweb.me/thumbnail/20250918/b3035039162e0.jpg",
  },
  "진리키": {
    image: "https://cdn.imweb.me/thumbnail/20250918/252f3a4f6431d.jpg",
  },
  "다이키리": {
    image: "https://cdn.imweb.me/thumbnail/20250918/625f168c95e2a.jpg",
  },
  "콜드브루 마티니": {
    image: "https://cdn.imweb.me/thumbnail/20250918/6885ba57c0ac7.jpg",
  },
};
