import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AmbientBackground } from "@/components/layout/AmbientBackground";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// 영문 디스플레이 — 굵고 우아하지만 가독성 좋은 세리프
const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// 한글 본문 — 깔끔한 고딕
const korean = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-korean",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TÀMH — POS",
  description: "TÀMH 매장 운영 — 메뉴 관리 + 매장 도면",
  metadataBase: new URL("https://bartamh.imweb.me"),
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${serif.variable} ${sans.variable} ${display.variable} ${korean.variable}`}
    >
      <body className="font-sans antialiased noise-overlay luxe-scroll">
        <AmbientBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
