import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatCurrency, calculateDiscount } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const { wishlist, toggleWishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = calculateDiscount(product.price, product.originalPrice);

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </Link>
        {product.badge && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 text-xs font-bold uppercase rounded">
            {product.badge}
          </div>
        )}
        <button onClick={() => toggleWishlist(product.id)} className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md bg-white/90 ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
          <FiHeart className={isWishlisted ? 'fill-current' : ''} />
        </button>
      </div>
      <div className="p-3 md:p-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-sm md:text-base font-bold text-black mb-1 hover:text-red-500 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-black font-bold text-sm">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
              <span className="text-xs bg-red-500 text-white px-1 rounded">-{discountPercent}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;