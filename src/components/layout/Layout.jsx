// src/components/layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* pt-16 matches the navbar's default h-16 (fixed header) */}
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Layout;