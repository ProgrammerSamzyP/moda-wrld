import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../services/firebase';
import { formatCurrency, formatDate } from '../utils/helpers';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadOrders();
  }, [isAdmin, navigate]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId);
        await loadOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(searchLower) ||
      order.customerName?.toLowerCase().includes(searchLower) ||
      order.customerEmail?.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0)
  };

  if (!isAdmin) return null;

  return (
    <div className="pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-black">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage orders and track revenue</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadOrders} className="text-sm text-gray-500 hover:text-black">
              🔄 Refresh
            </button>
            <button onClick={() => navigate('/')} className="text-sm text-black font-bold hover:text-red-500">
              View Store →
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: stats.total },
            { label: 'Pending', value: stats.pending },
            { label: 'Processing', value: stats.processing },
            { label: 'Confirmed', value: stats.confirmed },
            { label: 'Delivered', value: stats.delivered },
            { label: 'Revenue', value: formatCurrency(stats.revenue) }
          ].map(stat => (
            <div key={stat.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 uppercase mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input 
            type="text"
            placeholder="Search by order ID, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading orders...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-black">Order #{order.orderId}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    <p className="text-sm mt-2">
                      <strong>Customer:</strong> {order.customerName}
                    </p>
                    <p className="text-sm"><strong>Email:</strong> {order.customerEmail}</p>
                    <p className="text-sm"><strong>Phone:</strong> {order.customer?.phone}</p>
                    <p className="text-sm">
                      <strong>Address:</strong> {order.customer?.address}, {order.customer?.city}, {order.customer?.state}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 mt-4 md:mt-0">
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button 
                      onClick={() => handleDeleteOrder(order.id)}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-bold text-sm mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm bg-gray-50 rounded p-2">
                        <span>{item.name} x{item.quantity} ({item.size})</span>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment: {order.paymentMethod}</span>
                  <span className="font-bold text-lg">{formatCurrency(order.total)}</span>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;