import { useState, type FormEvent } from 'react';
import FadeIn from '../components/FadeIn';
import LegalLinks from '../components/Legal';

const EMAIL = 'yanikroesti@proton.me';

const BUSINESS_TYPES = [
  'Beauty & Wellness',
  'Restaurant / Café',
  'Handwerk',
  'Laden / Shop',
  'Praxis / Gesundheit',
  'Anderes',
];

const NEEDS = [
  'Neue Website',
  'Redesign meiner Website',
  'Landing Page',
  'Bot / Automatisierung',
  'Noch unsicher',
];

const inputClasses =
  'w-full rounded-2xl border-2 border-[#D7E2EA]/20 bg-transparent px-6 py-4 text-base font-light text-[#D7E2EA] outline-none transition-colors duration-200 placeholder:text-[#D7E2EA]/35 focus:border-[#D7E2EA]/60 sm:px-7 sm:py-5 sm:text-lg';

type Status = 'idle' | 'sending' | 'success' | 'error';

// Web3Forms leitet Formular-Anfragen direkt an die hinterlegte E-Mail weiter.
// Key holen: https://web3forms.com (E-Mail eingeben, Key kommt per Mail).
// Solange der Platzhalter drin ist, öffnet der Button stattdessen das Mail-Programm.
const WEB3FORMS_ACCESS_KEY = '7c6741f7-c71b-45ca-9376-2c576ee9548d';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [need, setNeed] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const subject = `Website-Anfrage${business ? ` — ${business}` : ''}${name ? ` (${name})` : ''}`;

  const mailtoFallback = () => {
    const body = [
      name && `Name: ${name}`,
      business && `Betrieb: ${business}`,
      need && `Gesucht: ${need}`,
      message && `\n${message}`,
    ]
      .filter(Boolean)
      .join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (WEB3FORMS_ACCESS_KEY.startsWith('HIER_')) {
      mailtoFallback();
      return;
    }
    const botcheck = (new FormData(e.currentTarget).get('botcheck') as string) || '';
    if (botcheck) return; // Honeypot: von Bots ausgefüllt, still verwerfen
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject,
          from_name: 'Portfolio Kontaktformular',
          name,
          betrieb: business,
          gesucht: need,
          nachricht: message,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-[#0C0C0C] px-5 pb-16 pt-24 sm:px-8 sm:pt-28 md:px-10 md:pt-36"
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading text-center font-black uppercase leading-none tracking-tight"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Kontakt
      </FadeIn>

      <FadeIn delay={0.1} y={20}>
        <p
          className="mx-auto mt-8 max-w-[640px] text-center font-light leading-relaxed text-[#D7E2EA] opacity-80"
          style={{ fontSize: 'clamp(1.05rem, 2vw, 1.45rem)' }}
        >
          Erzähl mir, was du vorhast — ich melde mich mit Ideen und einem klaren
          Preis. In der Regel innert 2 Tagen.
        </p>
      </FadeIn>

      <FadeIn delay={0.2} y={30}>
        {status === 'success' ? (
          <div className="mx-auto mt-14 max-w-3xl rounded-[30px] border-2 border-[#D7E2EA]/30 px-8 py-14 text-center sm:mt-20 sm:py-16">
            <p
              className="font-medium uppercase tracking-wide text-[#D7E2EA]"
              style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2rem)' }}
            >
              Merci, {name.trim() || 'danke'}!
            </p>
            <p className="mx-auto mt-4 max-w-[480px] font-light leading-relaxed text-[#D7E2EA] opacity-70 sm:text-lg">
              Deine Anfrage ist unterwegs. Ich melde mich in der Regel innert 2
              Tagen bei dir.
            </p>
          </div>
        ) : (
        <form
          name="kontakt"
          onSubmit={handleSubmit}
          className="mx-auto mt-14 flex max-w-3xl flex-col gap-5 sm:mt-20 sm:gap-6"
        >
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
          />
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dein Name"
            autoComplete="name"
            required
            className={inputClasses}
          />

          <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
            <select
              name="betrieb"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              className={`${inputClasses} appearance-none ${business ? '' : 'text-[#D7E2EA]/35'}`}
            >
              <option value="" disabled className="bg-[#0C0C0C] text-[#D7E2EA]">
                Art des Betriebs…
              </option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t} className="bg-[#0C0C0C] text-[#D7E2EA]">
                  {t}
                </option>
              ))}
            </select>

            <select
              name="gesucht"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              className={`${inputClasses} appearance-none ${need ? '' : 'text-[#D7E2EA]/35'}`}
            >
              <option value="" disabled className="bg-[#0C0C0C] text-[#D7E2EA]">
                Was brauchst du…
              </option>
              {NEEDS.map((n) => (
                <option key={n} value={n} className="bg-[#0C0C0C] text-[#D7E2EA]">
                  {n}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="nachricht"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Sonst noch etwas — Ziele, Termin, Link zu deiner aktuellen Website…"
            rows={7}
            className={`${inputClasses} resize-none`}
          />

          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-3 inline-block self-center whitespace-nowrap rounded-full px-12 py-4 text-sm font-medium uppercase tracking-widest text-white transition-opacity duration-200 disabled:opacity-60 sm:px-14 sm:py-5 sm:text-base md:text-lg"
            style={{
              background:
                'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
              boxShadow:
                '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
              outline: '2px solid #FFFFFF',
              outlineOffset: '-3px',
            }}
          >
            {status === 'sending' ? 'Wird gesendet…' : 'Anfrage senden'}
          </button>

          {status === 'error' && (
            <p role="alert" className="text-center font-light leading-relaxed text-[#D7E2EA] opacity-80">
              Das Senden hat leider nicht geklappt. Schreib mir direkt an{' '}
              <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
                {EMAIL}
              </a>{' '}
              — deine Angaben bleiben im Formular erhalten.
            </p>
          )}
        </form>
        )}
      </FadeIn>

      <FadeIn delay={0.25} y={20}>
        <p className="mt-10 text-center font-light uppercase tracking-wider text-[#D7E2EA] opacity-60 sm:mt-12">
          oder schreib mir direkt —{' '}
          <a
            href={`mailto:${EMAIL}`}
            className="underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
          >
            {EMAIL}
          </a>
        </p>
      </FadeIn>

      <LegalLinks />

      <p className="mt-6 text-center text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-40">
        © 2026 Yanik — selbst gestaltet &amp; gebaut
      </p>
    </section>
  );
}
