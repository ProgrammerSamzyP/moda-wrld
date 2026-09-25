import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiHeart,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiMinus,
  FiPlus,
  FiArrowLeft,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const product = PRODUCTS.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <button
            onClick={() => navigate('/shop')}
            className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-red-500 transition-all"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, selectedSize);
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500">
            <button
              onClick={() => navigate('/')}
              className="hover:text-red-500 transition-colors"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <button
              onClick={() => navigate('/shop')}
              className="hover:text-red-500 transition-colors"
            >
              Shop
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Image */}
          <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {/* Category & Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-red-500 uppercase tracking-[.2em] font-bold">
                {product.category}
              </span>
              {product.badge && (
                <span className="bg-red-500 text-white px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(product.originalPrice)}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                Select Size
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border-2 rounded-lg font-medium text-sm transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white shadow-md'
                        : 'border-gray-200 text-gray-700 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                Quantity
              </label>
              <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-bold text-gray-900 border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-red-500 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-black/10"
              >
                <FiShoppingBag className="text-lg" />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-xl border-2 flex items-center justify-center transition-all ${
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <FiHeart
                  className={`text-xl ${isWishlisted ? 'fill-red-500' : ''}`}
                />
              </button>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 mb-8" />

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <FiTruck className="text-red-500 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Free Delivery</p>
                  <p className="text-xs text-gray-500">Over ₦50,000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <FiShield className="text-red-500 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-500">Paystack</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <FiRotateCcw className="text-red-500 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-500">7‑day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;