import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.email}`);
      const savedWishlist = localStorage.getItem(`wishlist_${user.email}`);
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } else {
      const localCart = localStorage.getItem('moda_cart');
      const localWishlist = localStorage.getItem('moda_wishlist');
      if (localCart) setCart(JSON.parse(localCart));
      if (localWishlist) setWishlist(JSON.parse(localWishlist));
    }
  }, [user]);

  const saveCart = (newCart, newWishlist) => {
    setCart(newCart);
    setWishlist(newWishlist);
    if (user) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(newCart));
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(newWishlist));
    } else {
      localStorage.setItem('moda_cart', JSON.stringify(newCart));
      localStorage.setItem('moda_wishlist', JSON.stringify(newWishlist));
    }
  };

  const addToCart = (product, size) => {
    const existingItem = cart.find(item => item.id === product.id && item.size === size);
    let newCart;
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, size, quantity: 1 }];
    }
    saveCart(newCart, wishlist);
  };

  const removeFromCart = (productId, size) => {
    const newCart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart(newCart, wishlist);
  };

  const updateQuantity = (productId, size, change) => {
    const newCart = cart.map(item => {
      if (item.id === productId && item.size === size) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);
    saveCart(newCart, wishlist);
  };

  const toggleWishlist = (productId) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    saveCart(cart, newWishlist);
  };

  const clearCart = () => {
    saveCart([], wishlist);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, wishlist, isCartOpen, cartTotal, cartCount,
      addToCart, removeFromCart, updateQuantity, toggleWishlist,
      clearCart, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;