import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      <nav className="max-w-2xl mx-auto px-6 py-4">
        <Link href="/" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">← Zurück</Link>
      </nav>
      <div className="max-w-2xl mx-auto px-6 pb-16">
        <h1 className="text-2xl font-bold mb-6">Datenschutzerklärung</h1>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 space-y-5 text-sm text-slate-400 leading-relaxed">
          <div>
            <h2 className="text-slate-200 font-semibold mb-2">1. Keine Datenerhebung</h2>
            <p>
              Kaufamin erhebt, speichert oder verarbeitet keine personenbezogenen Daten. Es gibt keine
              Nutzerkonten, keine Bestellhistorie und keine Zahlungsdaten — da keine echten Käufe stattfinden.
            </p>
          </div>
          <div>
            <h2 className="text-slate-200 font-semibold mb-2">2. Lokaler Speicher (localStorage)</h2>
            <p>
              Die Kaffeepause-Funktion speichert Nachrichten ausschließlich lokal in Ihrem Browser (localStorage).
              Diese Daten verlassen Ihr Gerät nicht und werden nicht an unsere Server übertragen.
              Sie können diese Daten jederzeit über die Browsereinstellungen löschen.
            </p>
          </div>
          <div>
            <h2 className="text-slate-200 font-semibold mb-2">3. Kartenmaterial</h2>
            <p>
              Für die Kartendarstellung wird OpenStreetMap verwendet. Beim Laden der Karte werden Anfragen
              an die Server von OpenStreetMap (openstreetmap.org) gestellt. Dabei wird Ihre IP-Adresse
              übermittelt. Bitte beachten Sie die Datenschutzerklärung von OpenStreetMap.
            </p>
          </div>
          <div>
            <h2 className="text-slate-200 font-semibold mb-2">4. Hosting</h2>
            <p>
              Diese Website wird über Vercel Inc. gehostet. Beim Aufruf der Website werden technische
              Zugriffsdaten (z.B. IP-Adresse, Zeitstempel) durch Vercel im Rahmen des Hostingvertrags
              verarbeitet. Weitere Informationen finden Sie in der Datenschutzerklärung von Vercel.
            </p>
          </div>
          <div>
            <h2 className="text-slate-200 font-semibold mb-2">5. Ihre Rechte</h2>
            <p>
              Da keine personenbezogenen Daten durch uns erhoben werden, gibt es im Sinne der DSGVO
              keine bei uns gespeicherten Daten, über die wir Auskunft erteilen oder die wir löschen könnten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
