import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsCartOpen(true);
  };

  const handleAccountClick = () => {
    if (user) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-serif font-bold text-red-500">MODA WRLD</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm uppercase tracking-widest text-red-500 hover:text-white transition-colors">Home</Link>
            <Link to="/shop" className="text-sm uppercase tracking-widest text-red-500 hover:text-white transition-colors">Shop</Link>
            <Link to="/about" className="text-sm uppercase tracking-widest text-red-500 hover:text-white transition-colors">Story</Link>
            <Link to="/contact" className="text-sm uppercase tracking-widest text-red-500 hover:text-white transition-colors">Contact</Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link to="/wishlist" className="hidden md:block text-red-500 hover:text-white transition-colors">
              <FiHeart className="text-xl" />
            </Link>

            {/* Cart Button */}
            <button onClick={handleCartClick} className="text-red-500 hover:text-white transition-colors relative">
              <FiShoppingBag className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Button with Dropdown */}
            <div className="relative hidden md:block">
              <button onClick={handleAccountClick} className="text-red-500 hover:text-white transition-colors">
                <FiUser className="text-xl" />
              </button>
              
              {isDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-black text-sm truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                    My Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                    My Orders
                  </Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 md:hidden" onClick={() => setIsDropdownOpen(false)}>
                    Wishlist
                  </Link>
                  {user?.email === 'modawrld61@gmail.com' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-50 font-bold" onClick={() => setIsDropdownOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <hr className="my-1" />
                  <button 
                    onClick={() => { logout(); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-red-500 hover:text-white transition-colors">
              {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-black shadow-lg">
          <div className="px-4 py-2">
            {user && (
              <div className="px-3 py-4 border-b border-gray-100 mb-2">
                <p className="font-bold text-black">{user.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 hover:bg-gray-50 rounded-lg">Home</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 hover:bg-gray-50 rounded-lg">Shop</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 hover:bg-gray-50 rounded-lg">Story</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 hover:bg-gray-50 rounded-lg">Contact</Link>
            
            {user ? (
              <>
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 hover:bg-gray-50 rounded-lg">My Orders</Link>
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 hover:bg-gray-50 rounded-lg">Wishlist</Link>
                {user.email === 'modawrld61@gmail.com' && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-red-500 font-bold hover:bg-gray-50 rounded-lg">Admin Dashboard</Link>
                )}
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-3 text-red-600 hover:bg-gray-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 hover:bg-gray-50 rounded-lg font-bold">Sign In</Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 hover:bg-gray-50 rounded-lg">Create Account</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
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