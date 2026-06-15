import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiRefreshCw,
  FiMapPin,
  FiCreditCard,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/firebase';
import { formatCurrency, formatDate } from '../utils/helpers';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const loadOrders = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const userOrders = await getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line
  }, [user]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: <FiClock className="text-lg" />,
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'processing':
        return {
          icon: <FiPackage className="text-lg" />,
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
        };
      case 'confirmed':
        return {
          icon: <FiCheck className="text-lg" />,
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
        };
      case 'shipped':
        return {
          icon: <FiTruck className="text-lg" />,
          color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
        };
      case 'delivered':
        return {
          icon: <FiCheck className="text-lg" />,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'cancelled':
        return {
          icon: <FiClock className="text-lg" />,
          color: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
        };
      default:
        return {
          icon: <FiClock className="text-lg" />,
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          dot: 'bg-gray-500',
        };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-7xl mb-5">🔒</div>
          <h1 className="text-2xl font-serif font-bold mb-3">Login Required</h1>
          <p className="text-gray-500 mb-8">Sign in to view your orders and track deliveries.</p>
          <Link
            to="/login"
            className="inline-block bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 text-sm font-medium text-black hover:text-red-500 transition-colors"
            >
              Continue Shopping →
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-5 text-sm">Loading your orders...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-500 mb-6">{error}</p>
            <button
              onClick={loadOrders}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-7xl mb-5">📦</div>
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              Looks like you haven’t placed any orders. Start exploring our latest drops!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusCfg = getStatusConfig(order.status);
              const isExpanded = expandedOrder === order.orderId || expandedOrder === order.id;

              return (
                <div
                  key={order.id || order.orderId}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden animate-fade-in"
                >
                  {/* Order header (always visible) */}
                  <div
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                    onClick={() => toggleOrderDetails(order.orderId || order.id)}
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusCfg.color} border`}>
                        {statusCfg.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-base truncate">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(order.createdAt || order.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${statusCfg.color}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                        {order.status}
                      </span>
                      {isExpanded ? (
                        <FiChevronUp className="text-gray-400 text-lg hidden sm:block" />
                      ) : (
                        <FiChevronDown className="text-gray-400 text-lg hidden sm:block" />
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 sm:px-6 py-5 bg-gray-50/50 space-y-5 animate-fade-in">
                      {/* Delivery address */}
                      <div className="flex items-start gap-3">
                        <FiMapPin className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                          <p className="text-sm text-gray-600">
                            {order.customer?.address}, {order.customer?.city}, {order.customer?.state}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Items ({order.items?.length || 0})
                        </h4>
                        <div className="space-y-3">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {item.image && (
                                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Qty: {item.quantity}
                                    {item.size && ` · Size: ${item.size}`}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 ml-4">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order total summary */}
                      <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Delivery Fee</span>
                            <span
                              className={
                                order.deliveryFee === 0
                                  ? 'text-emerald-600 font-medium'
                                  : 'font-medium'
                              }
                            >
                              {order.deliveryFee === 0
                                ? 'Free'
                                : formatCurrency(order.deliveryFee)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-gray-100">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="font-bold text-lg text-red-500">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment method */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FiCreditCard className="text-gray-400" />
                        Payment via {order.paymentMethod?.toUpperCase() || 'Paystack'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;