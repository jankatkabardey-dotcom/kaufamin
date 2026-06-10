"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import products from "@/public/data/products.json";

type CartItem = { id: string; name: string; price: number; emoji: string; qty: number };

export default function ShoppenPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkedOut, setCheckedOut] = useState(false);
  const [filter, setFilter] = useState("Alle");
  const [address, setAddress] = useState("");

  const categories = ["Alle", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = filter === "Alle" ? products : products.filter((p) => p.category === filter);

  const addToCart = (p: typeof products[0]) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === p.id);
      if (ex) return prev.map((c) => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: p.id, name: p.name, price: p.price, emoji: p.emoji, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.flatMap((c) => c.id === id ? (c.qty > 1 ? [{ ...c, qty: c.qty - 1 }] : []) : [c]));
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckedOut(true);
    const orderNum = `DE-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const addr = address.trim() || "Deutschland";
    setTimeout(() => {
      router.push(`/shoppen/bestellung?order=${orderNum}&items=${cartCount}&address=${encodeURIComponent(addr)}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      <div className="bg-slate-800/80 border-b border-slate-700/50 px-4 py-2 text-center">
        <p className="text-xs text-slate-500">
          ⚠️ Zum Spaß — kein echter Kauf, keine echte Lieferung.
        </p>
      </div>

      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">← Zurück</Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">📦</span>
          <span className="font-bold text-lg">Schnellkauf</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">virtuell</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${filter === cat ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((p) => {
                const inCart = cart.find((c) => c.id === p.id);
                return (
                  <div key={p.id} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 overflow-hidden flex flex-col">
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image src={p.image} alt={p.name} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                      {p.badge && (
                        <div className="absolute top-2 left-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500 text-white font-medium">{p.badge}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="text-sm font-medium text-slate-100 mb-1 flex-1">{p.name}</div>
                      <div className="text-xs text-slate-500 mb-2">{p.category}</div>
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-yellow-400 text-xs">{"★".repeat(Math.round(p.rating))}</span>
                        <span className="text-xs text-slate-500">({p.reviews.toLocaleString("de-DE")})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-slate-100">{p.price.toFixed(2)}€</span>
                        {p.oldPrice && (
                          <span className="text-xs text-slate-500 line-through">{p.oldPrice.toFixed(2)}€</span>
                        )}
                      </div>
                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(p.id)}
                            className="flex-1 py-1.5 rounded-lg bg-slate-700 text-slate-200 text-sm hover:bg-slate-600 transition-colors">−</button>
                          <span className="text-sm font-medium w-6 text-center">{inCart.qty}</span>
                          <button onClick={() => addToCart(p)}
                            className="flex-1 py-1.5 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-400 transition-colors">+</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(p)}
                          className="w-full py-2 rounded-lg bg-blue-500/20 text-blue-300 text-sm hover:bg-blue-500/30 transition-colors">
                          In den Warenkorb
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5">
              <h3 className="font-semibold text-slate-100 mb-4">
                🛒 Warenkorb {cartCount > 0 && <span className="text-blue-300">({cartCount})</span>}
              </h3>
              {cart.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">Noch leer 📦</p>
              ) : (
                <>
                  <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                    {cart.map((c) => (
                      <div key={c.id} className="flex items-center gap-2 text-xs">
                        <span>{c.emoji}</span>
                        <span className="flex-1 text-slate-300 truncate">{c.qty}× {c.name}</span>
                        <span className="text-slate-400 shrink-0">{(c.price * c.qty).toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>
                  {/* Address */}
                  <div className="mb-4">
                    <label className="block text-xs text-slate-400 mb-1.5">📍 Lieferadresse (nur zum Spaß)</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="z.B. Unter den Linden 1, Berlin"
                      className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
                    />
                  </div>

                  <div className="border-t border-slate-700/60 pt-3 mb-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Versand (gratis)</span><span>0,00€</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-100">
                      <span>Gesamt</span><span>{total.toFixed(2)}€</span>
                    </div>
                  </div>
                  <button onClick={handleCheckout} disabled={checkedOut}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 disabled:opacity-70 transition-opacity text-sm">
                    {checkedOut ? "Wird bearbeitet… 📦" : "Zur Kasse — zum Spaß! 📦"}
                  </button>
                  <p className="text-xs text-slate-600 text-center mt-2">Es wird nichts berechnet.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
