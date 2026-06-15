import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { PRODUCTS, CATEGORIES } from '../utils/constants';

// 👇 Replace this with your actual image path / URL
const BANNER_IMAGE = '/assets/banner2.jpeg';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  const filteredProducts = useMemo(() => {
    return selectedCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      {/* 👇 Banner now uses a background image */}
      <section
        className="relative py-12 md:py-20 mb-6 md:mb-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
      >
        {/* Dark overlay to keep text readable */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4 capitalize">
            {selectedCategory === 'all' ? 'All Products' : selectedCategory}
          </h1>
          <div className="flex justify-center gap-2 md:gap-4 mt-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchParams(cat.id !== 'all' ? { category: cat.id } : {});
                }}
                className={`px-4 py-2 rounded-full border text-xs md:text-sm uppercase tracking-wider transition-colors ${
                  selectedCategory === cat.id
                    ? 'border-red-500 text-red-500'   // ← 20% background removed
                    : 'border-white/30 text-gray-300 hover:border-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-2 md:px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Shop;