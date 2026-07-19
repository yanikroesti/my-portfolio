import { useState, type FormEvent } from 'react';
import FadeIn from '../components/FadeIn';

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
  'w-full rounded-2xl border-2 border-[#D7E2EA]/20 bg-transparent px-5 py-3.5 font-light text-[#D7E2EA] outline-none transition-colors duration-200 placeholder:text-[#D7E2EA]/35 focus:border-[#D7E2EA]/60 sm:px-6 sm:py-4';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [need, setNeed] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `Website-Anfrage${business ? ` — ${business}` : ''}${name ? ` (${name})` : ''}`;
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
          className="mx-auto mt-6 max-w-[520px] text-center font-light leading-relaxed text-[#D7E2EA] opacity-80"
          style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)' }}
        >
          Erzähl mir, was du vorhast — ich melde mich mit Ideen und einem klaren
          Preis. In der Regel innert 2 Tagen.
        </p>
      </FadeIn>

      <FadeIn delay={0.2} y={30}>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 flex max-w-2xl flex-col gap-4 sm:mt-16 sm:gap-5"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dein Name"
            autoComplete="name"
            className={inputClasses}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
            <select
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Sonst noch etwas — Ziele, Termin, Link zu deiner aktuellen Website…"
            rows={5}
            className={`${inputClasses} resize-none`}
          />

          <button
            type="submit"
            className="mt-2 inline-block self-center whitespace-nowrap rounded-full px-10 py-3.5 text-xs font-medium uppercase tracking-widest text-white sm:px-12 sm:py-4 sm:text-sm md:text-base"
            style={{
              background:
                'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
              boxShadow:
                '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
              outline: '2px solid #FFFFFF',
              outlineOffset: '-3px',
            }}
          >
            Anfrage senden
          </button>
        </form>
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

      <p className="mt-20 text-center text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-40 sm:mt-24">
        © 2026 Yanik — selbst gestaltet &amp; gebaut
      </p>
    </section>
  );
}
