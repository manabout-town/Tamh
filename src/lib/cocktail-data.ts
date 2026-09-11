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
    image: "/menu/soy-milk-high.jpg",
    desc: "bourbon, butterscotch etc.",
    alc: "10% alc./vol.",
  },
  "라프로익 패션드": {
    image: "/menu/laphroaig-fashioned.jpg",
  },
  "라프로익 페니실린": {
    image: "/menu/laphroaig-penicillin.jpg",
  },
  "비터진": {
    image: "/menu/bitter-gin.jpg",
  },
  "커피앤시가렛": {
    image: "/menu/coffee-and-cigarettes.jpg",
    desc: "라프로익베이스의 피트 칵테일, 템므만의 피트를 재해석한 시그니처 칵테일",
  },
  "갓파더": {
    image: "/menu/godfather.jpg",
    desc: "bourbon, disaronno etc.",
    alc: "33% alc./vol.",
  },
  "체리 올드패션드": {
    image: "/menu/cherry-old-fashioned.jpg",
    desc: "bourbon, angostura etc.",
    alc: "26% alc./vol.",
  },
  "와일드 플라워 쥴렙": {
    image: "/menu/wild-flower-julep.jpg",
  },
  "버진 베리 모히또": {
    image: "/menu/virgin-berry-mojito.jpg",
    desc: "논알콜 / 알콜 +3,000원",
  },
  "버진 라임 모히또": {
    image: "/menu/virgin-lime-mojito.jpg",
    desc: "논알콜 / 알콜 +3,000원",
  },
  "파우스트": {
    image: "/menu/faust.jpg",
  },
  "진토닉": {
    image: "/menu/gin-tonic.jpg",
  },
  "진피즈": {
    image: "/menu/gin-fizz.jpg",
  },
  "진리키": {
    image: "/menu/gin-rickey.jpg",
  },
  "다이키리": {
    image: "/menu/daiquiri.jpg",
  },
  "콜드브루 마티니": {
    image: "/menu/cold-brew-martini.jpg",
  },
};
