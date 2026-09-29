import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useUIContext } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { WHATSAPP_NUMBER } from '../../utils/constants';

const ProductModal = () => {
  const { isProductModalOpen, selectedProduct, closeProductModal } = useUIContext();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);

  const open = Boolean(isProductModalOpen && selectedProduct);

  // Fresh state for each product
  useEffect(() => {
    setSelectedSize('');
    setSizeError(false);
  }, [selectedProduct?.id]);

  // Lock scroll + Escape to close
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && closeProductModal();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, closeProductModal]);

  const p = selectedProduct;
  const soldOut = p ? p.inStock === false : false;
  const isWishlisted = p ? wishlist.includes(p.id) : false;
  const image = p ? (p.images?.length ? p.images[0] : p.image) : '';

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart(p, selectedSize);
    closeProductModal();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="product-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={p.name}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={closeProductModal}
            aria-hidden="true"
          />

          <motion.div
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl overflow-y-auto overscroll-contain bg-white shadow-2xl max-h-[92dvh] rounded-t-2xl md:max-h-[85vh] md:rounded-none"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <button
              type="button"
              onClick={closeProductModal}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="h-[44vh] bg-neutral-100 md:h-full md:min-h-[520px]">
                <img src={image} alt={p.name} className="h-full w-full object-cover" />
              </div>

              {/* Details */}
              <div className="flex flex-col p-5 sm:p-6 md:p-8 lg:p-10">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-black uppercase leading-tight tracking-[-0.01em] text-black sm:text-xl md:text-2xl">
                    {p.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(p.id)}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-pressed={isWishlisted}
                    className="mt-0.5 shrink-0 p-1 md:mr-10"
                  >
                    <FiHeart
                      className={`h-5 w-5 ${isWishlisted ? 'fill-red-600 text-red-600' : 'text-neutral-400'}`}
                    />
                  </button>
                </div>

                <p className="mt-2 text-base font-semibold text-black md:text-lg">
                  {formatCurrency(p.originalPrice ?? p.price)}
                </p>

                {p.description && (
                  <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                    {p.description}
                  </p>
                )}

                <div className="mt-6">
                  {soldOut ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-red-600">Sold out</p>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hi Moda Wrld, is ${p.name} available?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 border border-black py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-black transition-colors hover:bg-black hover:text-white"
                      >
                        <FaWhatsapp className="h-4 w-4" /> Ask about availability
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2 flex items-baseline justify-between">
                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-black">
                          Size
                        </span>
                        {sizeError && (
                          <span role="alert" className="text-xs text-red-600">
                            Select a size
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(p.sizes || []).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              setSelectedSize(size);
                              setSizeError(false);
                            }}
                            aria-pressed={selectedSize === size}
                            className={`h-11 min-w-[44px] border px-3 text-sm font-medium transition-colors ${
                              selectedSize === size
                                ? 'border-black bg-black text-white'
                                : 'border-neutral-300 text-neutral-800 hover:border-black'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="mt-5 w-full bg-black py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-85 active:scale-[0.99]"
                      >
                        Add to cart
                      </button>
                    </>
                  )}
                </div>

                <Link
                  to={`/product/${p.id}`}
                  onClick={closeProductModal}
                  className="mt-5 w-fit text-xs font-semibold uppercase tracking-[0.12em] text-black underline underline-offset-4 hover:opacity-60"
                >
                  View full details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;