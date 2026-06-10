"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const TRACK_STEPS = [
  { label: "Bestellung bestätigt", icon: "✅", delay: 0 },
  { label: "Paket wird vorbereitet", icon: "📦", delay: 5000 },
  { label: "Vom PKT-Express abgeholt", icon: "🚚", delay: 15000 },
  { label: "Im Paketzentrum", icon: "🏭", delay: 25000 },
  { label: "Unterwegs zu dir", icon: "🛻", delay: 38000 },
  { label: "Zugestellt!", icon: "🎉", delay: 52000 },
];

function BestellungContent() {
  const params = useSearchParams();
  const orderNum = params.get("order") || "DE-0000-0000";
  const items = parseInt(params.get("items") || "1");

  const [step, setStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 2);
  const dateStr = estimatedDate.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1000;
        const newStep = TRACK_STEPS.findLastIndex((s) => s.delay <= next);
        if (newStep >= 0) setStep(newStep);
        if (next >= TRACK_STEPS[TRACK_STEPS.length - 1].delay) {
          clearInterval(interval);
          setDone(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.min(100, (elapsed / TRACK_STEPS[TRACK_STEPS.length - 1].delay) * 100);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      <div className="bg-slate-800/80 border-b border-slate-700/50 px-4 py-2 text-center">
        <p className="text-xs text-slate-500">
          ⚠️ Simulationsseite — Diese Bestellung und Lieferung ist vollständig fiktiv.
        </p>
      </div>

      <nav className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
        <Link href="/shoppen" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
          ← Weiter shoppen
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-5">
        {/* Order confirmation */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Bestellnummer</div>
              <div className="font-mono font-bold text-slate-100 text-lg">{orderNum}</div>
            </div>
            <span className="text-3xl">📦</span>
          </div>
          <div className="flex gap-4 text-sm text-slate-400">
            <span>🛍️ {items} {items === 1 ? "Artikel" : "Artikel"}</span>
            <span>📅 Lieferung: {dateStr} (fiktiv)</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-200">PKT Express Sendungsverfolgung</span>
            <span className="text-xs text-slate-500">fiktive Sendung</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="space-y-3">
            {TRACK_STEPS.map((s, i) => {
              const isActive = i === step && !done;
              const isDone = i < step || done;
              return (
                <div key={i} className={`flex items-center gap-3 transition-opacity ${isDone ? "opacity-100" : isActive ? "opacity-100" : "opacity-25"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${isDone ? "bg-emerald-500/20 text-emerald-300" : isActive ? "bg-blue-500/20 text-blue-300 animate-pulse" : "bg-slate-800"}`}>
                    {isDone ? "✓" : s.icon}
                  </div>
                  <span className={`text-sm ${isDone ? "text-slate-300" : isActive ? "text-slate-100 font-medium" : "text-slate-600"}`}>
                    {s.label}
                  </span>
                  {isActive && <span className="ml-auto text-xs text-blue-300 animate-pulse">In Bearbeitung…</span>}
                </div>
              );
            })}
          </div>
        </div>

        {done && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Dein Paket ist angekommen!</h2>
            <p className="text-slate-400 text-sm mb-5">
              Deine fiktive Bestellung <strong>{orderNum}</strong> wurde virtuell zugestellt. Viel Spaß!
            </p>
            <Link href="/shoppen"
              className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              Weiter shoppen
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BestellungPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-slate-400">Wird geladen…</div>}>
      <BestellungContent />
    </Suspense>
  );
}
