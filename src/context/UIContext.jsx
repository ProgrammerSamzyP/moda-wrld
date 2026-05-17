import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
  };

  const openCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const showSuccess = (data) => {
    setSuccessData(data);
    setIsSuccessModalOpen(true);
  };

  const closeSuccess = () => {
    setSuccessData(null);
    setIsSuccessModalOpen(false);
  };

  const value = {
    isCheckoutOpen,
    isAuthOpen,
    authMode,
    isProductModalOpen,
    selectedProduct,
    isMobileMenuOpen,
    isSuccessModalOpen,
    successData,
    openAuth,
    closeAuth,
    openCheckout,
    closeCheckout,
    openProductModal,
    closeProductModal,
    toggleMobileMenu,
    showSuccess,
    closeSuccess
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export default UIContext;