import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiPlus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';

const ProductCard = ({ product, onQuickView }) => {
  const { wishlist, toggleWishlist } = useCart();

  const images = product.images?.length ? product.images : [product.image];
  const hoverImage = images[1];
  const isWishlisted = wishlist.includes(product.id);
  const soldOut = product.inStock === false;
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const isSale = /sale/i.test(product.badge || '');

  const quickView = (e) => {
    e.preventDefault();
    onQuickView?.(product);
  };

  return (
    <article className="group">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <Link to={`/product/${product.id}`} aria-label={product.name} className="block h-full w-full">
          <img
            src={images[0]}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-all duration-700 ${
              hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-[1.03]'
            } ${soldOut ? 'opacity-70' : ''}`}
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Badge */}
        {(soldOut || product.badge) && (
          <span
            className={`pointer-events-none absolute left-2 top-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
              soldOut
                ? 'bg-white text-black'
                : isSale
                ? 'bg-red-600 text-white'
                : 'bg-black text-white'
            }`}
          >
            {soldOut ? 'Sold out' : product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isWishlisted}
          className="absolute right-1.5 top-1.5 flex h-10 w-10 items-center justify-center rounded-full text-black transition-transform active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur">
            <FiHeart className={`h-4 w-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
          </span>
        </button>

        {/* Quick view: bar on desktop hover, round button on touch screens */}
        {onQuickView && !soldOut && (
          <>
            <button
              type="button"
              onClick={quickView}
              className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-white/95 py-3 text-xs font-bold uppercase tracking-[0.15em] text-black transition-transform duration-300 group-hover:translate-y-0 focus:translate-y-0 md:block"
            >
              Quick view
            </button>
            <button
              type="button"
              onClick={quickView}
              aria-label={`Quick view ${product.name}`}
              className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md active:scale-90 transition-transform md:hidden"
            >
              <FiPlus className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="pt-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[11px] font-semibold uppercase leading-snug tracking-[0.06em] text-black sm:text-xs">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
          {formatCurrency(product.originalPrice ?? product.price)}
        </p>

        {colors.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5" aria-label={`Available in ${colors.length} colors`}>
            {colors.slice(0, 4).map((c) => (
              <span
                key={c}
                title={c}
                className="h-3 w-3 rounded-full border border-neutral-300"
                style={{ backgroundColor: String(c).toLowerCase().replace(/\s+/g, '') }}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-[10px] text-neutral-500">+{colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;