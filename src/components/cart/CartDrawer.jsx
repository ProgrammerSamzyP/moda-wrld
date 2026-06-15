import React from 'react';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { PRODUCTS } from '../../utils/constants'; // to get original prices
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount
  } = useCart();

  const navigate = useNavigate();

  // Derive original‑price totals for consistency with the rest of the app
  const cartTotalOriginal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    const price = product?.originalPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const FREE_DELIVERY_THRESHOLD = 50000;
  const remainingForFree = FREE_DELIVERY_THRESHOLD - cartTotalOriginal;
  const isEligibleForFreeDelivery = cartTotalOriginal >= FREE_DELIVERY_THRESHOLD;
  const progressPercent = Math.min((cartTotalOriginal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer container */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black text-white px-5 py-5 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Your Cart</h2>
            <p className="text-sm text-gray-300 mt-1">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Cart items (or empty state) */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 mt-12">
              <FiShoppingBag className="text-6xl mb-4 text-gray-300" />
              <p className="text-xl font-medium text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-400 mb-6">Add some products to get started!</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Free delivery progress */}
              <div className={`rounded-2xl p-4 mb-6 ${
                isEligibleForFreeDelivery
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                {isEligibleForFreeDelivery ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-green-800 font-medium text-sm">Congratulations!</p>
                      <p className="text-green-700 text-xs">You qualify for <strong>free delivery</strong>!</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🚚</span>
                      <div>
                        <p className="text-blue-800 font-medium text-sm">
                          Add {formatCurrency(remainingForFree)} more
                        </p>
                        <p className="text-blue-700 text-xs">for <strong>free delivery</strong></p>
                      </div>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <p className="text-blue-600 text-xs text-right font-medium">
                      {Math.round(progressPercent)}% to free delivery
                    </p>
                  </>
                )}
              </div>

              {/* Cart items list */}
              <ul className="space-y-4">
                {cart.map((item) => {
                  // Get the original price for display (fallback to stored price)
                  const product = PRODUCTS.find(p => p.id === item.id);
                  const displayPrice = product?.originalPrice || item.price;

                  return (
                    <li
                      key={`${item.id}-${item.size}`}
                      className="group flex gap-4 pb-5 border-b border-gray-100 last:border-0"
                    >
                      {/* Product image */}
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif font-semibold text-black text-sm truncate pr-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>

                        {item.size && (
                          <span className="inline-block mt-1 bg-gray-50 text-gray-500 text-xs px-2 py-0.5 rounded border border-gray-100">
                            Size: {item.size}
                          </span>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity controls */}
                          <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, -1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-black hover:text-white transition-all disabled:opacity-40"
                            >
                              <FiMinus className="text-xs" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-black hover:text-white transition-all"
                            >
                              <FiPlus className="text-xs" />
                            </button>
                          </div>

                          {/* Price (original, per unit) */}
                          <p className="text-sm font-semibold text-black">
                            {formatCurrency(displayPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        {/* Footer (only when cart has items) */}
        {cart.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-5 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(cartTotalOriginal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className={isEligibleForFreeDelivery ? 'text-green-600 font-medium' : 'text-gray-500'}>
                  {isEligibleForFreeDelivery ? 'Free' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-black">Total</span>
                <span className="font-bold text-xl text-black">{formatCurrency(cartTotalOriginal)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>Proceed to Checkout</span>
              <span className="text-lg">→</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setIsCartOpen(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wider hover:border-black hover:text-black transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={clearCart}
                className="flex-1 border border-red-200 text-red-500 py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
              >
                Clear Cart
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <span>🔒 Secure Checkout</span>
              <span>•</span>
              <span>Paystack</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;