import FadeIn from '../components/FadeIn';

const SERVICES = [
  {
    num: '01',
    name: 'Web Design',
    desc: 'Clean, modern one-pagers and full websites for local businesses, designed to look premium and turn visitors into customers.',
  },
  {
    num: '02',
    name: 'Redesigns',
    desc: 'Complete rebuilds of outdated sites into fast, animated, modern experiences that make brands look their absolute best.',
  },
  {
    num: '03',
    name: 'Landing Pages',
    desc: 'High-impact pages with scroll animations and clear calls to action, built to turn attention into real inquiries.',
  },
  {
    num: '04',
    name: 'Bots & Automation',
    desc: 'Custom Telegram bots and small tools that automate learning, bookings, and everyday workflows for you and your team.',
  },
  {
    num: '05',
    name: 'Hosting & Care',
    desc: 'Deployment, hosting, and ongoing updates, so your website stays fast, secure, and always up to date.',
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
        Services
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
