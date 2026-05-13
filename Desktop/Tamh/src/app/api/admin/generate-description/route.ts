import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * POST /api/admin/generate-description
 *
 * 입력: { name, name_ko?, origin?, cask_type?, abv? }
 * 출력: { description: string }
 *
 * Gemini를 활용해 럭셔리 위스키 바 메뉴의 설명문을 우아한 문체로 자동 생성.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY가 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  try {
    const { name, name_ko, origin, cask_type, abv } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "name 필드는 필수입니다." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `당신은 서울의 럭셔리 싱글몰트 위스키 바 "TÀMH"의 시니어 바텐더이자 위스키 큐레이터입니다.
아래의 위스키/주류에 대한 메뉴 설명문을 작성해주세요.

— 작성 규칙 —
1. 한국어로, 2~3문장(약 80~120자) 길이
2. 우아하고 시적인 문체. 잡지 에디토리얼 톤
3. 향(노즈), 맛(팔레트), 여운(피니쉬) 중 1~2가지를 자연스럽게 묘사
4. 클리셰("최고의", "환상적인" 등) 금지 — 구체적 감각 단어 사용
5. 마케팅 광고 같은 어조는 피하고, 한 잔의 시간이 떠오르는 묘사
6. 끝맺음에 점잖은 격을 유지 (이모지 금지)

— 위스키 정보 —
영문명: ${name}
${name_ko ? `한글명: ${name_ko}` : ""}
${origin ? `지역/원산지: ${origin}` : ""}
${cask_type ? `숙성: ${cask_type}` : ""}
${abv ? `도수: ${abv}%` : ""}

설명문만 출력하세요 (앞뒤 인용부호, 머리말, 따옴표 모두 제외).`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // 가끔 따옴표가 붙는 경우 제거
    const cleaned = text.replace(/^["「『]|["」』]$/g, "").trim();

    return NextResponse.json({ description: cleaned });
  } catch (error: any) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: error?.message ?? "생성 실패" },
      { status: 500 },
    );
  }
}
