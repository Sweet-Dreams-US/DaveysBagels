import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { asset } from '../utils/asset'

export default function Home() {
  return (
    <>
      <Hero />
      <TickerStrip />
      <StorySection />
      <PillarsSection />
      <ArtsDistrictSection />
      <SignatureBuildsSection />
      <FindUsSection />
      <ClosingCTA />
    </>
  )
}

/* ---------------------------------------------------------- */
/* HERO                                                       */
/* ---------------------------------------------------------- */
function Hero() {
  return (
    <section className="relative bg-teal overflow-hidden border-b-2 border-ink">
      <div className="grain-overlay absolute inset-0" aria-hidden />

      {/* Floating decorative bagels */}
      <div className="absolute -top-8 -right-8 w-44 h-44 sm:w-60 sm:h-60 opacity-90 animate-[float-slow_7s_ease-in-out_infinite]" aria-hidden>
        <img src={logo} alt="" className="w-full h-full" />
      </div>
      <div className="absolute -bottom-12 -left-12 w-36 h-36 sm:w-52 sm:h-52 opacity-50 rotate-12 animate-[float-slow_9s_ease-in-out_infinite]" aria-hidden>
        <img src={logo} alt="" className="w-full h-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-3xl">
          <span className="sticker bg-mustard text-ink border-ink mb-6">
            ⓘ 1006 Broadway · Fort Wayne, Indiana
          </span>
          <h1 className="font-display text-[15vw] sm:text-[9rem] leading-[0.85] text-ink mt-4">
            Steamed.
            <br />
            <span className="text-cream drop-shadow-[4px_4px_0_var(--color-ink)]">Never</span>
            <br />
            <span className="text-paprika drop-shadow-[4px_4px_0_var(--color-ink)]">toasted.</span>
          </h1>
          <p className="mt-8 font-serif text-xl sm:text-2xl text-ink/85 max-w-xl leading-snug">
            A bagel shop, a coffee bar, and an unofficial gallery — tucked into the heart of Fort Wayne&rsquo;s Broadway Arts District.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-ink text-cream font-display text-lg uppercase tracking-wider px-6 py-4 border-2 border-ink shadow-[5px_5px_0_0_var(--color-mustard)] hover:shadow-[7px_7px_0_0_var(--color-mustard)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              Order for Pickup →
            </Link>
            <a
              href="#story"
              className="inline-flex items-center gap-2 bg-cream text-ink font-display text-lg uppercase tracking-wider px-6 py-4 border-2 border-ink hover:bg-mustard transition-colors"
            >
              Our story
            </a>
          </div>
        </div>
      </div>

      {/* Bottom photo strip */}
      <div className="relative h-[44vh] sm:h-[58vh] border-t-4 border-ink overflow-hidden">
        <picture>
          <source srcSet={asset('photos/storefront-1600.webp')} media="(min-width: 800px)" />
          <img
            src={asset('photos/storefront-800.webp')}
            alt="Davey's Delicious Bagels storefront on Broadway in Fort Wayne"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 text-cream font-serif italic text-sm sm:text-base bg-ink/65 backdrop-blur px-4 py-2 border-2 border-cream/30">
          That&rsquo;s us. Yes, it&rsquo;s open.
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- */
/* TICKER STRIP                                               */
/* ---------------------------------------------------------- */
function TickerStrip() {
  const items = [
    'Wood Farms Beef Bacon',
    'Atlantic Lox',
    'Union Blend Coffee',
    'Made on Broadway',
    'Open at 7 AM',
    'Davey’s Delicious Sauce',
    'Steamed Daily',
  ]
  return (
    <div className="bg-ink text-cream py-4 border-y-2 border-mustard overflow-hidden">
      <div className="flex whitespace-nowrap gap-12 animate-[marquee_36s_linear_infinite] font-display text-2xl uppercase tracking-wide">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="flex items-center gap-12">
            {items.map((it, j) => (
              <span key={`${i}-${j}`} className="flex items-center gap-12">
                <span>{it}</span>
                <span className="text-mustard" aria-hidden>★</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------- */
/* STORY                                                      */
/* ---------------------------------------------------------- */
function StorySection() {
  return (
    <section id="story" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-6 lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.3em] text-paprika mb-4">Our Story</div>
          <h2 className="font-display text-5xl sm:text-6xl leading-[0.95] text-ink">
            Built around<br />
            <span className="bg-mustard inline-block px-2 -rotate-1">one good idea.</span>
          </h2>
          <div className="mt-6 space-y-5 font-serif text-lg leading-relaxed text-ink-soft max-w-prose">
            <p>
              In a city that knows its way around a sandwich, Davey&rsquo;s does one thing differently — we <em>steam</em> our bagels.
              Hot, soft, just-pillowy-enough. The way you remember them from the only deli in the only neighborhood that ever felt like home.
            </p>
            <p>
              We open early because Fort Wayne starts early. We sit on Broadway because that&rsquo;s where the artists, the early-shift nurses, the coffee writers, and the freshly tattooed all overlap. Our walls are a rotating gallery. Our menu is full of people&rsquo;s names — some real, some legendary, all delicious.
            </p>
            <p className="font-bold text-ink">
              Come alone. Come with friends. Come as you are.
            </p>
          </div>
        </div>

        {/* Photo collage */}
        <div className="md:col-span-6 lg:col-span-7 grid grid-cols-6 grid-rows-[180px_180px_180px] gap-3">
          <PhotoTile
            srcs={[asset('photos/inside-2-1600.webp'), asset('photos/inside-2-800.webp')]}
            alt="Inside Davey's, bright and full of art"
            className="col-span-4 row-span-2 frame-stamp"
          />
          <PhotoTile
            srcs={[asset('photos/food-1600.webp'), asset('photos/food-800.webp')]}
            alt="Davey's bagel sandwich"
            className="col-span-2 row-span-1 frame-stamp"
            tilt="rotate-2"
          />
          <PhotoTile
            srcs={[asset('photos/sign-1600.webp'), asset('photos/sign-800.webp')]}
            alt="Davey's hand-painted sign on Broadway"
            className="col-span-2 row-span-2 frame-stamp"
            tilt="-rotate-1"
          />
          <PhotoTile
            srcs={[asset('photos/counter-1600.webp'), asset('photos/counter-800.webp')]}
            alt="The counter and pastry case"
            className="col-span-4 row-span-1 frame-stamp"
          />
        </div>
      </div>
    </section>
  )
}

function PhotoTile({
  srcs,
  alt,
  className = '',
  tilt = '',
}: {
  srcs: [string, string]
  alt: string
  className?: string
  tilt?: string
}) {
  return (
    <div className={`overflow-hidden bg-cream-deep ${className} ${tilt}`}>
      <picture>
        <source srcSet={srcs[0]} media="(min-width: 800px)" />
        <img src={srcs[1]} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      </picture>
    </div>
  )
}

/* ---------------------------------------------------------- */
/* PILLARS                                                    */
/* ---------------------------------------------------------- */
function PillarsSection() {
  const pillars = [
    {
      label: 'Bagels',
      title: 'Steamed daily.',
      copy: 'We steam every bagel to order — soft inside, snappy outside. The technique that built our name.',
      bg: 'bg-mustard',
    },
    {
      label: 'Coffee',
      title: 'Union Blend.',
      copy: 'A small-batch local roast pulled into espresso, lattes, and that 4-shot Black Eye for the long shifts.',
      bg: 'bg-teal',
    },
    {
      label: 'Swag',
      title: 'Be the bagel.',
      copy: 'Trucker hats, mugs, sweatshirts, the full hat trick. Wear Broadway proudly.',
      bg: 'bg-paprika text-cream',
    },
  ]
  return (
    <section className="border-y-2 border-ink bg-cream-deep">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-ink">
        {pillars.map((p) => (
          <article key={p.label} className={`relative p-10 ${p.bg}`}>
            <div className="text-[11px] uppercase tracking-[0.3em] mb-2 opacity-80">{p.label}</div>
            <h3 className="font-display text-4xl sm:text-5xl leading-tight">{p.title}</h3>
            <p className="mt-4 font-serif text-base leading-relaxed max-w-xs">{p.copy}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- */
/* ARTS DISTRICT                                              */
/* ---------------------------------------------------------- */
function ArtsDistrictSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="relative frame-stamp overflow-hidden bg-cream">
            <img
              src={asset('photos/broadway-street.webp')}
              alt="A small-town arts district at golden hour — string lights, brick storefronts, a hand-painted mural"
              className="w-full aspect-[16/9] object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="text-xs uppercase tracking-[0.3em] text-teal-deep mb-4">The Neighborhood</div>
          <h2 className="font-display text-5xl sm:text-6xl leading-[0.95] text-ink">
            We chose<br />
            <span className="bg-paprika text-cream inline-block px-3 rotate-[-1deg] my-1">Broadway</span>
            <br />on purpose.
          </h2>
          <div className="mt-6 space-y-5 font-serif text-lg leading-relaxed text-ink-soft max-w-prose">
            <p>
              Broadway is Fort Wayne&rsquo;s arts spine — galleries, music venues, indie shops, and a whole lot of fresh paint. We belong here because making something with your hands every morning <em>is</em> art, even if it has cream cheese on it.
            </p>
            <p>
              Inside, the walls rotate. We host local painters, photographers, and printmakers. Buy a bagel, take home a print. Sit a while. Watch the neighborhood walk by.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {['Local Art', 'Live Music', 'Maker Markets', 'Open Mic'].map((tag) => (
              <span key={tag} className="sticker bg-teal text-ink border-ink">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- */
/* SIGNATURE BUILDS                                           */
/* ---------------------------------------------------------- */
function SignatureBuildsSection() {
  const builds = [
    { name: 'The 07', sub: 'Turkey bacon · egg · avocado', price: '$10.50', emoji: '🌅' },
    { name: 'El Guapo', sub: 'Asiago · sausage · turkey bacon · DDS', price: '$11.50', emoji: '🤠' },
    { name: 'Loxy Lady', sub: 'Lox · chive cream cheese · capers', price: '$14.00', emoji: '🐟' },
    { name: 'The Mad Ant', sub: 'Sausage · jalapeños · pepper jack', price: '$11.00', emoji: '🔥' },
    { name: 'Sausage Celebration', sub: 'Three cheeses. One mood.', price: '$10.50', emoji: '🎉' },
    { name: 'The Una', sub: 'PB · banana · honey · cinnamon', price: '$6.50', emoji: '🍌' },
  ]
  return (
    <section className="bg-ink text-cream py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-mustard mb-3">The Hits</div>
            <h2 className="font-display text-5xl sm:text-6xl leading-[0.95]">
              Sandwiches with names<br />
              <span className="text-mustard">you&rsquo;ll remember.</span>
            </h2>
          </div>
          <Link to="/menu" className="sticker bg-mustard text-ink border-mustard">See the full menu →</Link>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {builds.map((b) => (
            <Link
              key={b.name}
              to="/menu"
              className="group relative bg-cream text-ink border-2 border-cream/0 p-6 hover:bg-mustard transition-colors"
            >
              <div className="text-3xl mb-3" aria-hidden>{b.emoji}</div>
              <div className="font-display text-2xl leading-tight">{b.name}</div>
              <p className="font-serif text-sm text-ink-soft mt-1">{b.sub}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-lg text-paprika">{b.price}</span>
                <span className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Order →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- */
/* FIND US                                                    */
/* ---------------------------------------------------------- */
function FindUsSection() {
  return (
    <section className="py-20 sm:py-28 bg-cream-deep border-y-2 border-ink">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-paprika mb-4">Find Us</div>
          <h2 className="font-display text-5xl sm:text-6xl leading-[0.95] text-ink">
            1006 <span className="text-paprika">Broadway.</span>
          </h2>
          <p className="font-serif text-lg leading-relaxed text-ink-soft mt-5 max-w-prose">
            Right between the murals and the music. Park on the street, walk in, smell the steam.
          </p>

          <ul className="mt-8 space-y-3 max-w-md">
            <Stat label="Mon — Fri" value="7:00 AM — 2:00 PM" />
            <Stat label="Saturday"   value="8:00 AM — 2:00 PM" />
            <Stat label="Sunday"     value="8:00 AM — 1:00 PM" />
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=1006+Broadway+Fort+Wayne+IN"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ink text-cream font-display text-base uppercase tracking-wider px-5 py-3 border-2 border-ink hover:bg-paprika transition-colors"
            >
              Get Directions →
            </a>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-cream text-ink font-display text-base uppercase tracking-wider px-5 py-3 border-2 border-ink hover:bg-mustard transition-colors"
            >
              Order Pickup →
            </Link>
          </div>
        </div>

        <div className="frame-stamp overflow-hidden bg-cream">
          <img
            src={asset('photos/inside-3-1600.webp')}
            alt="The inside of Davey's, with rotating local artwork on the walls"
            className="w-full aspect-[4/3] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex justify-between gap-6 py-3 border-b-2 border-dashed border-ink/25 font-serif">
      <span className="font-bold uppercase tracking-wider text-sm">{label}</span>
      <span className="text-ink-soft">{value}</span>
    </li>
  )
}

/* ---------------------------------------------------------- */
/* CLOSING CTA                                                */
/* ---------------------------------------------------------- */
function ClosingCTA() {
  return (
    <section className="relative bg-mustard py-20 sm:py-28 overflow-hidden border-b-2 border-ink">
      <div className="grain-overlay absolute inset-0" aria-hidden />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <img
          src={asset('photos/lox-illustration.webp')}
          alt=""
          aria-hidden
          className="absolute -top-10 -right-2 sm:-right-10 w-40 sm:w-56 opacity-90 rotate-6"
        />
        <h2 className="font-display text-6xl sm:text-7xl text-ink leading-[0.9]">
          Hungry yet?
        </h2>
        <p className="font-serif text-xl text-ink/80 max-w-xl mx-auto mt-6">
          Build your order, drop it in your cart, swing by Broadway. We&rsquo;ll have it ready in eight minutes.
        </p>
        <Link
          to="/menu"
          className="mt-8 inline-flex items-center gap-2 bg-ink text-cream font-display text-xl uppercase tracking-wider px-7 py-5 border-2 border-ink shadow-[6px_6px_0_0_var(--color-paprika)] hover:shadow-[9px_9px_0_0_var(--color-paprika)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
        >
          Start Your Order →
        </Link>
      </div>
    </section>
  )
}
