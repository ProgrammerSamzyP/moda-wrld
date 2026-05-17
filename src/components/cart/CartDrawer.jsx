import React from 'react';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    cartTotal, 
    cartCount,
    updateQuantity, 
    removeFromCart,
    clearCart 
  } = useCart();
  
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // Delivery threshold
  const FREE_DELIVERY_THRESHOLD = 50000;
  const remainingForFree = FREE_DELIVERY_THRESHOLD - cartTotal;
  const isEligibleForFreeDelivery = cartTotal >= FREE_DELIVERY_THRESHOLD;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-black text-white">
          <div>
            <h2 className="font-serif text-xl md:text-2xl">Your Cart</h2>
            <p className="text-xs text-gray-300 mt-1">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="hover:text-red-500 transition-colors p-2"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add some products to get started!</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-500 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Free Delivery Progress */}
              {!isEligibleForFreeDelivery ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🚚</span>
                    <div>
                      <p className="text-blue-800 text-sm font-medium">
                        Add {formatCurrency(remainingForFree)} more
                      </p>
                      <p className="text-blue-600 text-xs">for <strong>FREE delivery</strong>!</p>
                    </div>
                  </div>
                  <div className="bg-blue-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-full transition-all duration-500"
                      style={{
                        width: `${Math.min((cartTotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-blue-600 text-xs mt-2 text-right font-medium">
                    {Math.round((cartTotal / FREE_DELIVERY_THRESHOLD) * 100)}% to free delivery
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-green-800 text-sm font-medium">Congratulations!</p>
                      <p className="text-green-600 text-xs">Your order qualifies for <strong>FREE delivery</strong>!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-3 md:gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-20 h-24 md:w-24 md:h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-serif font-bold text-black text-sm mb-1 truncate">
                          {item.name}
                        </h4>
                        {item.size && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded mb-1">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors ml-2"
                        title="Remove item"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>

                    <p className="text-red-500 font-bold text-sm mb-2">
                      {formatCurrency(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, -1)}
                          className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus className="text-xs" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, 1)}
                          className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all"
                        >
                          <FiPlus className="text-xs" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-black">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-4 md:p-6 space-y-4">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className={isEligibleForFreeDelivery ? 'text-green-600 font-medium' : 'text-gray-600'}>
                  {isEligibleForFreeDelivery ? 'Free' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-black">Total</span>
                <span className="font-bold text-xl text-black">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 md:py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-red-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <span>→</span>
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 border-2 border-gray-200 text-gray-600 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider hover:border-black hover:text-black transition-all"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  className="flex-1 border-2 border-red-200 text-red-500 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span>🔒 Secure Checkout</span>
              <span>•</span>
              <span>Pay with Paystack</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;