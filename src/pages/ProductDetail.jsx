import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiHeart,
  FiMinus,
  FiPlus,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiZoomIn,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { PRODUCTS, WHATSAPP_NUMBER } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';

/* Simple accordion row */
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-neutral-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-xs font-bold uppercase tracking-[0.15em] text-black"
      >
        {title}
        <FiChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-neutral-600">{children}</div>}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hover-zoom image (mouse only). Zooms toward the cursor position.    */
/* Touch devices ignore the hover zoom and use the lightbox on tap.    */
/* ------------------------------------------------------------------ */
const ZoomImage = ({ src, alt, className = '', zoom = 2.5, onClick }) => {
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  const updateOrigin = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleEnter = (e) => {
    if (e.pointerType !== 'mouse') return;
    updateOrigin(e);
    setActive(true);
  };

  const handleMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    updateOrigin(e);
  };

  return (
    <div
      className={`group relative overflow-hidden bg-neutral-100 ${className}`}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={() => setActive(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Open ${alt} full screen`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      style={{ cursor: active ? 'zoom-in' : 'pointer' }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-full w-full select-none object-cover transition-transform duration-200 ease-out will-change-transform"
        style={{
          transformOrigin: `${origin.x}% ${origin.y}%`,
          transform: active ? `scale(${zoom})` : 'scale(1)',
        }}
      />
      <span
        className={`pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow transition-opacity ${
          active ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      >
        <FiZoomIn className="h-4 w-4" />
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Full-screen lightbox: arrows, keyboard, swipe, tap to zoom + pan.   */
/* ------------------------------------------------------------------ */
const Lightbox = ({ images, index, onClose, onChange, name }) => {
  const [zoomed, setZoomed] = useState(false);
  const touchStart = useRef(null);
  const total = images.length;

  const go = useCallback(
    (dir) => {
      setZoomed(false);
      onChange((index + dir + total) % total);
    },
    [index, total, onChange]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && total > 1) go(1);
      if (e.key === 'ArrowLeft' && total > 1) go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose, total]);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (zoomed || touchStart.current === null || total < 2) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label={`${name} image viewer`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xs font-semibold tabular-nums text-neutral-500">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-neutral-100"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>

      {/* Image area */}
      <div
        className={`relative min-h-0 flex-1 ${zoomed ? 'overflow-auto' : 'overflow-hidden'}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex min-h-full items-center justify-center ${zoomed ? 'w-[220%] sm:w-[180%] lg:w-[160%]' : 'w-full h-full'}`}
        >
          <img
            src={images[index]}
            alt={`${name} ${index + 1}`}
            draggable={false}
            onClick={() => setZoomed((z) => !z)}
            className={`select-none ${
              zoomed ? 'w-full cursor-zoom-out' : 'max-h-full max-w-full cursor-zoom-in object-contain'
            }`}
          />
        </div>

        {total > 1 && !zoomed && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white sm:flex"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white sm:flex"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="px-4 pb-4 pt-3">
        <p className="mb-2 text-center text-[11px] text-neutral-500">
          {zoomed ? 'Drag to look around. Tap the image to zoom out.' : 'Tap the image to zoom in.'}
        </p>
        {total > 1 && (
          <div className="flex justify-center gap-2 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => {
                  setZoomed(false);
                  onChange(i);
                }}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={`h-16 w-12 shrink-0 overflow-hidden border-2 transition-colors ${
                  i === index ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, wishlist, toggleWishlist } = useCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const scroller = useRef(null);

  // Reset when navigating between products
  useEffect(() => {
    setSelectedSize('');
    setQuantity(1);
    setSizeError(false);
    setAdded(false);
    setActiveImage(0);
    setLightboxIndex(null);
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!added) return undefined;
    const t = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(t);
  }, [added]);

  const product = PRODUCTS.find((p) => p.id === parseInt(id, 10));

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-black">Product not found</h2>
          <p className="mt-2 text-sm text-neutral-500">It may have been removed or the link is wrong.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block bg-black px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white hover:opacity-80"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  // Supports `images: [...]` (any number) and falls back to a single `image`.
  const gallery = Array.from(
    new Set((product.images?.length ? product.images : [product.image]).filter(Boolean))
  );

  const isWishlisted = wishlist.includes(product.id);
  const soldOut = product.inStock === false;

  const handleScroll = () => {
    const el = scroller.current;
    if (el) setActiveImage(Math.round(el.scrollLeft / el.clientWidth));
  };

  const scrollToImage = (i) => {
    const el = scroller.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product, selectedSize, quantity);
    setAdded(true);
  };

  return (
    <div className="bg-white pb-16">
      <div className="mx-auto max-w-7xl px-0 lg:px-8 lg:pt-8">
        {/* Breadcrumb (desktop) */}
        <nav aria-label="Breadcrumb" className="mb-6 hidden items-center gap-2 text-xs text-neutral-500 lg:flex">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black">Shop</Link>
          <span>/</span>
          <span className="truncate text-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14">
          {/* ---------- Gallery ---------- */}
          <div className="min-w-0">
            {/* Mobile / tablet: swipe carousel, tap to open viewer */}
            <div className="relative lg:hidden">
              <div
                ref={scroller}
                onScroll={handleScroll}
                className="flex snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
              >
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Open image ${i + 1} full screen`}
                    className="aspect-[3/4] w-full shrink-0 snap-center bg-neutral-100 sm:mx-auto sm:max-h-[80vh] sm:w-auto sm:min-w-full"
                  >
                    <img
                      src={src}
                      alt={`${product.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                      loading={i === 0 ? 'eager' : 'lazy'}
                      draggable={false}
                    />
                  </button>
                ))}
              </div>

              {gallery.length > 1 && (
                <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-black">
                  {activeImage + 1} / {gallery.length}
                </span>
              )}
              <span className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow">
                <FiZoomIn className="h-4 w-4" />
              </span>

              {gallery.length > 1 && (
                <div className="mt-3 flex justify-center gap-1.5">
                  {gallery.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToImage(i)}
                      aria-label={`Go to image ${i + 1}`}
                      aria-current={i === activeImage}
                      className="flex h-4 items-center px-0.5"
                    >
                      <span
                        className={`block h-1.5 rounded-full transition-all ${
                          i === activeImage ? 'w-5 bg-black' : 'w-1.5 bg-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: editorial grid, every image has hover zoom */}
            <div className="hidden grid-cols-2 gap-3 lg:grid">
              {gallery.map((src, i) => {
                const isHero = gallery.length === 1 || (i === 0 && gallery.length > 1);
                return (
                  <ZoomImage
                    key={src + i}
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    onClick={() => setLightboxIndex(i)}
                    className={isHero ? 'col-span-2 aspect-[4/5]' : 'aspect-[3/4]'}
                    zoom={isHero ? 2.2 : 2.5}
                  />
                );
              })}
            </div>
          </div>

          {/* ---------- Info ---------- */}
          <div className="min-w-0 px-4 sm:px-6 lg:sticky lg:top-24 lg:self-start lg:px-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {product.badge && (
                  <span className="mb-3 inline-block bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {product.badge}
                  </span>
                )}
                <h1 className="break-words text-2xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-black sm:text-3xl lg:text-4xl">
                  {product.name}
                </h1>
              </div>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={isWishlisted}
                className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform active:scale-90 hover:bg-neutral-100"
              >
                <FiHeart className={`h-5 w-5 ${isWishlisted ? 'fill-red-600 text-red-600' : 'text-neutral-500'}`} />
              </button>
            </div>

            <p className="mt-3 text-xl font-semibold text-black">
              {formatCurrency(product.originalPrice ?? product.price)}
            </p>

            {soldOut ? (
              <div className="mt-8 space-y-3">
                <p className="text-sm font-semibold text-red-600">Sold out</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hi Moda Wrld, is ${product.name} available?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 border border-black py-4 text-xs font-bold uppercase tracking-[0.15em] text-black transition-colors hover:bg-black hover:text-white"
                >
                  <FaWhatsapp className="h-4 w-4" /> Ask about availability
                </a>
              </div>
            ) : (
              <>
                {/* Size */}
                <div className="mt-8">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-black">Size</span>
                    {sizeError && (
                      <span role="alert" className="text-xs text-red-600">
                        Select a size to continue
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(product.sizes || []).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        aria-pressed={selectedSize === size}
                        className={`h-12 min-w-[48px] border px-4 text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? 'border-black bg-black text-white'
                            : sizeError
                            ? 'border-red-300 text-neutral-800 hover:border-black'
                            : 'border-neutral-300 text-neutral-800 hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mt-6">
                  <span className="mb-3 block text-xs font-bold uppercase tracking-[0.15em] text-black">
                    Quantity
                  </span>
                  <div className="inline-flex items-center border border-neutral-300">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="flex h-12 w-12 items-center justify-center hover:bg-neutral-100"
                    >
                      <FiMinus />
                    </button>
                    <span className="flex h-12 w-12 items-center justify-center text-sm font-semibold" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="flex h-12 w-12 items-center justify-center hover:bg-neutral-100"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                {/* Add to cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`mt-8 w-full py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition-all active:scale-[0.99] ${
                    added ? 'bg-neutral-700' : 'bg-black hover:opacity-85'
                  }`}
                >
                  {added ? 'Added to cart' : 'Add to cart'}
                </button>
                <p role="status" aria-live="polite" className="mt-2 h-4 text-center text-xs text-neutral-500">
                  {added ? 'Open your cart from the bag icon above.' : ''}
                </p>
              </>
            )}

            {/* Details */}
            <div className="mt-6 border-b border-neutral-200">
              {product.description && (
                <Accordion title="Description" defaultOpen>
                  {product.description}
                </Accordion>
              )}
              <Accordion title="Delivery & returns">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <FiTruck className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                    Free delivery on orders over ₦50,000.
                  </li>
                  <li className="flex items-start gap-3">
                    <FiRotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                    Easy returns within 7 days.
                  </li>
                  <li className="flex items-start gap-3">
                    <FiShield className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                    Secure checkout with Paystack.
                  </li>
                </ul>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={gallery}
          index={lightboxIndex}
          name={product.name}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

export default ProductDetail;