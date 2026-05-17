import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiHeart, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();

  const isActive = (path) => {
    if (path === '/cart') return false;
    return location.pathname === path;
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setIsCartOpen(true);
  };

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {/* Home */}
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/') ? 'text-black' : 'text-gray-400'
          }`}
        >
          <FiHome className="text-lg mb-1" />
          <span className="text-[10px] uppercase tracking-wider">Home</span>
        </Link>

        {/* Shop */}
        <Link 
          to="/shop" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/shop') ? 'text-black' : 'text-gray-400'
          }`}
        >
          <FiShoppingBag className="text-lg mb-1" />
          <span className="text-[10px] uppercase tracking-wider">Shop</span>
        </Link>

        {/* Cart */}
        <button 
          onClick={handleCartClick}
          className="flex flex-col items-center justify-center w-full h-full text-gray-400 relative"
        >
          <FiShoppingBag className="text-lg mb-1" />
          <span className="text-[10px] uppercase tracking-wider">Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-4 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* Account */}
        <button 
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/profile') || isActive('/login') ? 'text-black' : 'text-gray-400'
          }`}
        >
          <FiUser className="text-lg mb-1" />
          <span className="text-[10px] uppercase tracking-wider">
            {user ? 'Account' : 'Login'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;