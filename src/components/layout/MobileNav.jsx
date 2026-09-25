import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiHome, FiGrid, FiShoppingBag, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cartCount } = useCart();

  const isActive = (path) => location.pathname === path;

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/cart');
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
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Main bottom bar – dark glass */}
      <div className="relative flex justify-around items-center h-16 bg-black/90 backdrop-blur-lg border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-1/4 h-full transition-colors ${
            isActive('/') ? 'text-red-500' : 'text-white/50 hover:text-white'
          }`}
        >
          <FiHome className="text-xl mb-0.5" />
          <span className="text-[10px] uppercase tracking-wider font-medium">Home</span>
        </Link>

        {/* Shop (now with distinct grid icon) */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center w-1/4 h-full transition-colors ${
            isActive('/shop') ? 'text-red-500' : 'text-white/50 hover:text-white'
          }`}
        >
          <FiGrid className="text-xl mb-0.5" />
          <span className="text-[10px] uppercase tracking-wider font-medium">Shop</span>
        </Link>

        {/* Empty spacer for the floating cart button */}
        <div className="w-1/4 h-full" />

        {/* Account */}
        <button
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center w-1/4 h-full transition-colors ${
            isActive('/profile') || isActive('/login')
              ? 'text-red-500'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <FiUser className="text-xl mb-0.5" />
          <span className="text-[10px] uppercase tracking-wider font-medium">
            {user ? 'Account' : 'Login'}
          </span>
        </button>
      </div>

      {/* Floating Cart Button – centered, raised, with a glow */}
      <button
        onClick={handleCartClick}
        className="absolute left-1/2 -translate-x-1/2 -top-6 w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 active:scale-95 transition-transform border-[3px] border-black/90"
      >
        <FiShoppingBag className="text-2xl" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-500 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black/90 shadow">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default MobileNav;