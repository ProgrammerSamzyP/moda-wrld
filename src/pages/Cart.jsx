import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiMinus,
  FiTrash2,
  FiShoppingBag,
  FiArrowLeft,
  FiTruck,
  FiShield,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import { PRODUCTS } from '../utils/constants';

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
  } = useCart();
  const navigate = useNavigate();

  // Total with original prices
  const cartTotalOriginal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    const price = product?.originalPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const FREE_DELIVERY_THRESHOLD = 50000;
  const remainingForFree = FREE_DELIVERY_THRESHOLD - cartTotalOriginal;
  const isEligibleForFreeDelivery = cartTotalOriginal >= FREE_DELIVERY_THRESHOLD;
  const progressPercent = Math.min(
    (cartTotalOriginal / FREE_DELIVERY_THRESHOLD) * 100,
    100
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <FiShoppingBag className="text-7xl text-gray-300 mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-8">
            Looks like you haven’t added anything yet. Explore our latest drops.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-red-500 transition-all shadow-md"
          >
            <FiShoppingBag /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <nav className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-red-500 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Cart</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">
            Your Cart
          </h1>
          <p className="text-gray-500 mt-2">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free delivery progress */}
            <div
              className={`rounded-2xl p-5 border ${
                isEligibleForFreeDelivery
                  ? 'bg-green-50 border-green-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              {isEligibleForFreeDelivery ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎉</span>
                  <div>
                    <p className="text-green-800 font-medium">
                      You qualify for <strong>free delivery</strong>!
                    </p>
                    <p className="text-green-700 text-sm">Your order ships free.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🚚</span>
                    <div>
                      <p className="text-blue-800 font-medium">
                        Add {formatCurrency(remainingForFree)} more for{' '}
                        <strong>free delivery</strong>
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-blue-600 rounded-full h-3 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-blue-600 text-sm text-right font-medium">
                    {Math.round(progressPercent)}% to free delivery
                  </p>
                </>
              )}
            </div>

            {/* Items list */}
            <ul className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
              {cart.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.id);
                const price = product?.originalPrice || item.price;

                return (
                  <li
                    key={`${item.id}-${item.size}`}
                    className="flex gap-4 sm:gap-6 p-4 sm:p-6"
                  >
                    {/* Image */}
                    <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif font-bold text-gray-900 text-base sm:text-lg truncate pr-2">
                            {item.name}
                          </h3>
                          {item.size && (
                            <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              Size: {item.size}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                          title="Remove"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-lg w-fit">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, -1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                          >
                            <FiMinus className="text-sm" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, 1)
                            }
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <FiPlus className="text-sm" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Clear cart / continue shopping */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-black transition-colors font-medium"
              >
                <FiArrowLeft /> Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 font-medium ml-auto"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(cartTotalOriginal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span
                    className={
                      isEligibleForFreeDelivery
                        ? 'text-green-600 font-medium'
                        : 'text-gray-500'
                    }
                  >
                    {isEligibleForFreeDelivery
                      ? 'Free'
                      : 'Calculated at checkout'}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-red-500">
                    {formatCurrency(cartTotalOriginal)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="mt-6 w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-red-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
              >
                <FiShoppingBag className="text-lg" />
                Proceed to Checkout
              </button>

              <div className="mt-6 flex items-center gap-4 text-xs text-gray-400 justify-center">
                <span className="flex items-center gap-1">
                  <FiShield className="text-sm" /> Secure Payment
                </span>
                <span className="flex items-center gap-1">
                  <FiTruck className="text-sm" /> Fast Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;