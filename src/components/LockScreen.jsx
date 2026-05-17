import React, { useState } from 'react';

const LockScreen = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center px-4 max-w-2xl mx-auto">
        {/* Logo/Title with animation */}
        <div className="mb-8">
          {/* Loading spinner while image loads */}
          {!imageLoaded && (
            <div className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-4 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Logo Image with fade-in and pulse animation */}
          <img 
            src="/assets/modalogo2.jpeg" 
            alt="MODA WRLD Logo" 
            className={`w-48 md:w-64 lg:w-80 h-auto mx-auto animate-pulse transition-opacity duration-1000 ${
              imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              // Fallback to text if image fails to load
              e.target.style.display = 'none';
              setImageLoaded(true);
            }}
          />
          
          {/* Fallback text logo if image doesn't load */}
          {imageLoaded && (
            <div id="fallback-logo" className="hidden">
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold animate-pulse">
                <span className="text-white">MODA</span>{' '}
                <span className="text-red-500">WRLD</span>
              </h1>
            </div>
          )}
        </div>
        
        {/* Lock Icon and Message */}
        <div className="mb-10">
          <div className="text-7xl mb-6">🔒</div>
          <h2 className="text-white font-serif text-3xl md:text-4xl font-bold mb-4">
            Drops Have Ended
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-3">
            Thank you for the incredible support!
          </p>
          <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto">
            The current collection has sold out. New drops coming soon.
            Stay connected for exclusive releases and updates.
          </p>
        </div>
        
        {/* Social Links */}
        <div className="space-y-6">
          <p className="text-gray-500 text-sm uppercase tracking-widest">
            Follow Us
          </p>
          <div className="flex justify-center space-x-8">
            <a 
              href="https://instagram.com/modawrld" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group text-gray-400 hover:text-red-500 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-red-500 transition-all duration-300">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span className="block text-xs mt-2 group-hover:text-red-500">Instagram</span>
            </a>
            
            <a 
              href="https://twitter.com/modawrld" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group text-gray-400 hover:text-red-500 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-red-500 transition-all duration-300">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
              <span className="block text-xs mt-2 group-hover:text-red-500">Twitter</span>
            </a>
            
            <a 
              href="mailto:contact@modawrld.com" 
              className="group text-gray-400 hover:text-red-500 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-red-500 transition-all duration-300">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <span className="block text-xs mt-2 group-hover:text-red-500">Email</span>
            </a>
          </div>
        </div>
        
        {/* Footer note */}
        <p className="text-gray-700 text-xs mt-12">
          © {new Date().getFullYear()} MODA WRLD. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LockScreen;