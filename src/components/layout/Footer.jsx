// src/components/Footer.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'

const SHOP_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=new', label: 'New Arrivals' },
  { to: '/collections', label: 'Collections' },
]

const HELP_LINKS = [
  { to: '/about', label: 'Story' },
  { to: '/contact', label: 'Contact' },
  { to: '/policies/returns', label: 'Refund Policy' },
]

const SOCIALS = [
  { href: 'https://www.instagram.com/mvdebymoda', label: 'Instagram', Icon: FaInstagram },
  { href: 'https://www.tiktok.com/@mvdebymoda', label: 'TikTok', Icon: FaTiktok },
  { href: 'https://wa.me/2349078859896', label: 'WhatsApp', Icon: FaWhatsapp },
]

const linkClass = 'inline-block py-1.5 text-sm text-neutral-500 hover:text-black transition-colors'

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return

    // TODO: send `email` to your newsletter endpoint here
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand + socials */}
          <div className="md:col-span-4">
            <Link
              to="/"
              className="inline-block text-xl font-black tracking-[-0.04em] text-black sm:text-2xl"
            >
              MODA WRLD
            </Link>

            <ul className="-ml-2.5 mt-4 flex items-center gap-1">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-black/60 transition-colors hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: two columns side by side, even on the smallest phones */}
          <div className="grid grid-cols-2 gap-8 md:col-span-4 md:grid-cols-2">
            <nav aria-label="Shop">
              <ul>
                {SHOP_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Help">
              <ul>
                {HELP_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em]">Join our email list</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-500">
              Be the first to know about new drops, exclusive releases and offers.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 flex items-center border-b border-black">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="min-w-0 flex-1 border-0 bg-transparent py-3 text-base text-black outline-none placeholder:text-neutral-400 sm:text-sm"
              />
              <button
                type="submit"
                className="shrink-0 py-3 pl-4 text-xs font-black uppercase tracking-[0.12em] text-black transition-opacity hover:opacity-60 focus:outline-none focus-visible:underline"
              >
                Sign up
              </button>
            </form>
            <p role="status" aria-live="polite" className="mt-2 h-5 text-xs text-black">
              {subscribed ? "Subscribed. You're on the list." : ''}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-neutral-100 pt-6 pb-[env(safe-area-inset-bottom)] sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-neutral-400 sm:text-xs">
            &copy; {new Date().getFullYear()} Moda Wrld. All rights reserved.
          </p>
          <Link
            to="/policies/privacy"
            className="w-fit text-[11px] text-neutral-400 transition-colors hover:text-black sm:text-xs"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer