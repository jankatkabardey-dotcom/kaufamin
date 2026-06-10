"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const PAUSE_DURATION = 10 * 60;

const PRESET_MESSAGES = [
  "Feierabend bald… 😮‍💨",
  "Montag ist wirklich hart 😅",
  "Kaffee #3 heute ☕",
  "Brauche dringend Urlaub 🏖️",
  "Fast geschafft! 💪",
  "Dieser Meeting-Marathon heute… 😩",
  "Wenigstens gibt es Kaffee ☕",
  "Die Woche geht vorbei 🌈",
];

function generateFakeOnline(): number {
  return Math.floor(47 + Math.random() * 30);
}

export default function PausePage() {
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(PAUSE_DURATION);
  const [done, setDone] = useState(false);
  const [messages, setMessages] = useState<{ text: string; time: string; own?: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [online, setOnline] = useState(generateFakeOnline());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paused || done) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, done]);

  // Fake messages pop in randomly
  useEffect(() => {
    if (!paused || done) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    PRESET_MESSAGES.forEach((msg, i) => {
      const delay = (i + 1) * (8000 + Math.random() * 12000);
      timeouts.push(setTimeout(() => {
        const now = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
        setMessages((prev) => [...prev, { text: msg, time: now }]);
        setOnline(generateFakeOnline());
      }, delay));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [paused, done]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startPause = () => {
    setPaused(true);
    const now = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    setMessages([{ text: "Du hast deine Pause begonnen ☕", time: now, own: true }]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { text: input.trim(), time: now, own: true }]);
    setInput("");
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      <div className="bg-slate-800/80 border-b border-slate-700/50 px-4 py-2 text-center">
        <p className="text-xs text-slate-500">
          ⚠️ Simulationsseite — Alle Nutzer und Nachrichten sind fiktiv oder anonym.
        </p>
      </div>

      <nav className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">← Zurück</Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">☕</span>
          <span className="font-bold text-lg">Kaffeepause</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">virtuell</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pb-16">
        {!paused ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">☕</div>
            <h1 className="text-3xl font-bold mb-3">Zeit für eine Pause</h1>
            <p className="text-slate-400 mb-2">
              Mach 10 Minuten virtuelle Kaffeepause — gemeinsam mit anderen.
            </p>
            <p className="text-slate-500 text-sm mb-8">
              Gerade pausieren{" "}
              <span className="text-amber-300 font-semibold">{online}</span> andere Personen.
            </p>
            <button onClick={startPause}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-lg hover:opacity-90 transition-opacity shadow-xl shadow-amber-500/20">
              Pause starten ☕
            </button>
          </div>
        ) : done ? (
          <div className="text-center py-16">
            <div className="text-7xl mb-5">⏰</div>
            <h2 className="text-2xl font-bold mb-2">Pause vorbei!</h2>
            <p className="text-slate-400 mb-6">
              10 Minuten Kaffeepause geschafft. Zeit, weiterzumachen! 💪
            </p>
            <button onClick={() => { setPaused(false); setDone(false); setTimeLeft(PAUSE_DURATION); setMessages([]); setOnline(generateFakeOnline()); }}
              className="px-8 py-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors">
              Neue Pause starten
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Timer */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
              <div className="text-xs text-slate-500 mb-2">Pausenzeit</div>
              <div className="text-6xl font-bold tabular-nums text-amber-300 mb-2">
                {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-1000"
                  style={{ width: `${(1 - timeLeft / PAUSE_DURATION) * 100}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Gerade in der Pause:{" "}
                <span className="text-amber-300 font-semibold">{online}</span> Personen
              </p>
            </div>

            {/* Messages */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-slate-300 font-medium">Pausenraum</span>
                <span className="text-xs text-slate-500 ml-auto">anonym</span>
              </div>
              <div className="h-56 overflow-y-auto p-4 space-y-2">
                {messages.map((m, i) => (
                  <div key={i} className={`flex items-start gap-2 ${m.own ? "flex-row-reverse" : ""}`}>
                    <div className={`text-xs px-3 py-2 rounded-2xl max-w-xs ${m.own ? "bg-amber-500/20 text-amber-100" : "bg-slate-800 text-slate-300"}`}>
                      {m.text}
                    </div>
                    <span className="text-xs text-slate-600 mt-1 shrink-0">{m.time}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="border-t border-slate-800 p-3 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Schreib etwas… (anonym)"
                  maxLength={80}
                  className="flex-1 bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <button type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-sm hover:bg-amber-500/30 transition-colors">
                  Senden
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
