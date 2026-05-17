import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheck, FiClock, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/firebase';
import { formatCurrency, formatDate } from '../utils/helpers';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const userOrders = await getUserOrders(user.uid);   // ← now passes UID
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
  }, [user]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'processing': return <FiPackage className="text-blue-500" />;
      case 'confirmed': return <FiCheck className="text-purple-500" />;
      case 'shipped': return <FiTruck className="text-indigo-500" />;
      case 'delivered': return <FiCheck className="text-green-500" />;
      case 'cancelled': return <FiClock className="text-red-500" />;
      default: return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="pt-20 pb-20">
        <div className="max-w-2xl mx-auto text-center px-4">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-500 mb-6">You need to login to view your orders</p>
          <Link to="/profile" className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-red-500 transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-black">My Orders</h1>
            <p className="text-gray-500 mt-1">Track and manage your orders</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={loadOrders}
              className="text-sm text-gray-500 hover:text-black flex items-center gap-1"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <Link to="/shop" className="text-sm text-black font-bold hover:text-red-500">
              Continue Shopping →
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={loadOrders} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-red-500">
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="font-serif text-xl font-bold text-black mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-8">You haven't placed any orders yet. Start shopping!</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-red-500 transition-all">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-red-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b">
                  <div>
                    <h3 className="font-bold text-black text-lg">Order #{order.orderId}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt || order.date)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase mt-2 md:mt-0 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">📍 Delivery Address:</span><br />
                    {order.customer?.address}, {order.customer?.city}, {order.customer?.state}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Items ({order.items?.length || 0})</h4>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded" />
                          )}
                          <div>
                            <span className="font-medium text-black">{item.name}</span>
                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                            {item.size && <span className="text-xs text-gray-400 ml-2">({item.size})</span>}
                          </div>
                        </div>
                        <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className={order.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                        {order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold text-lg">
                      <span>Total</span>
                      <span className="text-red-500">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Payment Method: {order.paymentMethod?.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;