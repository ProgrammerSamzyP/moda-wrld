import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { PRODUCTS, CATEGORIES } from '../utils/constants';

const BANNER_IMAGE = '/assets/banner1.jpeg';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl
  );

  /* =========================================================
     KEEP CATEGORY IN SYNC WITH URL
  ========================================================= */

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  /* =========================================================
     SEARCH + FILTER
  ========================================================= */

  const filteredProducts = useMemo(() => {
    let results = [...PRODUCTS];

    const query = searchQuery.trim().toLowerCase();

    /*
      SEARCH
      Your products currently have:
      - name
      - description
      - id
      - sizes
      - image
      - images
    */

    if (query) {
      results = results.filter((product) => {
        const name = product.name?.toLowerCase() || '';

        const description =
          product.description?.toLowerCase() || '';

        const id = String(product.id || '').toLowerCase();

        const sizes = Array.isArray(product.sizes)
          ? product.sizes.join(' ').toLowerCase()
          : '';

        return (
          name.includes(query) ||
          description.includes(query) ||
          id.includes(query) ||
          sizes.includes(query)
        );
      });
    }

    /*
      CATEGORY

      Your current constants only have:
      { id: 'all', name: 'All Products' }

      So we only filter if a real category exists.
    */

    if (selectedCategory !== 'all') {
      results = results.filter(
        (product) =>
          product.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    return results;
  }, [searchQuery, selectedCategory]);

  /* =========================================================
     CATEGORY CHANGE
  ========================================================= */

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);

    const params = new URLSearchParams();

    if (searchQuery) {
      params.set('search', searchQuery);
    }

    if (categoryId !== 'all') {
      params.set('category', categoryId);
    }

    setSearchParams(params);
  };

  /* =========================================================
     CLEAR SEARCH
  ========================================================= */

  const clearSearch = () => {
    const params = new URLSearchParams();

    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }

    setSearchParams(params);
  };

  /* =========================================================
     PAGE TITLE
  ========================================================= */

  const pageTitle = searchQuery
    ? `Search: ${searchQuery}`
    : selectedCategory === 'all'
      ? 'All Products'
      : selectedCategory;

  return (
    <div className="min-h-screen bg-white">

      {/* =====================================================
          HERO BANNER
      ====================================================== */}

      <section
        className="relative flex h-[50vh] items-end overflow-hidden bg-cover bg-center md:h-[60vh]"
        style={{
          backgroundImage: `url(${BANNER_IMAGE})`,
        }}
      >

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20" />

        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 pb-12 md:pb-16">

          {searchQuery && (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
              Search Results
            </p>
          )}

          <h1 className="mb-4 font-serif text-4xl font-bold text-white md:text-6xl lg:text-7xl">
            {pageTitle}
          </h1>

          <div className="mb-4 h-1 w-16 bg-red-500" />

          {searchQuery && (
            <div className="flex flex-wrap items-center gap-3">

              <p className="text-sm text-gray-300 md:text-base">
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1
                  ? 'product'
                  : 'products'}{' '}
                found
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white hover:text-black"
              >
                Clear Search
              </button>

            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          CATEGORY FILTERS
      ====================================================== */}

      <div className="sticky top-16 z-30 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-md md:top-20">

        <div className="no-scrollbar mx-auto flex max-w-7xl items-center justify-center gap-4 overflow-x-auto px-4 py-3 md:gap-8">

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                handleCategoryChange(cat.id)
              }
              className={`relative whitespace-nowrap px-4 py-2 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'text-black'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {cat.name}

              {selectedCategory === cat.id && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-red-500" />
              )}
            </button>
          ))}

        </div>
      </div>

      {/* =====================================================
          SEARCH BAR
      ====================================================== */}

      {searchQuery && (
        <section className="mx-auto max-w-7xl px-4 pt-8">

          <div className="flex items-end justify-between border-b border-gray-100 pb-5">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                Searching for
              </p>

              <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-black md:text-2xl">
                "{searchQuery}"
              </h2>

            </div>

            <p className="hidden text-sm text-gray-400 sm:block">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1
                ? 'result'
                : 'results'}
            </p>

          </div>

        </section>
      )}

      {/* =====================================================
          PRODUCT GRID
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 md:py-16">

        {filteredProducts.length > 0 ? (

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">

            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}

          </div>

        ) : (

          <div className="flex min-h-[40vh] flex-col items-center justify-center py-20 text-center">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <span className="text-2xl">⌕</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-gray-900">
              No products found
            </h3>

            <p className="mt-2 max-w-md text-gray-500">
              {searchQuery
                ? `We couldn't find anything matching "${searchQuery}".`
                : 'Try selecting a different category.'}
            </p>

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="mt-6 bg-black px-7 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-red-500"
              >
                View All Products
              </button>
            )}

          </div>

        )}

      </section>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

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