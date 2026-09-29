import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingBag,
  X,
  ChevronDown,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

/* ---------- helpers ---------- */

function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return scrolled;
}

const cn = (...classes) => classes.filter(Boolean).join(' ');

const LOGO_SRC = '/assets/WhiteLogo.png';
const ADMIN_EMAIL = 'modawrld61@gmail.com';

function initials(nameOrEmail = '') {
  const base = nameOrEmail.trim();

  if (!base) return '?';

  const parts = base.split(/\s+/);

  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return base[0].toUpperCase();
}

/* ---------- component ---------- */

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const scrolled = useScrolled();

  const mobile = useDisclosure();
  const search = useDisclosure();
  const account = useDisclosure();

  const [query, setQuery] = useState('');

  const isAdmin = user?.email === ADMIN_EMAIL;

  /* Lock body scroll while drawer/search is open */
  const locked = mobile.isOpen || search.isOpen;

  useEffect(() => {
    if (!locked) return;

    const prev = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);

  /* Close everything on navigation */
  useEffect(() => {
    mobile.close();
    account.close();
    search.close();
  }, [location.pathname, location.search]);

  /* Escape closes everything */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        mobile.close();
        search.close();
        account.close();
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const cartLabel = useMemo(
    () =>
      cartCount > 0
        ? `Cart, ${cartCount} items`
        : 'Cart, empty',
    [cartCount]
  );

  /* ---------- navigation handlers ---------- */

  const handleCartClick = () => {
    navigate(user ? '/cart' : '/login');
  };

  const handleAccountClick = () => {
    if (user) {
      account.toggle();
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();

    account.close();
    mobile.close();

    navigate('/');
  };

  /* ---------- SEARCH ---------- */

 const handleSearch = (e) => {
  e.preventDefault();

  const q = query.trim();

  if (!q) return;

  search.close();
  setQuery('');

  navigate(`/shop?search=${encodeURIComponent(q)}`);
};

  return (
    <>
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 w-full border-b transition-all duration-300',

          scrolled
            ? 'bg-white border-neutral-200 shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_-16px_rgba(0,0,0,0.15)]'
            : 'bg-white border-transparent'
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:px-6',

            'lg:flex lg:justify-between lg:px-8',

            'transition-[height] duration-300',

            scrolled ? 'h-14' : 'h-16'
          )}
        >
          {/* =================================================
              LEFT
          ================================================== */}

          <div className="flex min-w-0 items-center justify-start gap-1 sm:gap-2">
            {/* Mobile menu */}

            <button
              type="button"
              onClick={mobile.open}
              aria-label="Open menu"
              aria-expanded={mobile.isOpen}
              aria-controls="mobile-menu"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop logo */}

            <Link
              to="/"
              aria-label="MODA WRLD, home"
              className="hidden shrink-0 items-center hover:opacity-70 transition-opacity duration-200 lg:flex"
            >
              <img
                src={LOGO_SRC}
                alt="MODA WRLD"
                className={cn(
                  'w-auto select-none bg-white mix-blend-multiply transition-all duration-300',

                  scrolled ? 'h-8' : 'h-10'
                )}
                draggable={false}
              />
            </Link>
          </div>

          {/* =================================================
              MOBILE WORDMARK
          ================================================== */}

          <Link
            to="/"
            aria-label="MODA WRLD, home"
            className="whitespace-nowrap text-center text-[15px] font-black uppercase tracking-[0.22em] text-black transition-opacity hover:opacity-70 lg:hidden"
          >
            MODAWRLD
          </Link>

          {/* =================================================
              RIGHT ACTIONS
          ================================================== */}

          <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1.5">
            {/* Wishlist */}

            <IconButton
              label="Wishlist"
              as={Link}
              to="/wishlist"
              className="hidden sm:inline-flex"
            >
              <Heart
                className="h-5 w-5"
                strokeWidth={1.75}
              />
            </IconButton>

            {/* SEARCH BUTTON */}

            <IconButton
              label="Search"
              onClick={search.open}
            >
              <Search
                className="h-5 w-5"
                strokeWidth={1.75}
              />
            </IconButton>

            {/* Cart */}

            <IconButton
              label={cartLabel}
              onClick={handleCartClick}
              className="relative"
            >
              <ShoppingBag
                className="h-5 w-5"
                strokeWidth={1.75}
              />

              {cartCount > 0 && (
                <span
                  key={cartCount}
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white animate-[badgePop_0.25s_ease-out]"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </IconButton>

            {/* =================================================
                ACCOUNT
            ================================================== */}

            <div className="relative">
              <button
                type="button"
                onClick={handleAccountClick}
                aria-label="Account"
                aria-haspopup={user ? 'menu' : undefined}
                aria-expanded={
                  user ? account.isOpen : undefined
                }
                title="Account"
                className={cn(
                  'inline-flex items-center justify-center gap-1 rounded-full transition-all active:scale-95',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-black',

                  user
                    ? 'p-0.5 sm:pr-2 hover:bg-neutral-100'
                    : 'h-10 w-10 text-neutral-700 hover:text-black hover:bg-neutral-100'
                )}
              >
                {user ? (
                  <>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-[11px] font-semibold tracking-wide text-white sm:h-8 sm:w-8">
                      {initials(user.name || user.email)}
                    </span>

                    <ChevronDown
                      className={cn(
                        'hidden h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 sm:block',

                        account.isOpen && 'rotate-180'
                      )}
                    />
                  </>
                ) : (
                  <User
                    className="h-5 w-5"
                    strokeWidth={1.75}
                  />
                )}
              </button>

              {/* Account dropdown */}

              {account.isOpen && user && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={account.close}
                    aria-hidden="true"
                  />

                  <div
                    role="menu"
                    className="absolute right-0 z-50 mt-3 w-[min(16rem,calc(100vw-1.5rem))] origin-top-right rounded-2xl border border-neutral-200 bg-white py-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.18)] animate-[dropIn_0.18s_ease-out]"
                  >
                    <UserSummary
                      user={user}
                      className="border-b border-neutral-100 px-4 py-3.5"
                    />

                    <div className="py-1">
                      <DropdownLink
                        to="/profile"
                        onClick={account.close}
                      >
                        My Profile
                      </DropdownLink>

                      <DropdownLink
                        to="/orders"
                        onClick={account.close}
                      >
                        My Orders
                      </DropdownLink>

                      <DropdownLink
                        to="/wishlist"
                        onClick={account.close}
                      >
                        Wishlist
                      </DropdownLink>
                    </div>

                    {isAdmin && (
                      <>
                        <div className="my-1 border-t border-neutral-100" />

                        <DropdownLink
                          to="/admin"
                          onClick={account.close}
                          className="font-semibold text-red-600 hover:bg-red-50 hover:text-red-600"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </>
                    )}

                    <div className="my-1 border-t border-neutral-100" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />

                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}

      {mobile.isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out] lg:hidden"
            onClick={mobile.close}
            aria-hidden="true"
          />

          <aside
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed left-0 top-0 z-50 flex h-[100dvh] w-[85%] max-w-sm flex-col border-r border-neutral-200 bg-white animate-[slideIn_0.28s_cubic-bezier(0.22,1,0.36,1)] lg:hidden"
            style={{
              paddingBottom:
                'env(safe-area-inset-bottom)',
            }}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 p-4">
              <Link
                to="/"
                onClick={mobile.close}
                className="text-base font-black uppercase tracking-[0.22em] text-black"
              >
                MODA WRLD
              </Link>

              <button
                type="button"
                onClick={mobile.close}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {user && (
              <UserSummary
                user={user}
                className="border-b border-neutral-100 px-4 py-4"
              />
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-2">
              <ul>
                <MobileLink
                  to="/"
                  onClick={mobile.close}
                  active={location.pathname === '/'}
                >
                  Home
                </MobileLink>
              </ul>

              <ul className="mt-2 border-t border-neutral-100 pt-2">
                <MobileLink
                  to="/wishlist"
                  onClick={mobile.close}
                  muted
                >
                  Wishlist
                </MobileLink>

                {user && (
                  <>
                    <MobileLink
                      to="/cart"
                      onClick={mobile.close}
                      muted
                    >
                      Cart
                    </MobileLink>

                    <MobileLink
                      to="/orders"
                      onClick={mobile.close}
                      muted
                    >
                      My Orders
                    </MobileLink>

                    <MobileLink
                      to="/profile"
                      onClick={mobile.close}
                      muted
                    >
                      My Profile
                    </MobileLink>
                  </>
                )}

                {isAdmin && (
                  <MobileLink
                    to="/admin"
                    onClick={mobile.close}
                    sale
                  >
                    Admin Dashboard
                  </MobileLink>
                )}
              </ul>
            </div>

            <div className="space-y-2 border-t border-neutral-100 p-4">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={mobile.close}
                    className="block w-full rounded-full bg-black py-3 text-center text-sm font-semibold text-white active:scale-[0.98] transition-transform"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    onClick={mobile.close}
                    className="block w-full rounded-full border border-neutral-300 py-3 text-center text-sm font-medium text-neutral-800 hover:border-black transition-colors"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </aside>
        </>
      )}

      {/* =====================================================
          SEARCH OVERLAY
      ====================================================== */}

      {search.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-20 backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out] sm:pt-24"
          onClick={search.close}
        >
          <form
            role="search"
            onSubmit={handleSearch}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] animate-[dropIn_0.2s_ease-out] sm:p-4"
          >
            <div className="flex items-center gap-2 px-1 sm:gap-3 sm:px-2">
              <Search
                className="h-5 w-5 shrink-0 text-neutral-400"
                strokeWidth={1.75}
              />

              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
                placeholder="Search products..."
                enterKeyHint="search"
                className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-neutral-400 sm:text-sm"
              />

              <button
                type="button"
                onClick={search.close}
                aria-label="Close search"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }

          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes dropIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes badgePop {
          0% {
            transform: scale(0.5);
          }

          60% {
            transform: scale(1.15);
          }

          100% {
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          header *,
          #mobile-menu,
          [role="menu"],
          [role="search"] {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

/* =========================================================
   ICON BUTTON
========================================================= */

function IconButton({
  label,
  as: Component = 'button',
  className,
  children,
  ...props
}) {
  return (
    <Component
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full',
        'text-neutral-700 hover:bg-neutral-100 hover:text-black',
        'transition-all active:scale-95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-black',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/* =========================================================
   USER SUMMARY
========================================================= */

function UserSummary({ user, className }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
        {initials(user.name || user.email)}
      </span>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-black">
          {user.name || 'User'}
        </p>

        <p className="truncate text-xs text-neutral-500">
          {user.email}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DROPDOWN LINK
========================================================= */

function DropdownLink({
  to,
  onClick,
  className,
  children,
}) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onClick}
      className={cn(
        'block px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-black',
        className
      )}
    >
      {children}
    </Link>
  );
}

/* =========================================================
   MOBILE LINK
========================================================= */

function MobileLink({
  to,
  onClick,
  active,
  sale,
  muted,
  children,
}) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'block py-3.5 transition-colors',

          muted
            ? 'text-sm'
            : 'text-lg font-medium tracking-tight',

          sale
            ? 'text-red-600'
            : active
            ? 'text-black'
            : muted
            ? 'text-neutral-600 hover:text-black'
            : 'text-neutral-700 hover:text-black'
        )}
      >
        {children}
      </Link>
    </li>
  );
}

export default Navbar;