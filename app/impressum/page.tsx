import Link from "next/link";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      <nav className="max-w-2xl mx-auto px-6 py-4">
        <Link href="/" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">← Zurück</Link>
      </nav>
      <div className="max-w-2xl mx-auto px-6 pb-16">
        <h1 className="text-2xl font-bold mb-6">Impressum</h1>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 space-y-4 text-sm text-slate-400 leading-relaxed">
          <div>
            <h2 className="text-slate-200 font-semibold mb-1">Angaben gemäß § 5 TMG</h2>
            <p>Diese Website befindet sich derzeit im Aufbau. Ein vollständiges Impressum wird nach erfolgter Gewerbeanmeldung bereitgestellt.</p>
          </div>
          <div>
            <h2 className="text-slate-200 font-semibold mb-1">Hinweis zur Simulationsseite</h2>
            <p>
              Kaufamin (vormals Scheinshop) ist eine Simulationsseite, die ausschließlich zu Unterhaltungszwecken betrieben wird.
              Es findet kein echter Kaufvertrag, keine echte Bestellung und keine echte Lieferung statt.
              Alle dargestellten Produkte, Restaurants, Kurierfahrer und Sendungsinformationen sind vollständig fiktiv
              und dienen lediglich der Simulation eines Einkaufserlebnisses.
            </p>
          </div>
          <div>
            <h2 className="text-slate-200 font-semibold mb-1">Haftungsausschluss</h2>
            <p>
              Die auf dieser Website dargestellten Marken, Produktnamen und Unternehmen sind entweder fiktiv
              oder werden nur zu illustrativen Zwecken verwendet. Jegliche Ähnlichkeit mit echten Unternehmen
              oder Marken ist rein zufällig. Kartendaten © OpenStreetMap-Mitwirkende (openstreetmap.org).
            </p>
          </div>
          <div>
            <h2 className="text-slate-200 font-semibold mb-1">Streitschlichtung</h2>
            <p>
              Da es sich um eine kostenlose Simulationsseite ohne Kaufvertrag handelt, sind keine Transaktionen
              oder Rechtsgeschäfte möglich. Eine Teilnahme an Streitbeilegungsverfahren ist daher nicht vorgesehen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
