import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const product = PRODUCTS.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <button onClick={() => navigate('/shop')} className="bg-black text-white px-6 py-2 rounded-lg">
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
    <div className="pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-red-500">Home</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate('/shop')} className="hover:text-red-500">Shop</button>
            <span className="mx-2">/</span>
            <span className="text-black">{product.name}</span>
          </nav>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Main product image only */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-widest">{product.category}</span>
              {product.badge && (
                <span className="ml-2 bg-red-500 text-white px-2 py-0.5 text-xs font-bold uppercase rounded">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-black mb-4">{product.name}</h1>

            {/* Original price only */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-black">
                {formatCurrency(product.originalPrice)}
              </span>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-black mb-3 uppercase">Select Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-black mb-3 uppercase">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-black"
                >
                  -
                </button>
                <span className="text-lg font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-black"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-red-500 transition-all flex items-center justify-center gap-2"
              >
                <FiShoppingBag className="text-lg" />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 border-2 rounded-lg flex items-center justify-center transition-all ${
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <FiHeart className={`text-xl ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <FiTruck className="text-xl text-gray-400" />
                <div>
                  <p className="text-sm font-bold text-black">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders over ₦50,000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiShield className="text-xl text-gray-400" />
                <div>
                  <p className="text-sm font-bold text-black">Secure Payment</p>
                  <p className="text-xs text-gray-500">Paystack secured transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiRotateCcw className="text-xl text-gray-400" />
                <div>
                  <p className="text-sm font-bold text-black">Easy Returns</p>
                  <p className="text-xs text-gray-500">7-day return policy</p>
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