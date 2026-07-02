export interface FoodInfo {
  image: string;
  desc?: string;
}

export const FOOD_DATA: Record<string, FoodInfo> = {
  "쉐리아포카토": {
    image: "https://cdn.imweb.me/thumbnail/20240609/c963236134164.jpg",
    desc: "아이스크림 + 쉐리 에스프레소",
  },
  "아이스크림 크로플": {
    image: "https://cdn.imweb.me/thumbnail/20240609/d42ffba80db4a.jpg",
    desc: "크로와상 + 와플",
  },
  "그린 올리브": {
    image: "https://cdn.imweb.me/thumbnail/20240609/5a5b972e240dc.jpg",
  },
  "멜론하몽": {
    image: "https://cdn.imweb.me/thumbnail/20240609/df0d5dbda4159.jpg",
    desc: "이탈리아 하몽 + 메론",
  },
  "부라타 치즈샐러드": {
    image: "https://cdn.imweb.me/thumbnail/20240609/3bd221e58b0a8.jpg",
    desc: "부라타 치즈 + 루꼴라 샐러드",
  },
};
