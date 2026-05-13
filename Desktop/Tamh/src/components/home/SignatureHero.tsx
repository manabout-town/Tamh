"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Wine } from "lucide-react";

export function SignatureHero() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden px-6 pb-24 pt-20 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12 lg:items-center">
        {/* Copy */}
        <div className="lg:col-span-7">
          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-serif text-xs uppercase tracking-widest2 text-gold"
          >
            — A Quiet Evening, Beautifully Served
          </motion.p>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
            className="display-heading mt-6 text-[clamp(3rem,9vw,7.5rem)] leading-[0.95]"
          >
            <span className="text-gold-gradient">TÀMH</span>
            <br />
            <span className="text-ivory/90">Single Malt</span>
            <br />
            <span className="font-serif italic text-ivory/70 text-[0.55em] normal-case tracking-normal">
              &amp; Cocktail Bar
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 max-w-xl font-serif text-lg leading-relaxed text-ivory/75"
          >
            세계 각지의 싱글 몰트와 정성껏 만든 한 잔의 칵테일.
            <br />
            천천히, 그리고 깊이 — TÀMH에서 당신의 저녁이 시작됩니다.
          </motion.p>

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <Link href="/menu" className="btn-gold">
              <Wine className="h-4 w-4" strokeWidth={1.8} />
              Explore the Menu
            </Link>
            <Link href="#signature" className="btn-ghost">
              Today's Signature
              <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>

        {/* Visual block */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.1, ease: "easeOut" }}
          className="relative hidden lg:col-span-5 lg:block"
        >
          <div className="glass-card aspect-[3/4] w-full overflow-hidden">
            <div
              className="relative h-full w-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(212,175,55,0.15) 0%, rgba(20,20,24,0.4) 50%, rgba(92,31,44,0.25) 100%)",
              }}
            >
              {/* Decorative content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                <div className="display-heading text-[18vw] leading-none text-gold/10 lg:text-[10vw]">
                  T
                </div>
                <p className="-mt-6 font-serif text-xs uppercase tracking-widest2 text-gold/80">
                  Est. 2024 · Seoul
                </p>
                <div className="gold-divider w-32" />
                <p className="max-w-[18ch] font-serif text-2xl italic text-ivory/85">
                  "Time, slowly poured into a glass."
                </p>
              </div>

              {/* Inner gold frame */}
              <div className="pointer-events-none absolute inset-4 rounded-xl border border-gold/20" />
            </div>
          </div>

          {/* Floating accent */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-6 -top-6 h-24 w-24 rounded-full border border-gold/30 bg-charcoal-100/30 backdrop-blur-luxe"
          >
            <div className="flex h-full w-full items-center justify-center">
              <Wine className="h-8 w-8 text-gold" strokeWidth={1.2} />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-gold/60 md:block"
      >
        <ArrowDown className="h-5 w-5" strokeWidth={1.2} />
      </motion.div>
    </section>
  );
}
