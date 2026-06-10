"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import restaurants from "@/public/data/restaurants.json";

type CartItem = { id: string; name: string; price: number; emoji: string; qty: number };

export default function LiefernPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ordering, setOrdering] = useState(false);

  const restaurant = restaurants.find((r) => r.id === selected);

  const addToCart = (item: { id: string; name: string; price: number; emoji: string }) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.flatMap((c) => c.id === id ? (c.qty > 1 ? [{ ...c, qty: c.qty - 1 }] : []) : [c]));
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const handleOrder = () => {
    if (cart.length === 0 || !selected) return;
    setOrdering(true);
    setTimeout(() => {
      router.push(`/liefern/verfolgen?restaurant=${encodeURIComponent(restaurant!.name)}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      {/* Disclaimer */}
      <div className="bg-slate-800/80 border-b border-slate-700/50 px-4 py-2 text-center">
        <p className="text-xs text-slate-500">
          ⚠️ Simulationsseite — kein echter Kauf, keine echte Lieferung. Alles fiktiv.
        </p>
      </div>

      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-slate-400 hover:text-slate-200 transition-colors text-sm">
          ← Zurück
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">🛵</span>
          <span className="font-bold text-lg">Lieferhase</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
            virtuell
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        {!selected ? (
          <>
            <h1 className="text-2xl font-bold mb-1">Restaurant wählen</h1>
            <p className="text-slate-400 text-sm mb-6">Wo soll dein fiktives Essen herkommen?</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {restaurants.map((r) => (
                <button key={r.id} onClick={() => setSelected(r.id)}
                  className={`text-left rounded-2xl border border-slate-700/60 bg-gradient-to-br ${r.color} p-5 hover:scale-[1.01] transition-all`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{r.emoji}</span>
                    <div>
                      <div className="font-semibold text-slate-100">{r.name}</div>
                      <div className="text-xs text-slate-400">{r.cuisine}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>⭐ {r.rating} ({r.reviews})</span>
                    <span>🕐 {r.delivery}</span>
                    <span>Min. {r.min}€</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Menu */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <button onClick={() => { setSelected(null); setCart([]); }}
                  className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
                  ← Restaurant wechseln
                </button>
                <span className="text-slate-600">|</span>
                <span className="font-semibold">{restaurant?.name}</span>
              </div>
              <div className="space-y-3">
                {restaurant?.items.map((item) => {
                  const inCart = cart.find((c) => c.id === item.id);
                  return (
                    <div key={item.id}
                      className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 flex items-center gap-4">
                      <span className="text-3xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-100">{item.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-slate-200 mb-1">{item.price.toFixed(2)}€</div>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => removeFromCart(item.id)}
                              className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 text-sm hover:bg-slate-600 transition-colors">
                              −
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{inCart.qty}</span>
                            <button onClick={() => addToCart(item)}
                              className="w-6 h-6 rounded-full bg-orange-500 text-white text-sm hover:bg-orange-400 transition-colors">
                              +
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(item)}
                            className="px-3 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-xs hover:bg-orange-500/30 transition-colors">
                            + Hinzufügen
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart */}
            <div className="md:col-span-1">
              <div className="sticky top-6 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5">
                <h3 className="font-semibold text-slate-100 mb-4">
                  🛒 Warenkorb {cartCount > 0 && <span className="text-orange-300">({cartCount})</span>}
                </h3>
                {cart.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-6">Noch nichts im Korb 🛒</p>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      {cart.map((c) => (
                        <div key={c.id} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{c.qty}× {c.name}</span>
                          <span className="text-slate-400">{(c.price * c.qty).toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-700/60 pt-3 mb-4">
                      <div className="flex justify-between text-sm text-slate-400 mb-1">
                        <span>Lieferung (fiktiv)</span>
                        <span>0,00€</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-100">
                        <span>Gesamt</span>
                        <span>{total.toFixed(2)}€</span>
                      </div>
                    </div>
                    <button onClick={handleOrder} disabled={ordering}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:opacity-90 disabled:opacity-70 transition-opacity text-sm">
                      {ordering ? "Wird bestellt… 🛵" : "Jetzt bestellen (fiktiv)"}
                    </button>
                    <p className="text-xs text-slate-600 text-center mt-2">
                      Es wird nichts berechnet oder geliefert.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
