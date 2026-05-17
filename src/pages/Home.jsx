import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { PRODUCTS } from '../utils/constants';

const Home = () => {
  const featuredProducts = PRODUCTS.slice(0, 4);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <>
      {/* Hero Section with Background Video */}
      <section className="relative h-[80vh] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoadedData={() => setIsVideoLoaded(true)}
          poster="/assets/hero-fallback.jpg"
        >
          <source src="/assets/modavidnew.mp4" type="video/mp4" />
          <source src="/assets/modavidnew.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {/* Fallback Background Image (shows while video loads) */}
        {!isVideoLoaded && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/assets/hero-fallback.jpg')`,
            }}
          />
        )}

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/60"></div>

        {/* Gradient overlay for smoother transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="text-white">MODA</span>{' '}
              <span className="text-red-500">WRLD</span>
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Link 
              to="/shop" 
              className="group relative inline-block bg-red-500 text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded-lg overflow-hidden"
            >
              <span className="relative z-10">Shop Collection</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-black mb-4">
            The Collection
          </h2>
          <div className="w-16 md:w-24 h-1 bg-red-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
          <Link to="/shop?category=LH4H" className="group relative h-64 md:h-96 overflow-hidden rounded-lg shadow-xl cursor-pointer">
            <img 
              src="/assets/LH4H-IMG.jpeg" 
              alt="LH4H Collection" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white font-serif text-2xl md:text-3xl font-bold border-2 border-white px-6 py-2 md:px-8 md:py-3 group-hover:bg-red-500 group-hover:border-red-500 transition-all">
                LH4H
              </h3>
            </div>
          </Link>
          <Link to="/shop?category=Vengeance Arc.26" className="group relative h-64 md:h-96 overflow-hidden rounded-lg shadow-xl cursor-pointer">
            <img 
              src="/assets/V.arc-img.jpeg" 
              alt="Vengeance Arc.26 Collection" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white font-serif text-2xl md:text-3xl font-bold border-2 border-white px-6 py-2 md:px-8 md:py-3 group-hover:bg-red-500 group-hover:border-red-500 transition-all">
                Vengeance Arc.26
              </h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-6 md:mb-12">
            <div>
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-black mb-1 md:mb-2">
                Latest Drops
              </h2>
              <p className="text-xs md:text-base text-gray-500">
                Handpicked essentials from this season.
              </p>
            </div>
            <Link to="/shop" className="text-black font-bold border-b-2 border-red-500 hover:text-red-500 transition-colors text-xs md:text-sm">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover:shadow-lg rounded-lg transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-black mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">3-5 business days within Nigeria</p>
            </div>
            <div className="text-center p-6 hover:shadow-lg rounded-lg transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-black mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secure checkout with Paystack</p>
            </div>
            <div className="text-center p-6 hover:shadow-lg rounded-lg transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏅</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-black mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">Crafted with premium materials</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;