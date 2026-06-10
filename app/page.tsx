"use client";

import Link from "next/link";

const modes = [
  {
    href: "/liefern",
    emoji: "🛵",
    title: "Lieferhase",
    subtitle: "Essen bestellen",
    desc: "Wähle dein Lieblingsrestaurant, fülle deinen Warenkorb und verfolge deinen virtuellen Kurierfahrer live auf der Karte.",
    color: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300",
    badgeText: "Beliebt",
  },
  {
    href: "/shoppen",
    emoji: "📦",
    title: "Schnellkauf",
    subtitle: "Online einkaufen",
    desc: "Stöbere durch Produkte, leg sie in den Warenkorb und verfolge dein Paket mit einem virtuellen PKT-Tracker — ganz ohne Kosten.",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300",
    badgeText: "Neu",
  },
  {
    href: "/pause",
    emoji: "☕",
    title: "Kaffeepause",
    subtitle: "Gemeinsam entspannen",
    desc: "Mach eine virtuelle Kaffeepause mit anderen — sieh wer gerade pausiert, starte deinen Timer und hinterlass eine Nachricht.",
    color: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300",
    badgeText: "Entspannend",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Disclaimer Banner */}
      <div className="relative z-10 bg-slate-800/80 border-b border-slate-700/50 px-4 py-2 text-center">
        <p className="text-xs text-slate-400">
          ⚠️{" "}
          <strong className="text-slate-300">Simulationsseite zu reinen Unterhaltungszwecken.</strong>{" "}
          Zum Spaß — kein echter Kauf, keine echte Lieferung. Alles virtuell & kostenlos.
        </p>
      </div>

      {/* Nav */}
      <nav className="relative z-10 max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <span className="font-bold text-xl tracking-tight">Kaufamin</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 ml-1">
            100% virtuell
          </span>
        </div>
        <a href="#was-ist-das" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
          Was ist das?
        </a>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Inspiriert vom Dopamin-Trend aus Südkorea 🇰🇷
        </div>
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Einkaufen ohne{" "}
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Reue
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-3">
          Das gute Gefühl beim Bestellen — ohne den Preis zu zahlen.
          Virtuelles Einkaufserlebnis für entspannte Momente.
        </p>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Kein Geld, keine Lieferung, keine Reue. Nur purer Spaß. 🧠✨
        </p>
      </section>

      {/* Mode Cards */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {modes.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`group rounded-2xl border ${m.border} bg-gradient-to-br ${m.color} p-6 hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{m.emoji}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full ${m.badge}`}>{m.badgeText}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 mb-0.5">{m.title}</h2>
              <p className="text-sm text-slate-400 mb-3">{m.subtitle}</p>
              <p className="text-sm text-slate-300 leading-relaxed">{m.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                Jetzt ausprobieren{" "}
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Was ist das */}
      <section id="was-ist-das" className="relative z-10 max-w-3xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-8">
          <h2 className="text-2xl font-bold mb-4">Was ist Kaufamin? 🤔</h2>
          <div className="space-y-3 text-slate-400 text-sm leading-relaxed">
            <p>
              In Südkorea wurde 2026 ein neuer digitaler Trend viral: sogenannte{" "}
              <strong className="text-slate-300">„Dopamin-Websites"</strong>, auf denen man virtuell
              bestellt, ohne wirklich zu kaufen. Das Erlebnis des Stöberns erzeugt ein echtes
              Wohlgefühl — ganz ohne Reue.
            </p>
            <p>
              Kaufamin bringt dieses Konzept nach Deutschland und Europa — angepasst an unsere
              Kultur: Döner bestellen, Online-Shopping und die heilige Kaffeepause.
            </p>
            <p>
              <strong className="text-slate-300">Für wen ist das?</strong> Für alle, die mal kurz
              abschalten und sich den Spaß des Shoppings gönnen möchten — ohne dabei Geld auszugeben.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-6 px-6 text-center">
        <p className="text-xs text-slate-600">
          © 2026 Kaufamin · Zum Spaß — alles virtuell & kostenlos ·{" "}
          <Link href="/impressum" className="hover:text-slate-400 transition-colors">
            Impressum
          </Link>
          {" · "}
          <Link href="/datenschutz" className="hover:text-slate-400 transition-colors">
            Datenschutz
          </Link>
        </p>
      </footer>
    </div>
  );
}
