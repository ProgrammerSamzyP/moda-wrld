import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getUserOrders } from '../services/firebase';
import { FiUser, FiPackage, FiHeart, FiLogOut, FiShoppingBag, FiChevronRight } from 'react-icons/fi';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { cart, wishlist } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (user?.email) {
        try {
          const userOrders = await getUserOrders(user.email);
          setOrders(userOrders || []);
        } catch (error) {
          console.error('Error loading orders:', error);
          setOrders([]);
        }
      }
      setLoading(false);
    };
    
    loadOrders();
  }, [user]);

  // If user is logged in, show profile
  if (user) {
    return (
      <div className="pt-20 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold flex-shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold truncate">{user.name || 'User'}</h1>
                <p className="text-gray-500 text-sm truncate">{user.email}</p>
                {isAdmin && (
                  <span className="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded mt-1 font-bold">
                    ADMIN
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="text-center bg-gray-50 rounded-lg p-3 md:p-4">
                <p className="text-xl md:text-2xl font-bold">{loading ? '-' : orders.length}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3 md:p-4">
                <p className="text-xl md:text-2xl font-bold">{wishlist.length}</p>
                <p className="text-xs text-gray-500">Wishlist</p>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3 md:p-4">
                <p className="text-xl md:text-2xl font-bold">{cart.length}</p>
                <p className="text-xs text-gray-500">Cart Items</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <button 
              onClick={() => navigate('/orders')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <FiPackage className="text-xl text-black" />
                <div className="text-left">
                  <span className="font-medium">My Orders</span>
                  <p className="text-xs text-gray-500">Track your orders</p>
                </div>
              </div>
              <FiChevronRight className="text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigate('/wishlist')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <FiHeart className="text-xl text-black" />
                <div className="text-left">
                  <span className="font-medium">Wishlist</span>
                  {wishlist.length > 0 && (
                    <p className="text-xs text-gray-500">{wishlist.length} items saved</p>
                  )}
                </div>
              </div>
              <FiChevronRight className="text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigate('/shop')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiShoppingBag className="text-xl text-black" />
                <div className="text-left">
                  <span className="font-medium">Shop</span>
                  <p className="text-xs text-gray-500">Browse products</p>
                </div>
              </div>
              <FiChevronRight className="text-gray-400" />
            </button>
          </div>

          {/* Admin Button */}
          {isAdmin && (
            <button 
              onClick={() => navigate('/admin')}
              className="w-full bg-red-500 text-white py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-red-600 transition-all mb-4 flex items-center justify-center gap-2"
            >
              <span>🛡️</span>
              Admin Dashboard
            </button>
          )}

          {/* Logout Button */}
          <button 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full border-2 border-red-500 text-red-500 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <FiLogOut />
            Logout
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} Moda Wrld. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show login/signup options
  return (
    <div className="pt-20 pb-20 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUser className="text-4xl text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Moda Wrld</h1>
          <p className="text-gray-500 mb-8 text-sm">Sign in to access your account, track orders, and manage your wishlist</p>
          
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-red-500 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="block w-full border-2 border-black text-black py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-4">Or continue without an account</p>
            <button
              onClick={() => navigate('/shop')}
              className="text-sm text-gray-600 hover:text-red-500 transition-colors"
            >
              Browse Shop →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;