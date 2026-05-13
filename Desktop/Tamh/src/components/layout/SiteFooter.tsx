import { MapPin, Phone, Clock, Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-gold/10 bg-charcoal-400/60 backdrop-blur-luxe">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-3 lg:px-10">
        <div>
          <h3 className="display-heading text-2xl text-gold-gradient">TÀMH</h3>
          <p className="mt-4 max-w-md font-serif text-base leading-relaxed text-ivory/70">
            한 잔의 위스키, 그리고 천천히 흐르는 저녁.
            <br />
            TÀMH는 당신의 시간이 더 우아해지는 곳입니다.
          </p>
        </div>

        <div className="space-y-3 text-sm text-ivory/70">
          <h4 className="mb-3 font-serif text-xs uppercase tracking-widest2 text-gold">
            Visit
          </h4>
          <p className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
            <span>서울특별시 어딘가의 우아한 모퉁이</span>
          </p>
          <p className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
            <span>예약 문의 · 카카오톡 채널</span>
          </p>
          <p className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
            <span>Tue – Sun · 7pm – 2am</span>
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-serif text-xs uppercase tracking-widest2 text-gold">
            Follow
          </h4>
          <a
            href="https://bartamh.imweb.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-sm text-ivory/70 transition-colors hover:text-gold"
          >
            <Instagram className="h-4 w-4 text-gold" strokeWidth={1.5} />
            @bartamh
          </a>
        </div>
      </div>

      <div className="border-t border-gold/10 py-6 text-center">
        <p className="font-serif text-xs uppercase tracking-widest2 text-ivory/40">
          © {new Date().getFullYear()} TÀMH · Crafted with care.
        </p>
      </div>
    </footer>
  );
}
