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
          
          {/* Logo Image - Made bigger and bolder with drop shadow */}
          <img 
            src="/assets/moda2logo.jpeg" 
            alt="MODA WRLD Logo" 
            className={`w-64 md:w-96 lg:w-[32rem] h-auto mx-auto animate-pulse transition-all duration-1000 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{
              imageRendering: 'crisp-edges', // Makes image sharper
              filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.4)) drop-shadow(0 0 40px rgba(239, 68, 68, 0.2))', // Bold glow effect
            }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              // Fallback to text if image fails to load
              e.target.style.display = 'none';
              setImageLoaded(true);
              // Show fallback text logo
              const fallback = document.getElementById('fallback-logo');
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          
          {/* Fallback text logo if image doesn't load */}
          <div id="fallback-logo" className="hidden">
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-black animate-pulse">
              <span className="text-white">MODA</span>{' '}
              <span className="text-red-500">WRLD</span>
            </h1>
          </div>
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
            The current collection is sold out. New drops coming soon.
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
              href="https://www.instagram.com/mvdebymoda" 
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
    href="https://www.tiktok.com/@mvdebymoda" 
    target="_blank" 
    rel="noopener noreferrer"
    className="group text-gray-400 hover:text-red-500 transition-all duration-300"
  >
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-red-500 transition-all duration-300">
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    </div>
    <span className="block text-xs mt-2 group-hover:text-red-500">TikTok</span>
  </a>
            
            <a 
              href="mailto:contact@moda61wrld@gmail.com" 
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