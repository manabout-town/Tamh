import Link from "next/link";
import { LayoutDashboard, ListOrdered, BookOpen, ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-32 pt-12 lg:px-10">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-gold/15 pb-8">
        <div>
          <p className="font-serif text-xs uppercase tracking-widest2 text-gold">
            <LayoutDashboard className="mr-2 inline h-3.5 w-3.5" strokeWidth={1.5} />
            Administration
          </p>
          <h1 className="display-heading mt-3 text-[clamp(2.5rem,5vw,4rem)] leading-none">
            Owner's Lounge
          </h1>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-charcoal-100/40 px-4 py-2 text-xs uppercase tracking-widest2 text-ivory transition-all hover:border-gold/60 hover:text-gold"
          >
            <ListOrdered className="h-3.5 w-3.5" strokeWidth={1.5} />
            Orders
          </Link>
          <Link
            href="/admin/menus"
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-charcoal-100/40 px-4 py-2 text-xs uppercase tracking-widest2 text-ivory transition-all hover:border-gold/60 hover:text-gold"
          >
            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
            Menus
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest2 text-ivory/50 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            Back
          </Link>
        </nav>
      </header>

      {children}
    </div>
  );
}
