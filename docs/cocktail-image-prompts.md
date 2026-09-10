# 칵테일 사진 생성 프롬프트 (15종)

커피앤시가렛은 매장 실사진으로 교체 완료, 불오름은 기존 사진 유지.
아래는 나머지 15종용 프롬프트입니다.

## 공통 스타일

커피앤시가렛 사진의 분위기에 맞췄습니다. 모든 프롬프트 앞이나 뒤에 붙이세요.

```
Moody low-key bar photography, single warm tungsten light from the upper left,
deep shadows, dark background with out-of-focus whisky bottles,
drink resting on crumpled off-white paper, shallow depth of field,
fine film grain, warm amber color grade, square 1:1 crop, no text, no watermark, no people
```

권장 설정: 모델 `nano_banana_pro` (Google), 화면비 `1:1`, 해상도 `2k`.

## 클래식 10종

정해진 모습이 있는 칵테일입니다. 잔·가니시·색을 정확히 지정했습니다.

| 메뉴 | 프롬프트 (공통 스타일과 함께 사용) |
|------|------|
| Godfather 갓파더 | Rocks glass with one large clear ice sphere, deep amber bourbon and amaretto, no garnish, condensation on the glass |
| Cherry Old Fashioned 체리 올드패션드 | Rocks glass with one large clear ice cube, amber bourbon, a dark brandied cherry on a pick and a wide orange peel twist |
| Wild Flower Julep 와일드 플라워 쥴렙 | Frosted silver julep cup packed with crushed ice, a tall bouquet of fresh mint and small edible wildflowers, frost beading on the metal |
| Virgin Berry Mojito 버진 베리 모히또 | Tall highball with crushed ice, deep red berry gradient fading to pink at the top, fresh raspberries and blackberries, mint sprig, lime wedge |
| Virgin Lime Mojito 버진 라임 모히또 | Tall highball with crushed ice, pale green, lime wheels pressed against the glass, a full mint sprig, soda bubbles |
| Gin & Tonic 진토닉 | Balloon copa glass, crystal clear gin and tonic, large clear ice cubes, a single lime wedge, dense rising bubbles |
| Gin Fizz 진피즈 | Tall chilled highball, pale cloudy gin fizz with a thick smooth white foam head rising above the rim, lemon twist |
| Gin Rickey 진리키 | Slim highball, crystal clear, two squeezed lime halves among clear ice, soda bubbles, no syrup color |
| Daiquiri 다이키리 | Chilled coupe glass, no ice, pale straw colored daiquiri, a thin lime wheel on the rim, tiny surface bubbles |
| Cold Brew Martini 콜드브루 마티니 | Chilled coupe glass, dark espresso brown cocktail with a fine pale crema foam on top, three coffee beans centered on the foam |

## 시그니처 5종

TÀMH 자체 칵테일이라 표준 형태가 없습니다. 웹서치로는 자료가 나오지 않았습니다.
아래는 메뉴 설명에서 유추한 안이며, **실물과 다를 수 있으니 확인이 필요합니다.**

| 메뉴 | 근거 | 프롬프트 (공통 스타일과 함께 사용) |
|------|------|------|
| 두유하이 | 이름 + "bourbon, butterscotch etc." | Tall highball with a long clear ice column, opaque creamy beige soy-milk highball, silky surface, no garnish |
| 라프로익 패션드 | 라프로익 베이스 올드패션드 | Rocks glass with one large clear ice cube, smoky deep amber whisky, a wide lemon peel twist, faint smoke haze above the glass |
| 라프로익 페니실린 | 페니실린 (스카치·꿀·생강·레몬 + 라프로익 플롯) | Rocks glass with one large clear ice cube, golden honey-ginger whisky, a piece of candied ginger on the rim |
| 비터진 | 진 + 비터스 | Rocks glass with clear ice, gin tinted rust red by aromatic bitters, a long orange peel twist |
| 파우스트 | "바텐더의 시그니처 한 잔" | Chilled coupe glass, very dark garnet cocktail with a glossy surface, a single wide flamed orange peel |

## 넣는 방법

1. 생성한 이미지를 정사각형 1200x1200 JPEG로 저장합니다.
2. `public/menu/` 에 영문 파일명으로 넣습니다 (예: `gin-tonic.jpg`).
3. 메뉴판 관리자 모드에서 카드를 눌러 `주소 입력`에 `/menu/gin-tonic.jpg` 를 넣고 저장합니다.
   또는 `src/lib/cocktail-data.ts` 의 예비값도 같이 맞춰둡니다.
