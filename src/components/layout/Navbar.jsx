import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiHeart,
  FiChevronDown,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 👇 Cart now goes to full page instead of drawer
  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const handleAccountClick = () => {
    if (user) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/logo.jpeg"
              alt="MODA WRLD Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {[
              { to: '/', label: 'Home' },
              { to: '/shop', label: 'Shop' },
              { to: '/about', label: 'Story' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-sm uppercase tracking-[.2em] text-white/80 hover:text-red-500 transition-colors group"
              >
                {link.label}
                <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-5">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden md:block text-white/80 hover:text-red-500 transition-colors"
            >
              <FiHeart className="text-xl" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="relative text-white/80 hover:text-red-500 transition-colors"
            >
              <FiShoppingBag className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Button with Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={handleAccountClick}
                className="flex items-center gap-1 text-white/80 hover:text-red-500 transition-colors"
              >
                <FiUser className="text-xl" />
                {user && <FiChevronDown className="text-sm" />}
              </button>

              {isDropdownOpen && user && (
                <div className="absolute right-0 mt-3 w-52 bg-black/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="font-bold text-white text-sm truncate">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user?.email === 'modawrld61@gmail.com' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2.5 text-sm text-red-400 font-semibold hover:bg-red-500/10 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <hr className="my-1 border-white/10" />
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white/80 hover:text-red-500 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <FiMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (dark theme consistent with navbar) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10">
          <div className="px-4 py-3">
            {user && (
              <div className="px-3 py-4 border-b border-white/10 mb-2">
                <p className="font-bold text-white">{user.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            )}
            {['Home', 'Shop', 'Story', 'Contact'].map((label) => (
              <Link
                key={label}
                to={label === 'Home' ? '/' : `/${label.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-gray-200 hover:bg-white/10 transition-colors font-medium"
              >
                {label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-gray-200 hover:bg-white/10 transition-colors"
                >
                  My Orders
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-gray-200 hover:bg-white/10 transition-colors"
                >
                  Wishlist
                </Link>
                {user.email === 'modawrld61@gmail.com' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-3 rounded-lg text-red-400 font-bold hover:bg-red-500/10 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-gray-200 font-bold hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-gray-200 hover:bg-white/10 transition-colors"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Outside click to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;