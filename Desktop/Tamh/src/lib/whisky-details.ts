/**
 * TÀMH — Whisky Detail Content (customer-fit description / tags / similar items)
 * Auto-generated content module. Keyed by exact `menus.name` value.
 * Used by CleanMenuRow's "Detail" toggle. Purely additive — does not touch Supabase schema.
 */

export interface WhiskyDetail {
  desc: string;
  tags: string[];
  similar: string[];
}

export const WHISKY_DETAILS: Record<string, WhiskyDetail> = {
  "Royal Salute 21y (Weekly)": {
    desc: "21년 숙성 블렌디드의 정수, 벌꿀과 오렌지 껍질, 부드러운 오크가 입안 가득 퍼지는 위클리 한정 1잔.",
    tags: ["한정판·희소가치 선호", "셰리캐스크·단맛 선호", "묵직한 디저트 페어링"],
    similar: ["Royal Salute 21y", "Royal Salute 25y", "Ballantine's 30y (Weekly)"],
  },
  "Ballantine's 30y (Weekly)": {
    desc: "몰트와 그레인의 정교한 블렌딩, 다크 초콜릿과 건포도, 긴 여운의 우디함이 돋보이는 프레스티지 한 잔.",
    tags: ["한정판·희소가치 선호", "우디·스파이시 선호", "묵직한 디저트 페어링"],
    similar: ["Royal Salute 21y (Weekly)", "Ballantine's 30y", "Royal Salute 25y"],
  },
  "Octomore .1.2 (Weekly)": {
    desc: "세계 최고 피트 함량급 옥토모어를 30ml로 가볍게 — 타르, 캠프파이어 스모크가 폭발적으로 밀려온다.",
    tags: ["피트·스모키 애호가", "카스크스트랭스(고도수) 선호", "개성파·실험적 풍미 선호"],
    similar: ["Octomore 14.2", "Octomore 14.1", "Ardbeg Corryvreckan"],
  },
  "Royal Brackla 21y (Weekly)": {
    desc: "'왕실의 몰트'라 불리는 로얄브라큘라의 21년, 과일 향과 스파이시한 오크가 정교하게 균형 잡힌 한 잔.",
    tags: ["한정판·희소가치 선호", "우디·스파이시 선호", "시트러스·산미 선호"],
    similar: ["Glenfiddich 23y (Weekly)", "Dalmore 18y", "Glenrothes 18y"],
  },
  "Glenfiddich 23y (Weekly)": {
    desc: "버번·셰리·럼 캐스크를 거친 그랑레저브, 트로피컬 과일과 캐러멜이 화려하게 피어나는 위클리 스페셜.",
    tags: ["한정판·희소가치 선호", "트로피컬 과일향 선호", "셰리캐스크·단맛 선호"],
    similar: ["Glenfiddich 21y", "Glenfiddich 18y", "Royal Brackla 21y (Weekly)"],
  },
  "Random Whisky": {
    desc: "오늘은 어떤 위스키가 나올까 — 가볍게 즐기는 깜짝 1+1 이벤트용 한 잔.",
    tags: ["가벼운 입문용", "가성비 선호", "하이볼·가볍게"],
    similar: ["Monkey Shoulder", "Glen Grant 10y", "Speyburn 10y"],
  },
  "Deanston 12y": {
    desc: "버번 캐스크 숙성으로 꿀, 바닐라, 가벼운 시트러스가 산뜻하게 느껴지는 입문용 하이랜드 몰트.",
    tags: ["가벼운 입문용", "버번·바닐라 선호", "가성비 선호"],
    similar: ["Glenmorangie Original", "AnCnoc 12y", "Tomatin 12y"],
  },
  "Glenmorangie Original": {
    desc: "레몬, 복숭아, 바닐라가 가볍게 어우러지는 플로럴하고 산뜻한 하이랜드 스탠다드.",
    tags: ["가벼운 입문용", "시트러스·산미 선호", "하이볼·가볍게"],
    similar: ["Deanston 12y", "AnCnoc 12y", "Glenmorangie Lasanta"],
  },
  "AnCnoc 12y": {
    desc: "꿀과 사과, 약간의 몰트 단맛이 부드럽게 퍼지는 가볍고 우아한 하이랜드 몰트.",
    tags: ["가벼운 입문용", "시트러스·산미 선호", "가성비 선호"],
    similar: ["Glenmorangie Original", "Old Pulteney 12y", "Balblair 12y"],
  },
  "Old Pulteney 12y": {
    desc: "바다 소금기와 토피, 가벼운 과일향이 함께 느껴지는 해안가 하이랜드 몰트.",
    tags: ["오일리·해양성 선호", "가벼운 입문용", "가성비 선호"],
    similar: ["Balblair 12y", "AnCnoc 12y", "Arran 10y"],
  },
  "Glenfarclas 8y": {
    desc: "셰리 캐스크 숙성 특유의 건포도와 캐러멜 단맛이 어린 연차에도 또렷하게 드러나는 몰트.",
    tags: ["셰리캐스크·단맛 선호", "가성비 선호", "가벼운 입문용"],
    similar: ["Glenfarclas 10y", "Glenfarclas 12y", "Aberlour Double Cask 12y"],
  },
  "Tomatin 12y": {
    desc: "버번·셰리 캐스크의 조화로 꿀, 바닐라, 살짝의 견과류 향이 부드럽게 퍼지는 몰트.",
    tags: ["가벼운 입문용", "셰리캐스크·단맛 선호", "가성비 선호"],
    similar: ["Deanston 12y", "Tomatin 15y", "Glen Grant 12y"],
  },
  "Dalwhinnie 15y": {
    desc: "스코틀랜드에서 가장 높은 고지대 증류소답게 헤더 꽃향과 꿀, 가벼운 스모크가 우아하게 어우러진다.",
    tags: ["가벼운 입문용", "시트러스·산미 선호", "가성비 선호"],
    similar: ["Glenmorangie Original", "Oban 14y", "Old Pulteney 12y"],
  },
  "Balblair 12y": {
    desc: "버번 캐스크 숙성의 바닐라, 토피와 함께 은은한 짠맛이 느껴지는 해안가 하이랜드 몰트.",
    tags: ["오일리·해양성 선호", "가벼운 입문용", "가성비 선호"],
    similar: ["Old Pulteney 12y", "AnCnoc 12y", "Arran 10y"],
  },
  "Glenfarclas 10y": {
    desc: "셰리 캐스크 100% 숙성, 건포도와 다크 캐러멜의 진한 단맛이 매력적인 가성비 셰리밤.",
    tags: ["셰리캐스크·단맛 선호", "가성비 선호", "묵직한 디저트 페어링"],
    similar: ["Glenfarclas 8y", "Glenfarclas 12y", "Macallan Sherry Cask 12y"],
  },
  "Glengoyne 12y": {
    desc: "피트를 전혀 쓰지 않는 증류소답게 몰트 본연의 꿀과 과일, 가벼운 견과류 풍미가 깨끗하게 드러난다.",
    tags: ["가벼운 입문용", "시트러스·산미 선호", "가성비 선호"],
    similar: ["Glengoyne 15y", "Dalwhinnie 15y", "Tomatin 12y"],
  },
  "Dalmore 12y": {
    desc: "오렌지 껍질, 다크 초콜릿, 셰리 단맛이 묵직하게 깔리는 달모어 시그니처 스타일의 입문 라인.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "우디·스파이시 선호"],
    similar: ["Dalmore CigarMalt", "Dalmore 15y", "Glendronach 12y"],
  },
  "Glenmorangie Lasanta": {
    desc: "올로로소 셰리 캐스크 피니시로 오리지널보다 한층 진한 건과일과 캐러멜 단맛이 더해진다.",
    tags: ["셰리캐스크·단맛 선호", "가벼운 입문용", "트로피컬 과일향 선호"],
    similar: ["Glenmorangie Original", "Glenmorangie Quinta Ruban", "Aberlour Double Cask 12y"],
  },
  "Oban 14y": {
    desc: "바다 소금기와 가벼운 스모크, 오렌지 마멀레이드가 함께 느껴지는 웨스트 하이랜드 코스탈 몰트.",
    tags: ["오일리·해양성 선호", "피트·스모키 애호가", "시트러스·산미 선호"],
    similar: ["Old Pulteney 12y", "Talisker 10y", "Arran 10y"],
  },
  "Tomatin 15y": {
    desc: "셰리 캐스크 피니시로 한층 깊어진 건과일 단맛과 부드러운 오크가 길게 이어지는 몰트.",
    tags: ["셰리캐스크·단맛 선호", "가성비 선호", "우디·스파이시 선호"],
    similar: ["Tomatin 12y", "Glenfarclas 12y", "Aberlour Double Cask 14y"],
  },
  "Glenfarclas 12y": {
    desc: "셰리 캐스크 풀숙성의 정석 — 건포도, 시나몬, 다크 캐러멜이 묵직하게 퍼지는 셰리밤 스타일.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "가성비 선호"],
    similar: ["Glenfarclas 10y", "Glenfarclas 15y", "Aberlour Double Cask 12y"],
  },
  "Glendronach 12y": {
    desc: "올로로소 + PX 셰리 캐스크 더블 숙성, 진한 건포도와 토피 단맛이 풍부한 셰리 캐스크 대표 몰트.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "가성비 선호"],
    similar: ["Glendronach 8y Hielan", "Glendronach PortWood", "Dalmore 12y"],
  },
  "Glendronach 8y Hielan": {
    desc: "버번+셰리 혼합 캐스크로 한층 가볍고 산뜻하게 즐기는 글렌드로낙 엔트리 라인.",
    tags: ["가벼운 입문용", "셰리캐스크·단맛 선호", "가성비 선호"],
    similar: ["Glendronach 12y", "Glendronach Peated", "BenRiach 12y"],
  },
  "Glendronach Peated": {
    desc: "글렌드로낙답지 않게 은은한 피트 스모크와 셰리 단맛이 동시에 느껴지는 개성 있는 라인업.",
    tags: ["피트·스모키 애호가", "셰리캐스크·단맛 선호", "개성파·실험적 풍미 선호"],
    similar: ["Glendronach 12y", "BenRiach 12y", "Benromach 10y"],
  },
  "Glenmorangie Quinta Ruban": {
    desc: "포트 캐스크 피니시로 베리류 과일과 다크 초콜릿의 달콤함이 진하게 더해진 몰트.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "트로피컬 과일향 선호"],
    similar: ["Glenmorangie Lasanta", "Arran Port Cask Finish", "Balvenie Madeira Cask 15y"],
  },
  "Glenfarclas 15y": {
    desc: "12년보다 한층 깊어진 셰리 단맛과 스파이시한 오크가 길게 이어지는 균형 잡힌 몰트.",
    tags: ["셰리캐스크·단맛 선호", "우디·스파이시 선호", "묵직한 디저트 페어링"],
    similar: ["Glenfarclas 12y", "Glendronach 15y", "GlenAllachie 15y"],
  },
  "Glenfarclas 105 CS": {
    desc: "60도에 가까운 캐스크 스트랭스, 셰리 단맛과 강렬한 알코올 파워를 동시에 즐기는 마니아용 몰트.",
    tags: ["카스크스트랭스(고도수) 선호", "셰리캐스크·단맛 선호", "개성파·실험적 풍미 선호"],
    similar: ["GlenAllachie 10y CS", "Glenfarclas 12y CS", "Aberlour A'bunadh"],
  },
  "Glengoyne 15y": {
    desc: "셰리 캐스크 비중이 높아진 15년, 꿀과 견과류에 건포도 단맛이 더해진 부드러운 몰트.",
    tags: ["셰리캐스크·단맛 선호", "가벼운 입문용", "묵직한 디저트 페어링"],
    similar: ["Glengoyne 12y", "Glengoyne 18y", "Aberlour Double Cask 14y"],
  },
  "Glenmorangie Nectar D'Or": {
    desc: "소테른 와인 캐스크 피니시로 살구, 꿀, 크렘 브륄레 같은 화려한 단맛이 도드라지는 몰트.",
    tags: ["셰리캐스크·단맛 선호", "트로피컬 과일향 선호", "묵직한 디저트 페어링"],
    similar: ["Glenmorangie Signet", "Arran Sauternes Cask Finish", "Balvenie Madeira Cask 15y"],
  },
  "Glendronach PortWood": {
    desc: "포트 와인 캐스크 숙성으로 베리류 과일잼과 다크 초콜릿 풍미가 진하게 묻어나는 몰트.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "트로피컬 과일향 선호"],
    similar: ["Glenmorangie Quinta Ruban", "Glendronach 12y", "Balvenie Portwood Cask 21y"],
  },
  "Glenfarclas 12y CS": {
    desc: "12년 원액을 캐스크 스트랭스 그대로 — 셰리 단맛과 묵직한 보디감이 강렬하게 다가온다.",
    tags: ["카스크스트랭스(고도수) 선호", "셰리캐스크·단맛 선호", "개성파·실험적 풍미 선호"],
    similar: ["Glenfarclas 105 CS", "Glenlivet 13y CS", "GlenAllachie 10y CS"],
  },
  "Glendronach 15y": {
    desc: "올로로소 셰리로만 숙성된 '레볼루션', 다크 초콜릿과 에스프레소 같은 깊은 풍미가 인상적이다.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "우디·스파이시 선호"],
    similar: ["Glenfarclas 15y", "Glendronach 16y", "Aberlour A'bunadh"],
  },
  "Dalmore CigarMalt": {
    desc: "이름처럼 시가와 함께 즐기기 좋은 다크 초콜릿, 에스프레소, 스파이스의 묵직한 몰트.",
    tags: ["묵직한 디저트 페어링", "우디·스파이시 선호", "셰리캐스크·단맛 선호"],
    similar: ["Dalmore 12y", "Dalmore 15y", "Glendronach 16y"],
  },
  "Dalmore 15y": {
    desc: "셰리, 버번, 마데이라 캐스크를 거쳐 오렌지, 초콜릿, 헤이즐넛이 층층이 쌓이는 풍부한 몰트.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "트로피컬 과일향 선호"],
    similar: ["Dalmore CigarMalt", "Dalmore 18y", "Glenrothes 18y"],
  },
  "Glendronach CS": {
    desc: "캐스크 스트랭스 도수에서 폭발하는 진한 셰리 단맛과 스파이스, 마니아를 위한 강렬한 한 잔.",
    tags: ["카스크스트랭스(고도수) 선호", "셰리캐스크·단맛 선호", "개성파·실험적 풍미 선호"],
    similar: ["Glenfarclas 105 CS", "Aberlour A'bunadh", "GlenAllachie 10y CS"],
  },
  "Glengoyne 18y": {
    desc: "오랜 셰리 숙성으로 진한 건과일, 시나몬, 가죽 향까지 더해진 글렌고인의 플래그십 라인.",
    tags: ["셰리캐스크·단맛 선호", "우디·스파이시 선호", "묵직한 디저트 페어링"],
    similar: ["Glengoyne 15y", "Glendronach 16y", "GlenAllachie 18y"],
  },
  "Glenmorangie Signet": {
    desc: "초콜릿 몰트를 사용한 독특한 양조법으로 에스프레소, 다크 초콜릿의 진한 풍미가 매력적인 프레스티지 몰트.",
    tags: ["개성파·실험적 풍미 선호", "묵직한 디저트 페어링", "한정판·희소가치 선호"],
    similar: ["Glenmorangie Nectar D'Or", "Dalmore CigarMalt", "GlenAllachie Sinteis 2015"],
  },
  "Glendronach 16y": {
    desc: "'에이지드 인 셰리' 시리즈, 16년의 숙성이 더한 깊고 부드러운 건과일·오크 풍미.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "우디·스파이시 선호"],
    similar: ["Glengoyne 18y", "Glendronach 15y", "GlenAllachie 18y"],
  },
  "Dalmore 18y": {
    desc: "마투살렘 셰리 캐스크 피니시까지 거친 플래그십, 에스프레소와 다크 체리의 깊은 단맛이 일품.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "한정판·희소가치 선호"],
    similar: ["Dalmore 15y", "Glenrothes 18y", "Balvenie PX Cask 18y"],
  },
  "Glenfarclas Family 2000": {
    desc: "글렌파클라스 패밀리 캐스크 시리즈, 빈티지 원액 특유의 깊고 클래식한 셰리 풍미를 그대로 담았다.",
    tags: ["한정판·희소가치 선호", "셰리캐스크·단맛 선호", "우디·스파이시 선호"],
    similar: ["Glenfarclas 25y", "Glendronach 2008", "GlenAllachie Sinteis 2015"],
  },
  "Glenfarclas 25y": {
    desc: "25년 셰리 숙성의 깊이, 다크 초콜릿과 무화과, 가죽까지 복합적으로 펼쳐지는 올드 스타일 몰트.",
    tags: ["한정판·희소가치 선호", "셰리캐스크·단맛 선호", "묵직한 디저트 페어링"],
    similar: ["Glenfarclas Family 2000", "Glendronach 21y", "Macallan Sherry Cask 18y"],
  },
  "Glendronach 21y": {
    desc: "'패러렐 53'으로 불리던 올드 보틀링 계보, 진하고 클래식한 셰리밤의 정점.",
    tags: ["한정판·희소가치 선호", "셰리캐스크·단맛 선호", "묵직한 디저트 페어링"],
    similar: ["Glenfarclas 25y", "Macallan Sherry Cask 18y", "Balvenie Single Barrel 15y Sherry"],
  },
  "Glendronach 2008": {
    desc: "빈티지 표기 싱글 캐스크, 특정 연도 원액 고유의 개성 있는 풍미를 즐길 수 있는 한정 보틀링.",
    tags: ["한정판·희소가치 선호", "개성파·실험적 풍미 선호", "셰리캐스크·단맛 선호"],
    similar: ["GlenAllachie Sinteis 2015", "Glenfarclas Family 2000", "Glendronach 21y"],
  },
  "Glen Grant 10y": {
    desc: "사과, 배 같은 가벼운 과일향과 깔끔한 몰트 단맛이 특징인 캐주얼한 입문용 스페이사이드.",
    tags: ["가벼운 입문용", "가성비 선호", "하이볼·가볍게"],
    similar: ["Speyburn 10y", "Glen Grant 12y", "Glenlivet 12y"],
  },
  "Monkey Shoulder": {
    desc: "3개 스페이사이드 몰트를 블렌딩한 부드럽고 가벼운 스타일, 하이볼로 즐기기 좋다.",
    tags: ["하이볼·가볍게", "가벼운 입문용", "가성비 선호"],
    similar: ["Glen Grant 10y", "Speyburn 10y", "Johnnie Walker Black Label"],
  },
  "Speyburn 10y": {
    desc: "꿀과 바닐라, 가벼운 시트러스가 산뜻하게 느껴지는 가성비 좋은 스페이사이드 몰트.",
    tags: ["가벼운 입문용", "가성비 선호", "시트러스·산미 선호"],
    similar: ["Glen Grant 10y", "Monkey Shoulder", "Glenrothes 12y"],
  },
  "The Singleton Dufftown 12y": {
    desc: "꿀, 사과, 시나몬 풍미가 부드럽게 어우러지는 마시기 편한 스페이사이드 스탠다드.",
    tags: ["가벼운 입문용", "가성비 선호", "시트러스·산미 선호"],
    similar: ["Cragganmore 12y", "Glenfiddich 12y", "Glenrothes 12y"],
  },
  "Cragganmore 12y": {
    desc: "허브와 가벼운 스모크, 과일향이 복합적으로 느껴지는 클래식 스페이사이드 블렌딩 몰트의 핵심 원액.",
    tags: ["가벼운 입문용", "개성파·실험적 풍미 선호", "시트러스·산미 선호"],
    similar: ["The Singleton Dufftown 12y", "Glenrothes 12y", "BenRiach 12y"],
  },
  "Glenrothes 12y": {
    desc: "오렌지, 바닐라, 가벼운 셰리 단맛이 깔끔하게 어우러지는 균형 잡힌 스페이사이드 몰트.",
    tags: ["가벼운 입문용", "시트러스·산미 선호", "가성비 선호"],
    similar: ["Glenfiddich 12y", "Glen Grant 12y", "Glenrothes WMC"],
  },
  "Glenfiddich 12y": {
    desc: "배, 사과 같은 가벼운 과일향과 부드러운 오크가 특징인 세계에서 가장 잘 알려진 싱글몰트.",
    tags: ["가벼운 입문용", "가성비 선호", "시트러스·산미 선호"],
    similar: ["Glenrothes 12y", "Glen Grant 12y", "Glenlivet 12y"],
  },
  "Glen Grant 12y": {
    desc: "10년보다 한층 부드러워진 바닐라와 사과 풍미, 깨끗하고 가벼운 음용감이 특징.",
    tags: ["가벼운 입문용", "가성비 선호", "하이볼·가볍게"],
    similar: ["Glen Grant 10y", "Glenfiddich 12y", "Glenlivet 12y"],
  },
  "Glenlivet 12y": {
    desc: "파인애플, 배 같은 산뜻한 과일향과 가벼운 꽃향이 특징인 스페이사이드의 정석 스타일.",
    tags: ["가벼운 입문용", "시트러스·산미 선호", "가성비 선호"],
    similar: ["Glenfiddich 12y", "Glen Grant 12y", "Aberlour Double Cask 12y"],
  },
  "BenRiach 12y": {
    desc: "버번·셰리·버건디 캐스크를 거쳐 과일, 꿀, 은은한 스모크까지 다채로운 풍미를 보여준다.",
    tags: ["개성파·실험적 풍미 선호", "셰리캐스크·단맛 선호", "트로피컬 과일향 선호"],
    similar: ["Glendronach Peated", "Benromach 10y", "GlenAllachie 12y"],
  },
  "Benromach 10y": {
    desc: "전통 방식 증류로 만든 묵직한 보디감에 가벼운 스모크와 셰리 단맛이 어우러진 개성 있는 몰트.",
    tags: ["개성파·실험적 풍미 선호", "피트·스모키 애호가", "가성비 선호"],
    similar: ["BenRiach 12y", "Glendronach Peated", "GlenAllachie 12y"],
  },
  "Aberlour Double Cask 12y": {
    desc: "셰리와 버번 캐스크의 조화로 캐러멜, 건포도, 바닐라가 부드럽게 어우러지는 인기 스테디셀러.",
    tags: ["셰리캐스크·단맛 선호", "가벼운 입문용", "가성비 선호"],
    similar: ["Glenlivet 12y", "Macallan Double Cask 12y", "Balvenie DoubleWood 12y"],
  },
  "Macallan Double Cask 12y": {
    desc: "유러피언+아메리칸 오크 셰리 캐스크의 조화, 바닐라와 생강빵 풍미가 산뜻하게 어우러진다.",
    tags: ["셰리캐스크·단맛 선호", "가벼운 입문용", "트로피컬 과일향 선호"],
    similar: ["Aberlour Double Cask 12y", "Macallan Sherry Cask 12y", "Macallan Triple Cask 12y"],
  },
  "Balvenie DoubleWood 12y": {
    desc: "버번 캐스크 숙성 후 셰리 캐스크에서 피니시 — 꿀과 바닐라에 견과류 단맛이 더해진 클래식.",
    tags: ["셰리캐스크·단맛 선호", "가벼운 입문용", "가성비 선호"],
    similar: ["Aberlour Double Cask 12y", "Balvenie Single Barrel 12y", "Macallan Double Cask 12y"],
  },
  "Macallan Sherry Cask 12y": {
    desc: "100% 셰리 캐스크 숙성, 건포도와 오렌지 마멀레이드의 진한 단맛이 인상적인 맥켈란 클래식.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "트로피컬 과일향 선호"],
    similar: ["Glenfarclas 10y", "Macallan Double Cask 12y", "Aberlour A'bunadh"],
  },
  "Glen Grant 15y": {
    desc: "12년보다 한층 깊어진 바닐라, 캐러멜 단맛과 부드러운 오크 피니시가 특징.",
    tags: ["가벼운 입문용", "가성비 선호", "셰리캐스크·단맛 선호"],
    similar: ["Glen Grant 12y", "Tomatin 15y", "Glenlivet 15y"],
  },
  "Macallan Triple Cask 12y": {
    desc: "셰리·버번·리필 캐스크 3종 블렌딩으로 가벼운 단맛과 부드러운 균형감을 강조한 라인.",
    tags: ["가벼운 입문용", "셰리캐스크·단맛 선호", "가성비 선호"],
    similar: ["Macallan Double Cask 12y", "Macallan Sherry Cask 12y", "Aberlour Double Cask 12y"],
  },
  "Glenfiddich 15y": {
    desc: "솔레라 베팅 공법으로 만든 부드럽고 일관된 풍미, 꿀과 바닐라, 가벼운 스파이스가 어우러진다.",
    tags: ["가벼운 입문용", "우디·스파이시 선호", "가성비 선호"],
    similar: ["Glenfiddich 12y", "Glenlivet 15y", "Glenfiddich 18y"],
  },
  "Glenlivet 15y": {
    desc: "프렌치 오크 숙성으로 한층 스파이시해진 풍미, 바닐라와 견과류 단맛이 조화롭다.",
    tags: ["우디·스파이시 선호", "가벼운 입문용", "가성비 선호"],
    similar: ["Glenfiddich 15y", "Glenlivet 18y", "GlenAllachie 12y"],
  },
  "GlenAllachie 12y": {
    desc: "버번·셰리·버진오크 등 다양한 캐스크를 거쳐 과일, 견과류, 스파이스가 풍성하게 느껴지는 몰트.",
    tags: ["개성파·실험적 풍미 선호", "셰리캐스크·단맛 선호", "트로피컬 과일향 선호"],
    similar: ["BenRiach 12y", "GlenAllachie Cuvée Cask", "GlenAllachie 13y"],
  },
  "Balvenie Single Barrel 12y": {
    desc: "단일 버번 캐스크에서만 병입, 바닐라와 꿀의 깨끗하고 직선적인 풍미가 매력적이다.",
    tags: ["가벼운 입문용", "버번·바닐라 선호", "개성파·실험적 풍미 선호"],
    similar: ["Balvenie DoubleWood 12y", "Balvenie Caribbean Cask 14y", "Balvenie Madeira Cask 15y"],
  },
  "Glenrothes WMC": {
    desc: "와인메이커스 컬렉션 한정 라인, 오렌지 마멀레이드와 진저브레드 풍미가 화려하게 펼쳐진다.",
    tags: ["한정판·희소가치 선호", "셰리캐스크·단맛 선호", "트로피컬 과일향 선호"],
    similar: ["Glenrothes 12y", "Glenrothes 18y", "Macallan Sherry Cask 12y"],
  },
  "GlenAllachie Cuvée Cask": {
    desc: "와인 캐스크 피니시로 베리류 과일향과 스파이스가 화려하게 더해진 개성 있는 라인.",
    tags: ["개성파·실험적 풍미 선호", "트로피컬 과일향 선호", "한정판·희소가치 선호"],
    similar: ["GlenAllachie 12y", "Arran Amarone Cask Finish", "Balvenie Madeira Cask 15y"],
  },
  "GlenAllachie 13y": {
    desc: "12년보다 한층 깊어진 셰리 단맛과 견과류, 스파이스 풍미가 진하게 느껴지는 몰트.",
    tags: ["셰리캐스크·단맛 선호", "개성파·실험적 풍미 선호", "우디·스파이시 선호"],
    similar: ["GlenAllachie 12y", "GlenAllachie 15y", "GlenAllachie 10y CS"],
  },
  "Balvenie Caribbean Cask 14y": {
    desc: "캐리비안 럼 캐스크 피니시로 바나나, 코코넛 같은 트로피컬한 단맛이 화려하게 더해진다.",
    tags: ["트로피컬 과일향 선호", "셰리캐스크·단맛 선호", "개성파·실험적 풍미 선호"],
    similar: ["Balvenie Single Barrel 12y", "Glenfiddich 23y (Weekly)", "Kavalan Solist Brandy"],
  },
  "Aberlour Double Cask 14y": {
    desc: "12년보다 깊어진 건과일, 캐러멜 단맛에 부드러운 스파이스가 길게 이어지는 몰트.",
    tags: ["셰리캐스크·단맛 선호", "우디·스파이시 선호", "묵직한 디저트 페어링"],
    similar: ["Aberlour Double Cask 12y", "Glengoyne 15y", "Tomatin 15y"],
  },
  "Aberlour A'bunadh": {
    desc: "캐스크 스트랭스 무냉각 여과, 진한 셰리 단맛과 스파이스가 폭발적으로 다가오는 마니아 픽.",
    tags: ["카스크스트랭스(고도수) 선호", "셰리캐스크·단맛 선호", "개성파·실험적 풍미 선호"],
    similar: ["Macallan Sherry Cask 12y", "Glenfarclas 105 CS", "GlenAllachie 10y CS"],
  },
  "Balvenie Madeira Cask 15y": {
    desc: "마데이라 와인 캐스크 피니시로 견과류와 건과일, 산뜻한 단맛이 조화를 이루는 몰트.",
    tags: ["셰리캐스크·단맛 선호", "트로피컬 과일향 선호", "개성파·실험적 풍미 선호"],
    similar: ["Balvenie Caribbean Cask 14y", "Balvenie Madeira Cask 21y", "Glenmorangie Nectar D'Or"],
  },
  "Balvenie Week of Peat 14y": {
    desc: "1년에 단 1주만 피트 보리를 사용하는 한정 라인, 발베니 특유의 부드러움 속 은은한 스모크가 매력.",
    tags: ["피트·스모키 애호가", "개성파·실험적 풍미 선호", "한정판·희소가치 선호"],
    similar: ["Balvenie 19 Week of Peat", "Glendronach Peated", "Highland Park 12y"],
  },
  "GlenAllachie 15y": {
    desc: "13년보다 한층 깊고 묵직한 셰리·우디 풍미, 다크 초콜릿과 건과일이 길게 이어진다.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "우디·스파이시 선호"],
    similar: ["GlenAllachie 13y", "GlenAllachie 18y", "Glenfarclas 15y"],
  },
  "GlenAllachie 10y CS": {
    desc: "캐스크 스트랭스 도수 그대로 즐기는 진한 셰리 단맛과 강렬한 스파이스, 고도수 마니아용.",
    tags: ["카스크스트랭스(고도수) 선호", "셰리캐스크·단맛 선호", "개성파·실험적 풍미 선호"],
    similar: ["Aberlour A'bunadh", "Glenfarclas 105 CS", "Glenlivet 16y Nadurra CS"],
  },
  "Glen Grant 18y": {
    desc: "오랜 숙성이 더한 깊은 캐러멜과 견과류 풍미, 부드럽고 균형 잡힌 올드 스타일 몰트.",
    tags: ["가벼운 입문용", "셰리캐스크·단맛 선호", "우디·스파이시 선호"],
    similar: ["Glen Grant 15y", "Glenlivet 18y", "Glenfiddich 18y"],
  },
  "Macallan Double Cask 15y": {
    desc: "12년보다 한층 풍성해진 바닐라, 생강빵, 건과일 풍미가 부드럽게 어우러진다.",
    tags: ["셰리캐스크·단맛 선호", "가벼운 입문용", "트로피컬 과일향 선호"],
    similar: ["Macallan Double Cask 12y", "Macallan Triple Cask 15y", "Macallan Double Cask 18y"],
  },
  "Macallan Triple Cask 15y": {
    desc: "3종 캐스크 블렌딩의 균형감이 한층 깊어진 버전, 가벼운 단맛과 부드러운 오크가 특징.",
    tags: ["가벼운 입문용", "셰리캐스크·단맛 선호", "가성비 선호"],
    similar: ["Macallan Double Cask 15y", "Macallan Triple Cask 12y", "Glenfiddich 15y"],
  },
  "Glenrothes 18y": {
    desc: "오렌지, 다크 초콜릿, 스파이스가 복합적으로 어우러지는 깊고 우아한 숙성 몰트.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "우디·스파이시 선호"],
    similar: ["Glenrothes WMC", "Dalmore 15y", "Macallan Sherry Cask 18y"],
  },
  "Glenfiddich 18y": {
    desc: "셰리·버번 캐스크 조합으로 다크 초콜릿, 오렌지, 스파이스가 깊게 어우러지는 인기 숙성 라인.",
    tags: ["셰리캐스크·단맛 선호", "우디·스파이시 선호", "묵직한 디저트 페어링"],
    similar: ["Glenfiddich 15y", "Glenfiddich 21y", "Glenlivet 18y"],
  },
  "Glenlivet 18y": {
    desc: "오렌지 껍질과 스파이스, 부드러운 셰리 단맛이 조화로운 글렌리벳의 프리미엄 라인.",
    tags: ["셰리캐스크·단맛 선호", "우디·스파이시 선호", "묵직한 디저트 페어링"],
    similar: ["Glenfiddich 18y", "Glen Grant 18y", "Glenlivet 13y CS"],
  },
  "GlenAllachie Sinteis 2015": {
    desc: "버건디 와인 캐스크 피니시 한정 라인, 베리류 과일과 스파이스가 화려하게 펼쳐지는 빈티지.",
    tags: ["한정판·희소가치 선호", "트로피컬 과일향 선호", "개성파·실험적 풍미 선호"],
    similar: ["GlenAllachie Cuvée Cask", "Glendronach 2008", "Arran Amarone Cask Finish"],
  },
  "Balvenie French Oak 16y": {
    desc: "프렌치 오크 와인 캐스크 피니시로 스파이스와 베리류 단맛이 우아하게 더해진 16년 숙성.",
    tags: ["우디·스파이시 선호", "셰리캐스크·단맛 선호", "한정판·희소가치 선호"],
    similar: ["Balvenie Madeira Cask 15y", "Balvenie PX Cask 18y", "Glenlivet 18y"],
  },
  "Glenlivet 13y CS": {
    desc: "캐스크 스트랭스로 즐기는 글렌리벳, 강렬한 도수 속 과일과 오크 풍미가 선명하다.",
    tags: ["카스크스트랭스(고도수) 선호", "개성파·실험적 풍미 선호", "우디·스파이시 선호"],
    similar: ["Glenlivet 16y Nadurra CS", "GlenAllachie 10y CS", "Glenfarclas 105 CS"],
  },
  "GlenAllachie 18y": {
    desc: "오랜 숙성의 깊이, 다크 초콜릿과 가죽, 건과일까지 복합적으로 펼쳐지는 플래그십 라인.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "우디·스파이시 선호"],
    similar: ["GlenAllachie 15y", "Glengoyne 18y", "Glendronach 16y"],
  },
  "Glenlivet 16y Nadurra CS": {
    desc: "무냉각여과 캐스크 스트랭스, 바닐라와 과일향이 도수 그대로 강렬하게 살아있는 몰트.",
    tags: ["카스크스트랭스(고도수) 선호", "트로피컬 과일향 선호", "개성파·실험적 풍미 선호"],
    similar: ["Glenlivet 13y CS", "GlenAllachie 10y CS", "Balvenie 19 Week of Peat"],
  },
  "Balvenie PX Cask 18y": {
    desc: "페드로 히메네즈 셰리 캐스크 피니시로 진한 건포도, 무화과 단맛이 묵직하게 펼쳐진다.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "한정판·희소가치 선호"],
    similar: ["Balvenie French Oak 16y", "Dalmore 18y", "Glendronach 21y"],
  },
  "Balvenie 19 Week of Peat": {
    desc: "위크오브피트 시리즈의 장기 숙성 버전, 부드러운 스모크와 깊은 오크 풍미가 함께한다.",
    tags: ["피트·스모키 애호가", "한정판·희소가치 선호", "우디·스파이시 선호"],
    similar: ["Balvenie Week of Peat 14y", "Talisker 18y", "Glenlivet 16y Nadurra CS"],
  },
  "Glenfiddich 21y": {
    desc: "캐리비안 럼 캐스크 피니시로 트로피컬 단맛과 스파이스가 화려하게 어우러지는 그랑레저브.",
    tags: ["트로피컬 과일향 선호", "한정판·희소가치 선호", "셰리캐스크·단맛 선호"],
    similar: ["Glenfiddich 23y (Weekly)", "Glenfiddich 18y", "Balvenie Caribbean Cask 14y"],
  },
  "Macallan Double Cask 18y": {
    desc: "오랜 숙성이 더한 진한 캐러멜, 건과일, 스파이스가 복합적으로 깊어진 더블캐스크 플래그십.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "한정판·희소가치 선호"],
    similar: ["Macallan Double Cask 15y", "Macallan Sherry Cask 18y", "Glenrothes 18y"],
  },
  "Macallan Sherry Cask 18y": {
    desc: "100% 셰리 캐스크 18년, 진한 건포도와 다크 초콜릿이 깊고 풍성하게 펼쳐지는 정점.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "한정판·희소가치 선호"],
    similar: ["Macallan Sherry Cask 12y", "Macallan Double Cask 18y", "Glenfarclas 25y"],
  },
  "Balvenie Single Barrel 15y Sherry": {
    desc: "단일 셰리 캐스크에서만 병입, 진한 건포도와 견과류 풍미가 또렷하게 드러나는 희소 라인.",
    tags: ["셰리캐스크·단맛 선호", "한정판·희소가치 선호", "묵직한 디저트 페어링"],
    similar: ["Balvenie Single Barrel 12y", "Glendronach 21y", "GlenAllachie 18y"],
  },
  "Balvenie Portwood Cask 21y": {
    desc: "21년 숙성에 포트 캐스크 피니시까지, 베리류 과일과 다크 초콜릿이 진하게 어우러진 프레스티지 라인.",
    tags: ["한정판·희소가치 선호", "묵직한 디저트 페어링", "트로피컬 과일향 선호"],
    similar: ["Glendronach PortWood", "Balvenie Madeira Cask 21y", "Dalmore 18y"],
  },
  "Balvenie Madeira Cask 21y": {
    desc: "21년 숙성과 마데이라 캐스크의 조화, 견과류와 건과일 풍미가 깊고 우아하게 펼쳐진다.",
    tags: ["한정판·희소가치 선호", "셰리캐스크·단맛 선호", "묵직한 디저트 페어링"],
    similar: ["Balvenie Portwood Cask 21y", "Balvenie Madeira Cask 15y", "Macallan Sherry Cask 18y"],
  },
  "Glenfiddich 23y": {
    desc: "그랑레저브 23년, 버번·셰리·럼 캐스크를 거친 풍성한 트로피컬 단맛과 깊은 오크 피니시.",
    tags: ["한정판·희소가치 선호", "트로피컬 과일향 선호", "묵직한 디저트 페어링"],
    similar: ["Glenfiddich 21y", "Glenfiddich 23y (Weekly)", "Balvenie Madeira Cask 21y"],
  },
  "Kilkerran 12y": {
    desc: "캠벨타운 특유의 오일리한 질감에 가벼운 피트 스모크와 시트러스, 버터스카치가 어우러진 균형 잡힌 몰트.",
    tags: ["피트·스모키 애호가", "가벼운 입문용", "오일리·해양성 선호"],
    similar: ["Springbank 10y", "Old Pulteney 12y", "Talisker 10y"],
  },
  "Springbank 10y": {
    desc: "버번+셰리 캐스크 조합으로 트로피컬 과일, 바닐라, 가벼운 스모크와 짠맛이 동시에 느껴지는 캠벨타운 대표 몰트.",
    tags: ["개성파·실험적 풍미 선호", "피트·스모키 애호가", "트로피컬 과일향 선호"],
    similar: ["Kilkerran 12y", "Talisker 10y", "Glenfarclas 12y"],
  },
  "Springbank 15y": {
    desc: "가죽, 다크 초콜릿, 건과일에 시그니처 '스프링뱅크 펑크'가 더해진 깊고 복합적인 셰리 숙성 몰트.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "개성파·실험적 풍미 선호"],
    similar: ["Glendronach 15y", "Aberlour A'bunadh", "GlenAllachie 15y"],
  },
  "Ardbeg Wee Beastie": {
    desc: "아드벡 라인 중 가장 어리고 거친 5년산, 타르와 스모크가 강렬하게 폭발하는 입문용 피트 몰트.",
    tags: ["피트·스모키 애호가", "가벼운 입문용", "개성파·실험적 풍미 선호"],
    similar: ["Ardbeg 10y", "Caol Ila 12y", "Laphroaig 10y"],
  },
  "Caol Ila 12y": {
    desc: "바다 소금기와 가벼운 스모크, 산뜻한 시트러스가 함께 느껴지는 깔끔한 아일라 몰트.",
    tags: ["피트·스모키 애호가", "오일리·해양성 선호", "가벼운 입문용"],
    similar: ["Ardbeg Wee Beastie", "Bunnahabhain 12y", "Caol Ila DE"],
  },
  "Laphroaig Oak Select": {
    desc: "라프로익 중 가장 가벼운 피트감, 바닐라와 오크 단맛이 스모크와 부드럽게 어우러진다.",
    tags: ["피트·스모키 애호가", "가벼운 입문용", "버번·바닐라 선호"],
    similar: ["Laphroaig 10y", "Bowmore 12y", "Talisker 10y"],
  },
  "Talisker 10y": {
    desc: "후추 같은 스파이시함과 바다 소금기, 은은한 스모크가 어우러진 스카이섬 대표 몰트.",
    tags: ["피트·스모키 애호가", "오일리·해양성 선호", "우디·스파이시 선호"],
    similar: ["Talisker 8y SR", "Talisker Port Ruighe", "Oban 14y"],
  },
  "Lagavulin 8y": {
    desc: "강렬한 피트와 짠맛, 약간의 단맛이 균형을 이루는 라가불린의 젊고 파워풀한 버전.",
    tags: ["피트·스모키 애호가", "개성파·실험적 풍미 선호", "오일리·해양성 선호"],
    similar: ["Lagavulin 16y", "Ardbeg 10y", "Laphroaig Quarter Cask"],
  },
  "Bowmore 12y": {
    desc: "꿀과 레몬, 부드러운 스모크가 조화롭게 어우러지는 비교적 마시기 편한 아일라 몰트.",
    tags: ["피트·스모키 애호가", "가벼운 입문용", "시트러스·산미 선호"],
    similar: ["Laphroaig Oak Select", "Bowmore 15y", "Bunnahabhain 12y"],
  },
  "Bunnahabhain 12y": {
    desc: "아일라 중 거의 유일하게 피트를 쓰지 않는 증류소, 셰리 단맛과 짠맛이 부드럽게 어우러진다.",
    tags: ["오일리·해양성 선호", "셰리캐스크·단맛 선호", "가벼운 입문용"],
    similar: ["Caol Ila 12y", "Bowmore 12y", "Bunnahabhain 12y CS"],
  },
  "Ardbeg Smoketrails": {
    desc: "여행 컨셉 한정 라인, 강렬한 피트 스모크에 이국적인 캐스크 풍미가 더해진 개성 있는 보틀링.",
    tags: ["피트·스모키 애호가", "한정판·희소가치 선호", "개성파·실험적 풍미 선호"],
    similar: ["Ardbeg 10y", "Ardbeg An Oa", "Ardbeg Smokiverse"],
  },
  "Ardbeg 10y": {
    desc: "타르, 캠프파이어 스모크에 약간의 단맛이 균형을 이루는 아드벡의 시그니처 피트 몰트.",
    tags: ["피트·스모키 애호가", "개성파·실험적 풍미 선호", "가성비 선호"],
    similar: ["Ardbeg Wee Beastie", "Lagavulin 8y", "Laphroaig 10y"],
  },
  "Laphroaig 10y": {
    desc: "소독약 같은 강렬한 요오드향과 짠맛, 스모크가 압도적인 아일라 정통 피트 몰트.",
    tags: ["피트·스모키 애호가", "개성파·실험적 풍미 선호", "오일리·해양성 선호"],
    similar: ["Ardbeg 10y", "Laphroaig Quarter Cask", "Lagavulin 8y"],
  },
  "Laphroaig Quarter Cask": {
    desc: "작은 쿼터 캐스크 숙성으로 오크 접촉이 늘어 바닐라 단맛과 스모크가 한층 진해진 버전.",
    tags: ["피트·스모키 애호가", "버번·바닐라 선호", "개성파·실험적 풍미 선호"],
    similar: ["Laphroaig 10y", "Laphroaig PX", "Ardbeg Uigeadail"],
  },
  "Laphroaig PX": {
    desc: "페드로 히메네즈 셰리 캐스크 피니시로 스모크와 진한 건포도 단맛이 동시에 느껴지는 라인.",
    tags: ["피트·스모키 애호가", "셰리캐스크·단맛 선호", "개성파·실험적 풍미 선호"],
    similar: ["Laphroaig Quarter Cask", "Ardbeg Uigeadail", "Kilchoman Loch Gorm"],
  },
  "Ardbeg An Oa": {
    desc: "여러 캐스크 블렌딩으로 한층 부드럽고 둥글게 다듬어진, 아드벡 중 가장 마시기 편한 라인.",
    tags: ["피트·스모키 애호가", "가벼운 입문용", "가성비 선호"],
    similar: ["Ardbeg 10y", "Bowmore 12y", "Laphroaig Oak Select"],
  },
  "Talisker 8y SR": {
    desc: "스톰 한정판 계보, 짠맛과 스파이스가 강렬하게 살아있는 캐스크 스트랭스급 풍미.",
    tags: ["피트·스모키 애호가", "카스크스트랭스(고도수) 선호", "오일리·해양성 선호"],
    similar: ["Talisker 10y", "Talisker Port Ruighe", "Octomore 14.1"],
  },
  "Caol Ila DE": {
    desc: "디스틸러스 에디션, 와인 캐스크 피니시로 산뜻한 과일향이 스모크에 더해진 라인.",
    tags: ["피트·스모키 애호가", "트로피컬 과일향 선호", "오일리·해양성 선호"],
    similar: ["Caol Ila 12y", "Bruichladdich Port Charlotte", "Talisker Port Ruighe"],
  },
  "Bruichladdich Port Charlotte": {
    desc: "브룩라디의 피트 라인, 스모크와 함께 미네랄한 바다 짠맛이 깔끔하게 느껴진다.",
    tags: ["피트·스모키 애호가", "오일리·해양성 선호", "개성파·실험적 풍미 선호"],
    similar: ["Caol Ila DE", "Kilchoman Machir Bay", "Bowmore 15y"],
  },
  "Talisker Port Ruighe": {
    desc: "포트 와인 캐스크 피니시로 베리류 단맛이 짠맛, 스모크와 화려하게 어우러지는 라인.",
    tags: ["피트·스모키 애호가", "트로피컬 과일향 선호", "개성파·실험적 풍미 선호"],
    similar: ["Talisker 10y", "Talisker 8y SR", "Ardbeg Uigeadail"],
  },
  "Kilchoman Sanaig": {
    desc: "셰리 캐스크 비중을 높여 스모크와 진한 단맛이 함께 느껴지는 킬호만의 개성 있는 라인.",
    tags: ["피트·스모키 애호가", "셰리캐스크·단맛 선호", "개성파·실험적 풍미 선호"],
    similar: ["Kilchoman Machir Bay", "Kilchoman Loch Gorm", "Laphroaig PX"],
  },
  "Kilchoman Machir Bay": {
    desc: "버번+셰리 캐스크 조합, 신생 증류소 특유의 신선하고 펑키한 스모크가 매력적이다.",
    tags: ["피트·스모키 애호가", "개성파·실험적 풍미 선호", "오일리·해양성 선호"],
    similar: ["Kilchoman Sanaig", "Bruichladdich Port Charlotte", "Ardbeg An Oa"],
  },
  "Bowmore 15y": {
    desc: "셰리 캐스크 피니시 '다크스트 인카네이션', 진한 단맛과 스모크가 균형 있게 어우러진다.",
    tags: ["피트·스모키 애호가", "셰리캐스크·단맛 선호", "묵직한 디저트 페어링"],
    similar: ["Bowmore 12y", "Bowmore 18y A/M", "Laphroaig PX"],
  },
  "Lagavulin 16y": {
    desc: "아일라를 대표하는 클래식, 짙은 피트와 셰리 단맛, 짠맛이 완벽하게 균형 잡힌 명작.",
    tags: ["피트·스모키 애호가", "셰리캐스크·단맛 선호", "묵직한 디저트 페어링"],
    similar: ["Lagavulin 8y", "Ardbeg Uigeadail", "Talisker 18y"],
  },
  "Ardbeg Uigeadail": {
    desc: "셰리 캐스크와 버번 캐스크의 조합, 강렬한 피트와 진한 건포도 단맛이 동시에 느껴지는 명작.",
    tags: ["피트·스모키 애호가", "셰리캐스크·단맛 선호", "묵직한 디저트 페어링"],
    similar: ["Lagavulin 16y", "Laphroaig PX", "Ardbeg Corryvreckan"],
  },
  "Ardbeg Corryvreckan": {
    desc: "캐스크 스트랭스급 도수, 타르와 후추, 강렬한 스모크가 폭발하는 아드벡 마니아용 한 잔.",
    tags: ["피트·스모키 애호가", "카스크스트랭스(고도수) 선호", "개성파·실험적 풍미 선호"],
    similar: ["Ardbeg Uigeadail", "Octomore 14.2", "Kilchoman Loch Gorm"],
  },
  "Ardbeg Smokiverse": {
    desc: "아드벡의 우주 테마 한정판, 독특한 캐스크 활용과 강렬한 스모크가 어우러진 실험적 보틀링.",
    tags: ["피트·스모키 애호가", "한정판·희소가치 선호", "개성파·실험적 풍미 선호"],
    similar: ["Ardbeg Smoketrails", "Ardbeg Anthology 13y", "Octomore 14.1"],
  },
  "Kilchoman Loch Gorm": {
    desc: "100% 셰리 캐스크 숙성, 스모크와 진한 건과일 단맛이 강렬하게 어우러지는 한정 라인.",
    tags: ["피트·스모키 애호가", "셰리캐스크·단맛 선호", "한정판·희소가치 선호"],
    similar: ["Laphroaig PX", "Ardbeg Uigeadail", "Kilchoman Sanaig"],
  },
  "Laphroaig Lore": {
    desc: "여러 숙성연수 원액을 블렌딩한 묵직한 버전, 강렬한 피트와 깊은 보디감이 인상적이다.",
    tags: ["피트·스모키 애호가", "묵직한 디저트 페어링", "개성파·실험적 풍미 선호"],
    similar: ["Laphroaig PX", "Ardbeg Corryvreckan", "Talisker 18y"],
  },
  "Ardbeg Anthology 13y": {
    desc: "한정 13년 숙성, 클래식 아드벡 스모크에 한층 깊어진 복합미가 더해진 컬렉터용 라인.",
    tags: ["한정판·희소가치 선호", "피트·스모키 애호가", "개성파·실험적 풍미 선호"],
    similar: ["Ardbeg Smokiverse", "Octomore 14.2", "Caol Ila 25y"],
  },
  "Bowmore 18y A/M": {
    desc: "애스톤마틴 콜라보 18년, 깊은 셰리 단맛과 스모크가 우아하게 어우러지는 프레스티지 라인.",
    tags: ["한정판·희소가치 선호", "셰리캐스크·단맛 선호", "피트·스모키 애호가"],
    similar: ["Bowmore 15y", "Talisker 18y", "Glendronach 16y"],
  },
  "Bunnahabhain 12y CS": {
    desc: "캐스크 스트랭스로 즐기는 부나하벤, 짠맛과 셰리 단맛이 도수 그대로 강렬하게 다가온다.",
    tags: ["카스크스트랭스(고도수) 선호", "셰리캐스크·단맛 선호", "오일리·해양성 선호"],
    similar: ["Bunnahabhain 12y", "GlenAllachie 10y CS", "Aberlour A'bunadh"],
  },
  "Talisker 18y": {
    desc: "스파이스와 짠맛, 스모크가 깊고 우아하게 균형을 이루는 탈리스커의 플래그십 숙성 라인.",
    tags: ["피트·스모키 애호가", "우디·스파이시 선호", "한정판·희소가치 선호"],
    similar: ["Talisker 10y", "Lagavulin 16y", "Laphroaig Lore"],
  },
  "Octomore 14.2": {
    desc: "세계 최고 수준의 피트 함량, 압도적인 스모크와 타르 풍미가 폭발하는 익스트림 피트 몰트.",
    tags: ["피트·스모키 애호가", "카스크스트랭스(고도수) 선호", "개성파·실험적 풍미 선호"],
    similar: ["Octomore 14.1", "Octomore .1.2 (Weekly)", "Ardbeg Corryvreckan"],
  },
  "Octomore 14.1": {
    desc: "옥토모어 표준 캐스크 버전, 강렬한 피트와 깔끔한 보리 단맛의 밸런스가 돋보인다.",
    tags: ["피트·스모키 애호가", "카스크스트랭스(고도수) 선호", "개성파·실험적 풍미 선호"],
    similar: ["Octomore 14.2", "Octomore .1.2 (Weekly)", "Ardbeg Smokiverse"],
  },
  "Caol Ila 25y": {
    desc: "25년 장기 숙성, 부드러워진 스모크 속 깊고 복합적인 풍미가 펼쳐지는 희소 보틀링.",
    tags: ["한정판·희소가치 선호", "피트·스모키 애호가", "묵직한 디저트 페어링"],
    similar: ["Ardbeg Anthology 13y", "Talisker 18y", "Bowmore 18y A/M"],
  },
  "Arran 10y": {
    desc: "가벼운 과일향과 바다 바람 같은 산뜻함이 특징인 아란섬의 입문용 몰트.",
    tags: ["가벼운 입문용", "오일리·해양성 선호", "가성비 선호"],
    similar: ["Old Pulteney 12y", "Arran Barrel Reserve Malt", "Highland Park 12y"],
  },
  "Arran Barrel Reserve Malt": {
    desc: "버번 캐스크 풀숙성, 바닐라와 가벼운 꿀 단맛이 산뜻하게 느껴지는 가성비 좋은 몰트.",
    tags: ["가벼운 입문용", "버번·바닐라 선호", "가성비 선호"],
    similar: ["Arran 10y", "Arran Quarter Cask", "Deanston 12y"],
  },
  "Highland Park 12y": {
    desc: "헤더 꿀과 은은한 스모크, 오렌지 풍미가 균형 있게 어우러지는 오크니의 대표 몰트.",
    tags: ["피트·스모키 애호가", "가벼운 입문용", "셰리캐스크·단맛 선호"],
    similar: ["Highland Park 15y", "Arran 10y", "Talisker 10y"],
  },
  "Arran Quarter Cask": {
    desc: "작은 쿼터캐스크 숙성으로 오크 풍미가 진해진, 바닐라와 스파이스가 매력적인 라인.",
    tags: ["우디·스파이시 선호", "버번·바닐라 선호", "가성비 선호"],
    similar: ["Arran Barrel Reserve Malt", "Arran Machrie Moor CS", "Laphroaig Quarter Cask"],
  },
  "Arran Port Cask Finish": {
    desc: "포트 와인 캐스크 피니시로 베리류 과일잼 같은 화려한 단맛이 더해진 몰트.",
    tags: ["트로피컬 과일향 선호", "셰리캐스크·단맛 선호", "개성파·실험적 풍미 선호"],
    similar: ["Arran Amarone Cask Finish", "Arran Sauternes Cask Finish", "Glendronach PortWood"],
  },
  "Arran Amarone Cask Finish": {
    desc: "이탈리아 아마로네 와인 캐스크 피니시, 진한 체리와 다크 베리 풍미가 인상적이다.",
    tags: ["트로피컬 과일향 선호", "개성파·실험적 풍미 선호", "셰리캐스크·단맛 선호"],
    similar: ["Arran Port Cask Finish", "GlenAllachie Cuvée Cask", "Arran Sherry Cask"],
  },
  "Arran Sauternes Cask Finish": {
    desc: "소테른 디저트 와인 캐스크 피니시로 살구, 꿀 같은 화려한 단맛이 돋보이는 몰트.",
    tags: ["트로피컬 과일향 선호", "묵직한 디저트 페어링", "개성파·실험적 풍미 선호"],
    similar: ["Glenmorangie Nectar D'Or", "Arran Amarone Cask Finish", "Balvenie Madeira Cask 15y"],
  },
  "Arran Machrie Moor CS": {
    desc: "피트 처리 보리를 사용한 캐스크 스트랭스 버전, 스모크와 강한 도수가 동시에 느껴진다.",
    tags: ["피트·스모키 애호가", "카스크스트랭스(고도수) 선호", "개성파·실험적 풍미 선호"],
    similar: ["Arran Quarter Cask", "Highland Park 16y", "Talisker 8y SR"],
  },
  "Highland Park 15y": {
    desc: "12년보다 깊어진 헤더 꿀, 스모크, 셰리 단맛의 조화가 한층 우아해진 몰트.",
    tags: ["피트·스모키 애호가", "셰리캐스크·단맛 선호", "묵직한 디저트 페어링"],
    similar: ["Highland Park 12y", "Highland Park 16y", "Bowmore 15y"],
  },
  "Highland Park 16y": {
    desc: "바이킹 시리즈, 깊어진 셰리 단맛과 은은한 스모크가 복합적으로 펼쳐지는 숙성 라인.",
    tags: ["피트·스모키 애호가", "셰리캐스크·단맛 선호", "한정판·희소가치 선호"],
    similar: ["Highland Park 15y", "Arran Machrie Moor CS", "Bowmore 18y A/M"],
  },
  "Arran Sherry Cask": {
    desc: "셰리 캐스크 풀숙성으로 건포도와 캐러멜 단맛이 진하게 느껴지는 아란의 셰리 라인.",
    tags: ["셰리캐스크·단맛 선호", "묵직한 디저트 페어링", "트로피컬 과일향 선호"],
    similar: ["Arran Amarone Cask Finish", "Glenfarclas 12y", "Macallan Sherry Cask 12y"],
  },
  "Johnnie Walker Black Label": {
    desc: "꿀, 바닐라에 은은한 스모크가 더해진 블렌디드의 정석, 누구에게나 무난한 첫 선택.",
    tags: ["가벼운 입문용", "하이볼·가볍게", "가성비 선호"],
    similar: ["Dewar's 12y", "Ballantine's 12y", "Monkey Shoulder"],
  },
  "Ballantine's 12y": {
    desc: "꽃향과 꿀, 부드러운 몰트감이 조화로운 가볍고 마시기 편한 블렌디드.",
    tags: ["가벼운 입문용", "하이볼·가볍게", "가성비 선호"],
    similar: ["Johnnie Walker Black Label", "Dewar's 12y", "Ballantine's 17y"],
  },
  "Dewar's 12y": {
    desc: "더블 에이징 공법으로 부드럽게 다듬어진 꿀과 바닐라 풍미의 데일리 블렌디드.",
    tags: ["가벼운 입문용", "하이볼·가볍게", "가성비 선호"],
    similar: ["Johnnie Walker Black Label", "Ballantine's 12y", "Dewar's 15y"],
  },
  "Johnnie Walker Gold Label": {
    desc: "클라가호스 18년 컨셉을 잇는 라인, 꿀과 과일향이 한층 풍성하게 느껴지는 블렌디드.",
    tags: ["가벼운 입문용", "셰리캐스크·단맛 선호", "트로피컬 과일향 선호"],
    similar: ["Johnnie Walker Black Label Old", "Dewar's 15y", "Royal Salute 21y"],
  },
  "Dewar's 15y": {
    desc: "12년보다 깊어진 꿀과 견과류 단맛, 부드러운 오크 피니시가 특징인 블렌디드.",
    tags: ["가벼운 입문용", "셰리캐스크·단맛 선호", "가성비 선호"],
    similar: ["Dewar's 12y", "Dewar's 18y", "Ballantine's 17y"],
  },
  "Johnnie Walker Green Label": {
    desc: "100% 몰트 블렌딩으로 탈리스커, 라가불린 등의 개성이 살아있는 독특한 라인.",
    tags: ["개성파·실험적 풍미 선호", "피트·스모키 애호가", "가벼운 입문용"],
    similar: ["Johnnie Walker Black Label", "Highland Park 12y", "Talisker 10y"],
  },
  "Dewar's 18y": {
    desc: "더블 에이징의 깊이가 더해진 18년, 진한 꿀과 견과류, 부드러운 스파이스가 느껴진다.",
    tags: ["셰리캐스크·단맛 선호", "우디·스파이시 선호", "가성비 선호"],
    similar: ["Dewar's 15y", "Ballantine's 21y", "Johnnie Walker Gold Label"],
  },
  "Ballantine's 17y": {
    desc: "꽃향과 꿀, 부드러운 스모크가 우아하게 어우러지는 발렌타인의 프리미엄 라인.",
    tags: ["셰리캐스크·단맛 선호", "우디·스파이시 선호", "가벼운 입문용"],
    similar: ["Ballantine's 12y", "Dewar's 18y", "Ballantine's 21y"],
  },
  "Johnnie Walker Black Label Old": {
    desc: "블랙라벨의 빈티지·고숙성 버전, 한층 깊고 클래식한 스모크와 단맛의 조화.",
    tags: ["한정판·희소가치 선호", "셰리캐스크·단맛 선호", "피트·스모키 애호가"],
    similar: ["Johnnie Walker Black Label", "Johnnie Walker Gold Label", "Ballantine's 21y"],
  },
  "Ballantine's 21y": {
    desc: "21년 숙성 원액의 깊이, 부드러운 오크와 건과일 단맛이 우아하게 펼쳐지는 프리미엄 블렌디드.",
    tags: ["한정판·희소가치 선호", "셰리캐스크·단맛 선호", "묵직한 디저트 페어링"],
    similar: ["Ballantine's 17y", "Royal Salute 21y", "Dewar's 18y"],
  },
  "Royal Salute 21y": {
    desc: "엘리자베스 2세 대관식을 기념해 만들어진 21년 숙성 블렌디드, 벌꿀과 오렌지의 우아한 단맛.",
    tags: ["한정판·희소가치 선호", "셰리캐스크·단맛 선호", "묵직한 디저트 페어링"],
    similar: ["Royal Salute 21y (Weekly)", "Ballantine's 21y", "Royal Salute 25y"],
  },
  "Johnnie Walker Blue Label": {
    desc: "희소 원액만을 블렌딩한 프레스티지 라인, 부드러운 스모크와 깊은 단맛의 정점.",
    tags: ["한정판·희소가치 선호", "묵직한 디저트 페어링", "개성파·실험적 풍미 선호"],
    similar: ["Johnnie Walker Black Label Old", "Royal Salute 21y", "Ballantine's 30y"],
  },
  "Ballantine's 30y": {
    desc: "30년 숙성의 깊이, 다크 초콜릿과 건포도, 긴 여운의 우디함이 인상적인 프레스티지 블렌디드.",
    tags: ["한정판·희소가치 선호", "우디·스파이시 선호", "묵직한 디저트 페어링"],
    similar: ["Ballantine's 30y (Weekly)", "Johnnie Walker Blue Label", "Royal Salute 25y"],
  },
  "Royal Salute 25y": {
    desc: "25년 숙성 원액의 풍부함, 벌꿀과 건과일, 깊은 오크가 조화롭게 어우러지는 프레스티지 라인.",
    tags: ["한정판·희소가치 선호", "묵직한 디저트 페어링", "셰리캐스크·단맛 선호"],
    similar: ["Royal Salute 21y", "Royal Salute 32y", "Ballantine's 30y"],
  },
  "Royal Salute 32y": {
    desc: "로얄살루트의 최상위 라인, 32년 숙성의 깊고 복합적인 풍미를 즐기는 궁극의 한 잔.",
    tags: ["한정판·희소가치 선호", "묵직한 디저트 페어링", "개성파·실험적 풍미 선호"],
    similar: ["Royal Salute 25y", "Hibiki 21", "Glenfarclas 25y"],
  },
  "Buffalo Trace": {
    desc: "바닐라와 캐러멜, 부드러운 단맛의 정석 — 버번 입문자에게 가장 무난한 선택.",
    tags: ["가벼운 입문용", "버번·바닐라 선호", "가성비 선호"],
    similar: ["Maker's Mark", "Wild Turkey 8y", "1792 Small Batch"],
  },
  "Maker's Mark": {
    desc: "밀을 사용한 부드러운 매시빌, 캐러멜과 바닐라의 둥글고 달콤한 풍미가 특징.",
    tags: ["가벼운 입문용", "버번·바닐라 선호", "가성비 선호"],
    similar: ["Buffalo Trace", "Maker's Mark CS", "Rowan's Creek"],
  },
  "Wild Turkey 8y": {
    desc: "높은 라이 비중으로 스파이시함이 살아있는 묵직한 버번, 캐러멜과 후추향이 동시에.",
    tags: ["우디·스파이시 선호", "버번·바닐라 선호", "가성비 선호"],
    similar: ["Wild Turkey Rare Breed", "Russell's Reserve 10y", "Knob Creek 9y"],
  },
  "1792 Small Batch": {
    desc: "높은 도수와 스파이시한 라이감, 캐러멜 단맛이 균형 있게 어우러지는 스몰배치 버번.",
    tags: ["우디·스파이시 선호", "버번·바닐라 선호", "가성비 선호"],
    similar: ["Buffalo Trace", "Four Roses Small Batch", "Knob Creek 9y"],
  },
  "Russell's Reserve 10y": {
    desc: "와일드터키 가문의 프리미엄 라인, 오크와 캐러멜의 깊은 맛이 균형 잡힌 버번.",
    tags: ["버번·바닐라 선호", "우디·스파이시 선호", "가성비 선호"],
    similar: ["Wild Turkey 8y", "Russell's Reserve Single Barrel", "Russell's Reserve Rye"],
  },
  "Knob Creek 9y": {
    desc: "캐스크 스트랭스에 가까운 묵직한 보디감, 오크와 캐러멜의 진한 단맛이 특징.",
    tags: ["버번·바닐라 선호", "우디·스파이시 선호", "가성비 선호"],
    similar: ["1792 Small Batch", "Wild Turkey 8y", "Noah's Mill"],
  },
  "Four Roses Small Batch": {
    desc: "4가지 원액 블렌딩, 과일향과 스파이스가 부드럽게 조화를 이루는 클래식 버번.",
    tags: ["버번·바닐라 선호", "시트러스·산미 선호", "가성비 선호"],
    similar: ["1792 Small Batch", "Woodford Reserve", "Michter's Small Batch"],
  },
  "Michter's Unblended": {
    desc: "단일 매시빌, 깨끗한 캐러멜과 바닐라 풍미가 부드럽게 느껴지는 프리미엄 버번.",
    tags: ["버번·바닐라 선호", "가벼운 입문용", "가성비 선호"],
    similar: ["Woodford Reserve", "Michter's Small Batch", "Michter's Sour Mash"],
  },
  "Woodford Reserve Rye": {
    desc: "라이 위스키 특유의 스파이시하고 드라이한 풍미가 도드라지는 칵테일 베이스로도 인기.",
    tags: ["우디·스파이시 선호", "개성파·실험적 풍미 선호", "가성비 선호"],
    similar: ["Russell's Reserve Rye", "Town Branch Rye", "Michter's Sour Mash"],
  },
  "Russell's Reserve Single Barrel": {
    desc: "단일 배럴 병입으로 캐스크 개성이 살아있는 진한 캐러멜과 오크 풍미.",
    tags: ["버번·바닐라 선호", "우디·스파이시 선호", "개성파·실험적 풍미 선호"],
    similar: ["Russell's Reserve 10y", "Knob Creek 9y", "Wild Turkey Rare Breed"],
  },
  "Woodford Reserve": {
    desc: "초콜릿, 바닐라, 가벼운 과일향이 우아하게 어우러지는 부드러운 프리미엄 버번.",
    tags: ["버번·바닐라 선호", "가벼운 입문용", "시트러스·산미 선호"],
    similar: ["Four Roses Small Batch", "Michter's Unblended", "Town Branch Bourbon"],
  },
  "Michter's Small Batch": {
    desc: "캐러멜과 바닐라, 부드러운 오크가 깔끔하게 어우러지는 믹터스의 스탠다드 버번.",
    tags: ["버번·바닐라 선호", "가벼운 입문용", "가성비 선호"],
    similar: ["Michter's Unblended", "Michter's Sour Mash", "Four Roses Small Batch"],
  },
  "Jack Daniel Single Barrel": {
    desc: "테네시 위스키 특유의 차콜 멜로잉, 진한 캐러멜과 바닐라가 묵직하게 느껴진다.",
    tags: ["버번·바닐라 선호", "우디·스파이시 선호", "개성파·실험적 풍미 선호"],
    similar: ["Wild Turkey Rare Breed", "Noah's Mill", "Russell's Reserve Single Barrel"],
  },
  "Town Branch Rye": {
    desc: "켄터키 라이 위스키, 스파이시하고 드라이한 끝맛이 칵테일에도 잘 어울린다.",
    tags: ["우디·스파이시 선호", "개성파·실험적 풍미 선호", "가성비 선호"],
    similar: ["Woodford Reserve Rye", "Russell's Reserve Rye", "Michter's Sour Mash"],
  },
  "Town Branch Bourbon": {
    desc: "버번 캐스크에 몰트 위스키 기법을 더한 독특한 양조, 부드러운 단맛과 개성이 공존.",
    tags: ["개성파·실험적 풍미 선호", "버번·바닐라 선호", "가성비 선호"],
    similar: ["Woodford Reserve", "Four Roses Small Batch", "VHW Port Cask"],
  },
  "Russell's Reserve Rye": {
    desc: "와일드터키 가문의 라이 위스키, 스파이시함과 캐러멜 단맛의 균형이 좋다.",
    tags: ["우디·스파이시 선호", "버번·바닐라 선호", "가성비 선호"],
    similar: ["Town Branch Rye", "Woodford Reserve Rye", "Russell's Reserve Single Barrel"],
  },
  "1776 James E. Pepper Bourbon": {
    desc: "역사적인 페퍼 가문의 레시피를 잇는 버번, 스파이스와 캐러멜의 클래식한 조화.",
    tags: ["버번·바닐라 선호", "우디·스파이시 선호", "개성파·실험적 풍미 선호"],
    similar: ["1792 Small Batch", "Rowan's Creek", "Noah's Mill"],
  },
  "VHW Port Cask": {
    desc: "포트 와인 캐스크 피니시로 베리류 단맛이 버번 본연의 캐러멜에 화려하게 더해진다.",
    tags: ["트로피컬 과일향 선호", "버번·바닐라 선호", "개성파·실험적 풍미 선호"],
    similar: ["Town Branch Bourbon", "Balvenie Caribbean Cask 14y", "Booker's 2022"],
  },
  "Michter's Sour Mash": {
    desc: "전통 사워매시 공법, 부드러운 산미와 캐러멜 단맛이 독특하게 어우러지는 라인.",
    tags: ["개성파·실험적 풍미 선호", "버번·바닐라 선호", "시트러스·산미 선호"],
    similar: ["Michter's Small Batch", "Woodford Reserve Rye", "Michter's Unblended"],
  },
  "Rowan's Creek": {
    desc: "고연산 소량 생산, 진한 캐러멜과 오크 스파이스가 묵직하게 느껴지는 크래프트 버번.",
    tags: ["버번·바닐라 선호", "우디·스파이시 선호", "개성파·실험적 풍미 선호"],
    similar: ["1776 James E. Pepper Bourbon", "Noah's Mill", "Knob Creek 9y"],
  },
  "Maker's Mark CS": {
    desc: "캐스크 스트랭스로 즐기는 메이커스 마크, 밀 베이스의 부드러움이 도수 그대로 살아있다.",
    tags: ["카스크스트랭스(고도수) 선호", "버번·바닐라 선호", "개성파·실험적 풍미 선호"],
    similar: ["Maker's Mark", "Wild Turkey Rare Breed", "Booker's 2022"],
  },
  "Wild Turkey Rare Breed": {
    desc: "캐스크 스트랭스 버번, 후추 스파이스와 캐러멜이 강렬하게 폭발하는 마니아용 한 잔.",
    tags: ["카스크스트랭스(고도수) 선호", "우디·스파이시 선호", "개성파·실험적 풍미 선호"],
    similar: ["Maker's Mark CS", "Booker's 2022", "Knob Creek 9y"],
  },
  "Noah's Mill": {
    desc: "여러 배럴을 블렌딩한 고도수 소량생산 버번, 진한 캐러멜과 견과류 풍미가 인상적.",
    tags: ["카스크스트랭스(고도수) 선호", "버번·바닐라 선호", "개성파·실험적 풍미 선호"],
    similar: ["Rowan's Creek", "Jack Daniel Single Barrel", "Booker's 2022"],
  },
  "Booker's 2022": {
    desc: "짐빔 가문의 무희석·무냉각여과 캐스크 스트랭스, 강렬한 오크와 캐러멜의 정점.",
    tags: ["카스크스트랭스(고도수) 선호", "한정판·희소가치 선호", "우디·스파이시 선호"],
    similar: ["Wild Turkey Rare Breed", "Noah's Mill", "Shenk's 2022"],
  },
  "Shenk's 2022": {
    desc: "마이커스 위스키 컴퍼니의 한정 라인, 깊고 부드러운 캐러멜과 오크의 프리미엄 한 잔.",
    tags: ["한정판·희소가치 선호", "버번·바닐라 선호", "묵직한 디저트 페어링"],
    similar: ["Booker's 2022", "Michter's Unblended", "VHW Port Cask"],
  },
  "Suntory Yamazaki DR": {
    desc: "디스틸러스 리저브, 베리류 과일과 화이트 오크의 산뜻함이 균형 잡힌 산토리의 입문 라인.",
    tags: ["가벼운 입문용", "트로피컬 과일향 선호", "시트러스·산미 선호"],
    similar: ["Hakushu DR", "Hibiki Harmony", "Suntory Yamazaki 12y"],
  },
  "Hakushu DR": {
    desc: "숲속을 연상시키는 허브향과 산뜻한 민트, 가벼운 스모크가 어우러지는 하쿠슈 스탠다드.",
    tags: ["가벼운 입문용", "오일리·해양성 선호", "시트러스·산미 선호"],
    similar: ["Suntory Yamazaki DR", "Hakushu Bittersweet", "Yoichi"],
  },
  "Hibiki Harmony": {
    desc: "여러 증류소 원액을 블렌딩한 부드럽고 화사한 풍미, 일본 위스키 입문 시 가장 추천되는 라인.",
    tags: ["가벼운 입문용", "트로피컬 과일향 선호", "하이볼·가볍게"],
    similar: ["Hibiki Blender's Choice", "Hibiki Master Select", "Suntory Yamazaki DR"],
  },
  "Yoichi": {
    desc: "스코틀랜드 전통 방식을 따른 묵직한 보디감, 은은한 스모크와 짠맛이 매력적인 일본 몰트.",
    tags: ["피트·스모키 애호가", "오일리·해양성 선호", "개성파·실험적 풍미 선호"],
    similar: ["Hakushu DR", "Yoichi Miyagikyo", "Talisker 10y"],
  },
  "Hibiki Blender's Choice": {
    desc: "블렌더의 개성이 담긴 한정 라인, 하모니보다 한층 진한 단맛과 깊이가 느껴진다.",
    tags: ["한정판·희소가치 선호", "트로피컬 과일향 선호", "셰리캐스크·단맛 선호"],
    similar: ["Hibiki Harmony", "Hibiki Master Select", "Hibiki 21"],
  },
  "Hibiki Master Select": {
    desc: "마스터 블렌더가 선별한 원액 구성, 화사한 과일향과 부드러운 단맛이 돋보이는 라인.",
    tags: ["한정판·희소가치 선호", "트로피컬 과일향 선호", "셰리캐스크·단맛 선호"],
    similar: ["Hibiki Blender's Choice", "Hibiki Harmony", "Hibiki 21"],
  },
  "Yoichi Miyagikyo": {
    desc: "요이치와 미야기쿄 두 증류소 원액의 블렌딩, 스모크와 과일향이 동시에 느껴지는 독특한 구성.",
    tags: ["개성파·실험적 풍미 선호", "피트·스모키 애호가", "트로피컬 과일향 선호"],
    similar: ["Yoichi", "Hakushu Bittersweet", "Suntory Yamazaki Smoky Batch"],
  },
  "Suntory Yamazaki 12y": {
    desc: "일본 위스키의 대표주자, 복숭아·파인애플 같은 화려한 과일향과 미즈나라 오크향이 특징.",
    tags: ["트로피컬 과일향 선호", "한정판·희소가치 선호", "시트러스·산미 선호"],
    similar: ["Suntory Yamazaki DR", "Suntory Yamazaki Smoky Batch", "Hakushu Bittersweet"],
  },
  "Suntory Yamazaki Smoky Batch": {
    desc: "야마자키 한정 배치, 평소보다 진한 스모크가 더해진 개성 있는 구성.",
    tags: ["피트·스모키 애호가", "한정판·희소가치 선호", "개성파·실험적 풍미 선호"],
    similar: ["Suntory Yamazaki 12y", "Yoichi Miyagikyo", "Hakushu Bittersweet"],
  },
  "Hakushu Bittersweet": {
    desc: "허브와 민트의 청량함에 비터한 다크 초콜릿 풍미가 더해진 하쿠슈의 한정 라인.",
    tags: ["개성파·실험적 풍미 선호", "묵직한 디저트 페어링", "시트러스·산미 선호"],
    similar: ["Hakushu DR", "Suntory Yamazaki Smoky Batch", "Yoichi Miyagikyo"],
  },
  "Hibiki 21": {
    desc: "히비키의 플래그십, 21년 숙성 원액들의 깊고 화려한 조화 — 일본 위스키의 정점.",
    tags: ["한정판·희소가치 선호", "묵직한 디저트 페어링", "트로피컬 과일향 선호"],
    similar: ["Hibiki Master Select", "Hibiki Blender's Choice", "Royal Salute 32y"],
  },
  "Starward Nova": {
    desc: "호주 레드와인 캐스크 숙성으로 베리류 과일향과 스파이스가 산뜻하게 느껴지는 입문 라인.",
    tags: ["가벼운 입문용", "트로피컬 과일향 선호", "개성파·실험적 풍미 선호"],
    similar: ["Starward Fortis", "Starward Solera", "Arran Amarone Cask Finish"],
  },
  "Starward Fortis": {
    desc: "노바보다 진한 와인 캐스크 풍미, 다크 체리와 스파이스가 묵직하게 느껴지는 라인.",
    tags: ["트로피컬 과일향 선호", "우디·스파이시 선호", "개성파·실험적 풍미 선호"],
    similar: ["Starward Nova", "Starward Solera", "VHW Port Cask"],
  },
  "Starward Solera": {
    desc: "솔레라 시스템으로 블렌딩, 한층 부드럽고 복합적인 와인캐스크 단맛이 매력적이다.",
    tags: ["트로피컬 과일향 선호", "개성파·실험적 풍미 선호", "셰리캐스크·단맛 선호"],
    similar: ["Starward Fortis", "Starward Nova", "GlenAllachie Cuvée Cask"],
  },
  "Amrut Indian": {
    desc: "고온 숙성으로 빠르게 농축된 풍미, 진한 과일향과 스파이스가 인상적인 인도 몰트.",
    tags: ["개성파·실험적 풍미 선호", "트로피컬 과일향 선호", "가성비 선호"],
    similar: ["Amrut Fusion", "Amrut Peated", "Kavalan Solist Ex-Bourbon"],
  },
  "Amrut Peated": {
    desc: "인도산 피트 보리를 사용, 스모크와 열대 과일향이 독특하게 어우러지는 개성 있는 몰트.",
    tags: ["피트·스모키 애호가", "개성파·실험적 풍미 선호", "트로피컬 과일향 선호"],
    similar: ["Amrut Indian", "Amrut Fusion", "Kavalan Solist Peated"],
  },
  "Amrut Fusion": {
    desc: "인도산과 스코틀랜드산 피트 보리를 블렌딩, 스모크와 진한 과일향의 독특한 조화.",
    tags: ["개성파·실험적 풍미 선호", "피트·스모키 애호가", "트로피컬 과일향 선호"],
    similar: ["Amrut Peated", "Amrut Indian", "Kavalan Solist Peated"],
  },
  "Kavalan Solist Vinho Barrique": {
    desc: "레드와인 캐스크 싱글캐스크, 진한 베리류 과일과 스파이스가 화려하게 펼쳐진다.",
    tags: ["트로피컬 과일향 선호", "카스크스트랭스(고도수) 선호", "개성파·실험적 풍미 선호"],
    similar: ["Kavalan Solist Port", "Kavalan Solist Brandy", "Starward Fortis"],
  },
  "Kavalan Solist Port": {
    desc: "포트 와인 캐스크 싱글캐스크, 달콤한 베리잼과 다크 초콜릿 풍미가 진하게 느껴진다.",
    tags: ["트로피컬 과일향 선호", "묵직한 디저트 페어링", "카스크스트랭스(고도수) 선호"],
    similar: ["Kavalan Solist Vinho Barrique", "Kavalan Solist Oloroso Sherry", "Glendronach PortWood"],
  },
  "Kavalan Solist Ex-Bourbon": {
    desc: "버번 캐스크 싱글캐스크, 바닐라와 코코넛, 열대 과일향이 화려하게 폭발하는 카발란 스타일.",
    tags: ["트로피컬 과일향 선호", "버번·바닐라 선호", "카스크스트랭스(고도수) 선호"],
    similar: ["Amrut Indian", "Kavalan Solist Brandy", "Balvenie Caribbean Cask 14y"],
  },
  "Kavalan Solist Brandy": {
    desc: "브랜디 캐스크 피니시, 포도 풍미와 화려한 단맛이 더해진 카발란의 개성 있는 라인.",
    tags: ["트로피컬 과일향 선호", "개성파·실험적 풍미 선호", "카스크스트랭스(고도수) 선호"],
    similar: ["Kavalan Solist Ex-Bourbon", "Camus X.O", "Kavalan Solist Vinho Barrique"],
  },
  "Kavalan Solist Peated": {
    desc: "열대 기후 숙성 특유의 빠른 농축에 스모크가 더해진 강렬하고 개성 있는 피트 몰트.",
    tags: ["피트·스모키 애호가", "개성파·실험적 풍미 선호", "카스크스트랭스(고도수) 선호"],
    similar: ["Amrut Peated", "Octomore 14.1", "Kilchoman Sanaig"],
  },
  "Kavalan Solist Madeira": {
    desc: "마데이라 와인 캐스크 싱글캐스크, 견과류와 건과일 단맛이 진하게 농축된 풍미.",
    tags: ["셰리캐스크·단맛 선호", "카스크스트랭스(고도수) 선호", "묵직한 디저트 페어링"],
    similar: ["Balvenie Madeira Cask 15y", "Kavalan Solist Oloroso Sherry", "Kavalan Solist PX"],
  },
  "Kavalan Solist Oloroso Sherry": {
    desc: "올로로소 셰리 캐스크 싱글캐스크, 진한 건포도와 다크 초콜릿이 강렬하게 농축되어 있다.",
    tags: ["셰리캐스크·단맛 선호", "카스크스트랭스(고도수) 선호", "묵직한 디저트 페어링"],
    similar: ["Kavalan Solist Madeira", "Kavalan Solist PX", "Macallan Sherry Cask 18y"],
  },
  "Kavalan Solist PX": {
    desc: "페드로 히메네즈 캐스크, 짙은 건포도와 무화과 단맛이 폭발적으로 농축된 카발란 정점.",
    tags: ["셰리캐스크·단맛 선호", "카스크스트랭스(고도수) 선호", "묵직한 디저트 페어링"],
    similar: ["Kavalan Solist Oloroso Sherry", "Balvenie PX Cask 18y", "Aberlour A'bunadh"],
  },
  "Kavalan Solist Moscatel": {
    desc: "모스카텔 와인 캐스크, 화려한 머스캣 포도향과 꿀 같은 단맛이 인상적인 희소 라인.",
    tags: ["트로피컬 과일향 선호", "한정판·희소가치 선호", "카스크스트랭스(고도수) 선호"],
    similar: ["Kavalan Solist Vinho Barrique", "Glenmorangie Nectar D'Or", "Kavalan Solist Fino"],
  },
  "Kavalan Solist Fino": {
    desc: "피노 셰리 캐스크, 가볍고 산뜻한 산미와 견과류 풍미가 농축된 카발란 최상위 희소 라인.",
    tags: ["시트러스·산미 선호", "한정판·희소가치 선호", "카스크스트랭스(고도수) 선호"],
    similar: ["Kavalan Solist Moscatel", "Kavalan Solist Madeira", "Glenrothes WMC"],
  },
  "Camus VSOP": {
    desc: "포도 풍미와 부드러운 바닐라, 가벼운 꽃향이 어우러지는 입문용 코냑.",
    tags: ["가벼운 입문용", "브랜디 선호", "트로피컬 과일향 선호"],
    similar: ["Hennessy VSOP", "Camus X.O", "Remy Martin X.O"],
  },
  "Hennessy VSOP": {
    desc: "오크와 과일향이 부드럽게 균형 잡힌, 전 세계에서 가장 잘 알려진 스탠다드 코냑.",
    tags: ["가벼운 입문용", "브랜디 선호", "가성비 선호"],
    similar: ["Camus VSOP", "Hennessy X.O", "Remy Martin X.O"],
  },
  "Camus X.O": {
    desc: "오랜 숙성의 깊이, 건과일과 스파이스, 부드러운 오크가 풍성하게 어우러지는 프리미엄 코냑.",
    tags: ["브랜디 선호", "묵직한 디저트 페어링", "우디·스파이시 선호"],
    similar: ["Camus VSOP", "Remy Martin X.O", "Hennessy X.O"],
  },
  "Remy Martin X.O": {
    desc: "그란데 샹파뉴 원액의 깊은 풍미, 자두와 스파이스, 부드러운 단맛이 조화로운 코냑.",
    tags: ["브랜디 선호", "묵직한 디저트 페어링", "한정판·희소가치 선호"],
    similar: ["Camus X.O", "Hennessy X.O", "Camus VSOP"],
  },
  "Hennessy X.O": {
    desc: "헤네시의 플래그십, 건포도와 다크 초콜릿, 깊은 오크 풍미가 길게 이어지는 정점의 코냑.",
    tags: ["브랜디 선호", "묵직한 디저트 페어링", "한정판·희소가치 선호"],
    similar: ["Remy Martin X.O", "Camus X.O", "Royal Salute 32y"],
  },
};
