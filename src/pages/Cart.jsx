import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import { PRODUCTS } from '../utils/constants';

const heading = 'font-black uppercase tracking-tight';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount } = useCart();
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
  const progressPercent = Math.min((cartTotalOriginal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-white flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <h1 className={`${heading} text-4xl text-black mb-3`}>Your cart is empty</h1>
          <p className="text-gray-500 mb-8">
            Nothing here yet. From the streets of Lagos to your wardrobe, start with the latest drop.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#FF4F9A] hover:text-black transition-colors"
          >
            <FiShoppingBag /> Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between border-b border-black pb-5">
          <h1 className={`${heading} text-4xl md:text-6xl text-black leading-none`}>Your cart</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Items */}
          <div className="lg:col-span-2">
            {/* Free delivery progress */}
            <div className={`p-5 mb-8 ${isEligibleForFreeDelivery ? 'bg-[#FF4F9A]' : 'border border-black'}`}>
              {isEligibleForFreeDelivery ? (
                <p className="font-black uppercase tracking-tight text-black">
                  Free delivery unlocked. Your order ships on us.
                </p>
              ) : (
                <>
                  <p className="text-sm text-black mb-3">
                    Add <strong>{formatCurrency(remainingForFree)}</strong> more for free delivery
                  </p>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className="bg-black h-2 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            <ul className="divide-y divide-gray-200 border-y border-gray-200">
              {cart.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.id);
                const price = product?.originalPrice || item.price;

                return (
                  <li key={`${item.id}-${item.size}`} className="flex gap-4 sm:gap-6 py-6">
                    <div className="w-24 h-32 sm:w-28 sm:h-36 bg-gray-100 shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <h3 className={`${heading} text-base sm:text-lg text-black truncate`}>{item.name}</h3>
                          {item.size && (
                            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">
                              Size {item.size}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-gray-400 hover:text-black p-1 transition-colors"
                          title="Remove"
                          aria-label={`Remove ${item.name}`}
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center border border-black w-fit">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, -1)}
                            disabled={item.quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus className="text-sm" />
                          </button>
                          <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <FiPlus className="text-sm" />
                          </button>
                        </div>

                        <p className="text-lg font-black text-black">{formatCurrency(price * item.quantity)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between mt-6">
              <Link
                to="/shop"
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black hover:text-[#FF4F9A] transition-colors"
              >
                <FiArrowLeft /> Continue shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-sm font-bold uppercase tracking-widest text-gray-500 underline underline-offset-4 hover:text-black transition-colors"
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-black text-white p-6 sm:p-8 lg:sticky lg:top-28">
              <h2 className={`${heading} text-xl mb-6`}>Order summary</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(cartTotalOriginal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery</span>
                  <span className={isEligibleForFreeDelivery ? 'text-[#FF4F9A] font-bold' : 'text-gray-400'}>
                    {isEligibleForFreeDelivery ? 'Free' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-black pt-4 border-t border-neutral-700">
                  <span className="uppercase">Total</span>
                  <span>{formatCurrency(cartTotalOriginal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="mt-8 w-full bg-white text-black py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#FF4F9A] transition-colors"
              >
                Checkout
              </button>

              <p className="mt-5 text-xs text-gray-400 text-center">
                Secure payment by Paystack. Delivery across Nigeria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;