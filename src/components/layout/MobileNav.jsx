import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, Grid3x3, ShoppingBag, User } from 'lucide-react';
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

  const tabClass = (active) =>
    `flex flex-col items-center justify-center w-1/4 h-full transition-colors ${
      active ? 'text-black' : 'text-neutral-400 hover:text-neutral-700'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Main bottom bar – white glass */}
      <div className="relative flex justify-around items-center h-16 bg-white/95 backdrop-blur-lg border-t border-neutral-200 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">

        {/* Home */}
        <Link to="/" className={tabClass(isActive('/'))}>
          <Home className="h-5 w-5 mb-0.5" strokeWidth={isActive('/') ? 2.2 : 1.6} />
          <span className="text-[10px] uppercase tracking-wider font-medium">
            Home
          </span>
        </Link>

        {/* Shop */}
        <Link to="/shop" className={tabClass(isActive('/shop'))}>
          <Grid3x3 className="h-5 w-5 mb-0.5" strokeWidth={isActive('/shop') ? 2.2 : 1.6} />
          <span className="text-[10px] uppercase tracking-wider font-medium">
            Shop
          </span>
        </Link>

        {/* Spacer for floating cart */}
        <div className="w-1/4 h-full" />

        {/* Account */}
        <button
          onClick={handleAccountClick}
          className={tabClass(isActive('/profile') || isActive('/login'))}
        >
          <User
            className="h-5 w-5 mb-0.5"
            strokeWidth={
              isActive('/profile') || isActive('/login') ? 2.2 : 1.6
            }
          />
          <span className="text-[10px] uppercase tracking-wider font-medium">
            {user ? 'Account' : 'Login'}
          </span>
        </button>
      </div>

      {/* Floating Cart Button – centered, raised, black */}
      <button
        onClick={handleCartClick}
        aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart, empty'}
        className="
          absolute left-1/2 -translate-x-1/2 -top-6
          w-16 h-16
          bg-black text-white
          rounded-full
          flex items-center justify-center
          shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          active:scale-95
          transition-transform
          border-[3px] border-white
        "
      >
        <ShoppingBag className="h-6 w-6" strokeWidth={1.8} />

        {cartCount > 0 && (
          <span
            aria-hidden="true"
            className="
              absolute -top-1 -right-1
              min-w-[20px] h-5 px-1
              bg-white text-black
              text-[10px] font-bold
              rounded-full
              flex items-center justify-center
              border-2 border-black
            "
          >
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default MobileNav;