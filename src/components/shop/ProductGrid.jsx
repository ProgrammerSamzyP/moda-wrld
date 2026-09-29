import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const GRID =
  'grid grid-cols-2 gap-x-2 gap-y-8 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-12';

const ProductGrid = ({ products = [], loading }) => {
  if (loading) {
    return (
      <div className={GRID} aria-busy="true">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-neutral-100" />
            <div className="mt-3 h-3 w-3/4 bg-neutral-100" />
            <div className="mt-2 h-3 w-1/3 bg-neutral-100" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-black">
          No products found
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Try a different filter or search term.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block bg-black px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80"
        >
          View all
        </Link>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;