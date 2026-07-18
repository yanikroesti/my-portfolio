import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import ContactButton from '../components/ContactButton';

const PORTRAIT_URL = '/portrait.webp';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Price', href: '#contact' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md md:px-10 md:py-5"
        style={{ backgroundColor: 'rgba(12, 12, 12, 0.65)' }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {link.label}
          </a>
        ))}
      </FadeIn>

      <div className="mt-0 overflow-hidden pt-16 md:pt-20">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading w-full whitespace-nowrap text-center text-[13.5vw] font-black uppercase leading-none tracking-tight sm:text-[14.5vw] md:text-[15.5vw] lg:text-[16.5vw]"
        >
          Hi, i&rsquo;m yanik
        </FadeIn>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 w-[250px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[320px] sm:translate-y-0 md:w-[400px] lg:w-[460px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <img
              src={PORTRAIT_URL}
              alt="3D portrait of Yanik"
              className="w-full select-none"
              draggable={false}
            />
          </Magnet>
        </FadeIn>
      </div>

      <div className="mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            a digital creator driven by crafting striking and unforgettable websites
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="relative z-20">
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
