import Link from "next/link";
import { ArrowRight, Wine, Sparkles, Flame } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignatureHero } from "@/components/home/SignatureHero";
import { RecommendedMenuRow } from "@/components/home/RecommendedMenuRow";
import { formatKRW } from "@/lib/utils";
import type { Menu } from "@/types/database";

export const dynamic = "force-dynamic";

async function getRecommended(): Promise<Menu[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("menus")
      .select("*")
      .eq("is_active", true)
      .eq("is_recommended", true)
      .order("price", { ascending: false })
      .limit(6);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const recommended = await getRecommended();

  return (
    <div className="relative">
      {/* HERO */}
      <SignatureHero />

      {/* RECOMMENDED ROW */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="font-serif text-xs uppercase tracking-widest2 text-gold">
              <Sparkles className="mr-2 inline h-3.5 w-3.5" strokeWidth={1.5} />
              Signature Selections
            </p>
            <h2 className="display-heading mt-3 text-4xl lg:text-5xl">
              The Curator's Choice
            </h2>
            <p className="mt-4 max-w-xl font-serif text-base text-ivory/70">
              바텐더가 직접 큐레이션한 오늘의 한 잔.
              느린 시간을 위해 준비된 시그니처 메뉴를 만나보세요.
            </p>
          </div>
          <Link
            href="/menu"
            className="hidden items-center gap-2 font-serif text-sm uppercase tracking-widest2 text-ivory/80 transition-colors hover:text-gold md:inline-flex"
          >
            View All
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>

        <RecommendedMenuRow items={recommended} />
      </section>

      {/* STORY / WEEKLY EVENT BLOCK */}
      <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-10">
        <div className="glass-card grid gap-10 p-10 lg:grid-cols-2 lg:p-16">
          <div>
            <p className="font-serif text-xs uppercase tracking-widest2 text-gold">
              <Flame className="mr-2 inline h-3.5 w-3.5" strokeWidth={1.5} />
              Weekly Event
            </p>
            <h3 className="display-heading mt-3 text-3xl lg:text-4xl">
              Random Whisky Game
            </h3>
            <p className="mt-4 font-serif text-lg leading-relaxed text-ivory/75">
              바텐더가 위스키의 이름을 가르쳐주지 않고 드립니다.
              <br />
              정답을 맞추면 <span className="text-gold">1 + 1</span>.
              <br />
              <span className="text-ivory/60">
                1, 2, 3, 4, 5 만원대 위스키 중 택 1.
              </span>
            </p>
            <Link href="/menu?category=signature" className="btn-gold mt-8">
              See This Week's Picks
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Weekly highlight list */}
          <div className="space-y-4">
            {[
              { name: "발렌타인 30년 30ml", before: 65000, after: 39000 },
              { name: "옥토모어 .1.2 30ml", before: 55000, after: 39000 },
              { name: "로얄브라큘라 21 30ml", before: 65000, after: 45000 },
              { name: "글렌피딕 23년 30ml", before: 78000, after: 60000 },
              { name: "로얄살루트 21년 30ml", before: 36000, after: 25000 },
            ].map((item) => (
              <div
                key={item.name}
                className="group flex items-center justify-between gap-4 border-b border-gold/10 pb-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Wine className="h-4 w-4 text-gold/70" strokeWidth={1.5} />
                  <span className="font-serif text-base text-ivory/90">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-sans text-xs text-ivory/40 line-through">
                    {formatKRW(item.before)}
                  </span>
                  <span className="ml-3 font-serif text-lg font-medium text-gold">
                    ₩{formatKRW(item.after)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
