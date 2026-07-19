import { useEffect, useState } from 'react';

const EMAIL = 'yanikroesti@proton.me';

type Doc = 'impressum' | 'datenschutz' | null;

function Impressum() {
  return (
    <>
      <h3 className="text-2xl font-semibold uppercase tracking-wide">Impressum</h3>
      <p className="mt-6 font-light leading-relaxed">
        Verantwortlich für diese Website:
        <br />
        <span className="font-medium">Yanik Rösti</span>
        <br />
        [Strasse und Hausnummer]
        <br />
        [PLZ] Thun, Schweiz
        <br />
        E-Mail:{' '}
        <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
          {EMAIL}
        </a>
      </p>
      <h4 className="mt-8 text-lg font-medium uppercase tracking-wide">Haftungsausschluss</h4>
      <p className="mt-3 font-light leading-relaxed opacity-80">
        Die Inhalte dieser Website wurden mit grösstmöglicher Sorgfalt erstellt. Für die
        Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird keine Gewähr
        übernommen. Verlinkte externe Websites liegen ausserhalb meines
        Verantwortungsbereichs — für deren Inhalte sind ausschliesslich die jeweiligen
        Betreiber verantwortlich.
      </p>
      <h4 className="mt-8 text-lg font-medium uppercase tracking-wide">Urheberrecht</h4>
      <p className="mt-3 font-light leading-relaxed opacity-80">
        Die auf dieser Website veröffentlichten Inhalte und Gestaltungen sind
        urheberrechtlich geschützt. Eine Verwendung ausserhalb der gesetzlich erlaubten
        Fälle bedarf der vorherigen Zustimmung.
      </p>
    </>
  );
}

function Datenschutz() {
  return (
    <>
      <h3 className="text-2xl font-semibold uppercase tracking-wide">Datenschutzerklärung</h3>
      <p className="mt-6 font-light leading-relaxed opacity-80">
        Der Schutz Ihrer Daten ist mir wichtig. Diese Erklärung informiert darüber,
        welche Personendaten beim Besuch dieser Website bearbeitet werden — gemäss dem
        schweizerischen Datenschutzgesetz (DSG).
      </p>

      <h4 className="mt-8 text-lg font-medium uppercase tracking-wide">Verantwortlicher</h4>
      <p className="mt-3 font-light leading-relaxed opacity-80">
        Yanik Rösti, Thun (Schweiz) — E-Mail:{' '}
        <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
          {EMAIL}
        </a>
      </p>

      <h4 className="mt-8 text-lg font-medium uppercase tracking-wide">Hosting &amp; Server-Logs</h4>
      <p className="mt-3 font-light leading-relaxed opacity-80">
        Diese Website wird bei Netlify (Netlify Inc., USA) gehostet. Beim Aufruf werden
        automatisch technisch notwendige Daten verarbeitet (IP-Adresse, Datum und
        Uhrzeit, Browser-Informationen). Diese Daten dienen ausschliesslich dem sicheren
        und stabilen Betrieb der Website.
      </p>

      <h4 className="mt-8 text-lg font-medium uppercase tracking-wide">Inhalte von Drittanbietern</h4>
      <p className="mt-3 font-light leading-relaxed opacity-80">
        Zur Darstellung werden einzelne Medien von Drittanbietern geladen
        (Showcase-Animationen von motionsites.ai, Grafiken von figma.site). Beim Laden
        dieser Inhalte wird Ihre IP-Adresse an den jeweiligen Anbieter übermittelt.
        Schriften werden lokal gehostet — es findet keine Übermittlung an Google statt.
      </p>

      <h4 className="mt-8 text-lg font-medium uppercase tracking-wide">Kontaktaufnahme</h4>
      <p className="mt-3 font-light leading-relaxed opacity-80">
        Das Kontaktformular öffnet Ihr E-Mail-Programm; die Angaben werden direkt per
        E-Mail an mich übermittelt und nur zur Bearbeitung Ihrer Anfrage verwendet. Es
        erfolgt keine Weitergabe an Dritte.
      </p>

      <h4 className="mt-8 text-lg font-medium uppercase tracking-wide">Cookies &amp; Tracking</h4>
      <p className="mt-3 font-light leading-relaxed opacity-80">
        Diese Website verwendet keine Cookies, keine Analyse-Tools und kein Tracking.
      </p>

      <h4 className="mt-8 text-lg font-medium uppercase tracking-wide">Ihre Rechte</h4>
      <p className="mt-3 font-light leading-relaxed opacity-80">
        Sie haben das Recht auf Auskunft über Ihre Personendaten sowie auf deren
        Berichtigung oder Löschung. Wenden Sie sich dazu per E-Mail an mich.
      </p>

      <p className="mt-8 text-sm font-light uppercase tracking-wider opacity-50">
        Stand: Juli 2026
      </p>
    </>
  );
}

export default function LegalLinks() {
  const [open, setOpen] = useState<Doc>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <div className="mt-16 flex items-center justify-center gap-8 sm:mt-20">
        {(['impressum', 'datenschutz'] as const).map((doc) => (
          <button
            key={doc}
            type="button"
            onClick={() => setOpen(doc)}
            className="text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-60 underline-offset-4 transition-opacity duration-200 hover:opacity-100 hover:underline"
          >
            {doc === 'impressum' ? 'Impressum' : 'Datenschutz'}
          </button>
        ))}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          onClick={() => setOpen(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[30px] border-2 border-[#D7E2EA]/30 bg-[#0C0C0C] p-8 text-[#D7E2EA] sm:p-12"
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Schliessen"
              className="absolute right-6 top-6 text-2xl leading-none opacity-60 transition-opacity duration-200 hover:opacity-100"
            >
              ×
            </button>
            {open === 'impressum' ? <Impressum /> : <Datenschutz />}
          </div>
        </div>
      )}
    </>
  );
}
