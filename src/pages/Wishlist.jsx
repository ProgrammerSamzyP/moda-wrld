import React from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/shop/ProductCard';
import { PRODUCTS } from '../utils/constants';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist } = useCart();
  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="px-4 py-6 md:py-10 max-w-7xl mx-auto">
      <h1 className="font-serif text-2xl md:text-4xl font-bold text-black mb-6 md:mb-8">My Wishlist</h1>
      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-12 md:py-20 bg-white rounded-lg border border-gray-100">
          <p className="text-4xl md:text-6xl text-gray-300 mb-4">♥</p>
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link to="/shop" className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-500">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;