import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="relative bg-ink text-cream mt-20 overflow-hidden">
      {/* Marquee strip */}
      <div className="border-y-2 border-cream/20 bg-paprika py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-[marquee_28s_linear_infinite] gap-12 font-display text-2xl text-cream uppercase tracking-wide">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              <span>Steamed, Never Toasted</span>
              <span aria-hidden>★</span>
              <span>Made on Broadway</span>
              <span aria-hidden>★</span>
              <span>Open Early</span>
              <span aria-hidden>★</span>
              <span>Fort Wayne&rsquo;s Favorite</span>
              <span aria-hidden>★</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div className="space-y-3">
          <img src={logo} alt="Davey's Delicious Bagels" className="h-16 w-16" />
          <div className="font-display text-3xl">Davey&rsquo;s Delicious Bagels</div>
          <p className="text-cream/75 text-sm leading-relaxed max-w-xs">
            Home of the steamed bagel sandwich. Stationed in the Broadway Arts District,
            powered by Wood Farms meats, Union Blend coffee, and a community that shows up.
          </p>
        </div>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.2em] text-mustard">Find Us</div>
          <div className="text-cream/90 leading-relaxed">
            1006 Broadway<br />Fort Wayne, IN 46802
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=1006+Broadway+Fort+Wayne+IN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-mustard hover:text-cream underline underline-offset-4 decoration-2 text-sm"
          >
            Open in Maps →
          </a>
        </div>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.2em] text-mustard">Hours</div>
          <ul className="text-cream/90 text-sm space-y-1">
            <li className="flex justify-between"><span>Mon — Fri</span><span>7:00 AM — 2:00 PM</span></li>
            <li className="flex justify-between"><span>Saturday</span><span>8:00 AM — 2:00 PM</span></li>
            <li className="flex justify-between"><span>Sunday</span><span>8:00 AM — 1:00 PM</span></li>
          </ul>
          <Link to="/menu" className="inline-block mt-2 sticker bg-mustard text-ink border-cream/0 shadow-[3px_3px_0_0_var(--color-cream)]">
            Order Now
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/15 py-5 text-center text-cream/55 text-xs">
        © {new Date().getFullYear()} Davey&rsquo;s Delicious Bagels. Crafted on Broadway.
      </div>
    </footer>
  )
}
