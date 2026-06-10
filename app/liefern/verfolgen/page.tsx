"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const STEPS = [
  { label: "Bestellung eingegangen", icon: "✅", delay: 0 },
  { label: "Wird zubereitet", icon: "👨‍🍳", delay: 8000 },
  { label: "Kurierfahrer unterwegs", icon: "🛵", delay: 20000 },
  { label: "Gleich da!", icon: "📍", delay: 40000 },
  { label: "Zugestellt!", icon: "🎉", delay: 55000 },
];

function VerfolgenContent() {
  const params = useSearchParams();
  const restaurantName = params.get("restaurant") || "Restaurant";
  const mapRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1000;
        const newStep = STEPS.findLastIndex((s) => s.delay <= next);
        if (newStep >= 0) setStep(newStep);
        if (next >= STEPS[STEPS.length - 1].delay) {
          clearInterval(interval);
          setArrived(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    let map: import("leaflet").Map | null = null;
    let marker: import("leaflet").Marker | null = null;
    let animFrame: number;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      // Fix default icon paths for Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Berlin Mitte area
      const startLat = 52.520;
      const startLng = 13.400;
      const endLat = 52.512;
      const endLng = 13.420;

      map = L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView(
        [startLat, startLng], 14
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const courierIcon = L.divIcon({
        html: '<div style="font-size:28px;line-height:1;">🛵</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        className: "",
      });

      const destIcon = L.divIcon({
        html: '<div style="font-size:24px;line-height:1;">📍</div>',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        className: "",
      });

      L.marker([endLat, endLng], { icon: destIcon }).addTo(map);
      marker = L.marker([startLat, startLng], { icon: courierIcon }).addTo(map);

      const totalDuration = STEPS[STEPS.length - 1].delay;
      let startTime: number | null = null;

      const animate = (ts: number) => {
        if (!startTime) startTime = ts;
        const prog = Math.min((ts - startTime) / totalDuration, 1);
        const easedProg = prog < 0.5 ? 2 * prog * prog : -1 + (4 - 2 * prog) * prog;
        const lat = startLat + (endLat - startLat) * easedProg;
        const lng = startLng + (endLng - startLng) * easedProg;
        marker?.setLatLng([lat, lng]);
        if (prog < 1) animFrame = requestAnimationFrame(animate);
      };

      animFrame = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(animFrame);
      map?.remove();
    };
  }, []);

  const remaining = Math.max(0, Math.ceil((STEPS[STEPS.length - 1].delay - elapsed) / 1000));
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      <div className="bg-slate-800/80 border-b border-slate-700/50 px-4 py-2 text-center">
        <p className="text-xs text-slate-500">
          ⚠️ Zum Spaß — kein echtes Essen, kein echter Kurierfahrer. Alles virtuell!
        </p>
      </div>

      <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
        <Link href="/liefern" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
          ← Neue Bestellung
        </Link>
        <span className="text-slate-600">|</span>
        <span className="text-sm text-slate-400">Sendungsverfolgung</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pb-16">
        {arrived ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-12 text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Dein Essen ist angekommen!</h2>
            <p className="text-slate-400 text-sm mb-6">
              Deine virtuelle Bestellung von <strong>{restaurantName}</strong> wurde erfolgreich zugestellt.
              Guten Appetit! 😋
            </p>
            <Link href="/liefern"
              className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              Neue Bestellung aufgeben
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5 mb-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-0.5">Bestellung bei</div>
              <div className="font-semibold text-slate-100">{restaurantName}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-0.5">Noch ca.</div>
              <div className="text-2xl font-bold text-orange-300 tabular-nums">
                {mins}:{secs.toString().padStart(2, "0")}
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-slate-700/60 mb-5" style={{ height: 320 }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        </div>

        {/* Steps */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-5">
          <h3 className="font-semibold text-slate-200 mb-4">Bestellstatus</h3>
          <div className="space-y-3">
            {STEPS.map((s, i) => {
              const active = i === step && !arrived;
              const done = i < step || arrived;
              return (
                <div key={i} className={`flex items-center gap-3 transition-all ${done ? "opacity-100" : active ? "opacity-100" : "opacity-30"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${done ? "bg-emerald-500/20 text-emerald-300" : active ? "bg-orange-500/20 text-orange-300 animate-pulse" : "bg-slate-800 text-slate-500"}`}>
                    {done ? "✓" : s.icon}
                  </div>
                  <span className={`text-sm ${done ? "text-slate-300" : active ? "text-slate-100 font-medium" : "text-slate-500"}`}>
                    {s.label}
                  </span>
                  {active && <span className="ml-auto text-xs text-orange-300 animate-pulse">In Bearbeitung…</span>}
                  {done && i === STEPS.length - 1 && <span className="ml-auto text-xs text-emerald-400">✓ Fertig</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerfolgenPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-slate-400">Wird geladen…</div>}>
      <VerfolgenContent />
    </Suspense>
  );
}
