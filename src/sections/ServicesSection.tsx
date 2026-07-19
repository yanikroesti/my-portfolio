import FadeIn from '../components/FadeIn';

const SERVICES = [
  {
    num: '01',
    name: 'Webdesign',
    desc: 'Klare, moderne One-Pager und komplette Websites für lokale Betriebe — hochwertig gestaltet, damit aus Besuchern Kunden werden.',
  },
  {
    num: '02',
    name: 'Redesigns',
    desc: 'Komplette Neuauflagen veralteter Websites: schnell, animiert und modern — damit sich deine Marke von ihrer besten Seite zeigt.',
  },
  {
    num: '03',
    name: 'Landing Pages',
    desc: 'Wirkungsvolle Seiten mit Scroll-Animationen und klaren Handlungsaufforderungen — gebaut, um aus Aufmerksamkeit echte Anfragen zu machen.',
  },
  {
    num: '04',
    name: 'Bots & Automation',
    desc: 'Massgeschneiderte Telegram-Bots und kleine Tools, die Buchungen, Lernen und Alltagsabläufe automatisieren — für dich und dein Team.',
  },
  {
    num: '05',
    name: 'Hosting & Pflege',
    desc: 'Aufschaltung, Hosting und laufende Updates — damit deine Website schnell, sicher und immer aktuell bleibt.',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="scroll-mt-20 rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn
        as="h2"
        y={40}
        className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Leistungen
      </FadeIn>

      <div className="mx-auto max-w-5xl divide-y divide-[#0C0C0C]/15">
        {SERVICES.map((service, i) => (
          <FadeIn
            key={service.num}
            delay={i * 0.1}
            className="flex items-center gap-6 py-8 sm:gap-10 sm:py-10 md:gap-16 md:py-12"
          >
            <span
              className="font-black leading-none text-[#0C0C0C]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {service.num}
            </span>
            <div className="flex flex-col gap-2 sm:gap-3">
              <h3
                className="font-medium uppercase text-[#0C0C0C]"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {service.name}
              </h3>
              <p
                className="max-w-2xl font-light leading-relaxed text-[#0C0C0C] opacity-60"
                style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
              >
                {service.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
