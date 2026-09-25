import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { PRODUCTS, CATEGORIES } from '../utils/constants';

const BANNER_IMAGE = '/assets/banner2.jpeg';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );

  const filteredProducts = useMemo(() => {
    return selectedCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO BANNER ===== */}
      <section
        className="relative h-[50vh] md:h-[60vh] flex items-end bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 z-10" />

        {/* Banner content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 pb-12 md:pb-16">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            {selectedCategory === 'all'
              ? 'All Products'
              : selectedCategory}
          </h1>
          {/* Red underline accent */}
          <div className="w-16 h-1 bg-red-500 mb-4" />
          <p className="text-gray-300 text-sm md:text-base max-w-md">
            {filteredProducts.length} piece
            {filteredProducts.length !== 1 ? 's' : ''} ready to ship
          </p>
        </div>
      </section>

      {/* ===== CATEGORY FILTERS ===== */}
      <div className="sticky top-16 md:top-20 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchParams(
                  cat.id !== 'all' ? { category: cat.id } : {}
                );
              }}
              className={`relative whitespace-nowrap px-4 py-2 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'text-black'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {cat.name}
              {selectedCategory === cat.id && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-red-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ===== PRODUCT GRID ===== */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try selecting a different category.
            </p>
          </div>
        )}
      </section>

      {/* Custom fade-in-up animation (add to your global CSS if not present) */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Shop;