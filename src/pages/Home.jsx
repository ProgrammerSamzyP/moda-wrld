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
      <section className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-90' : 'opacity-0'
          }`}
          onLoadedData={() => setIsVideoLoaded(true)}
          poster="/assets/hero-fallback.jpg"
        >
          <source src="/assets/modavidnew.mp4" type="video/mp4" />
          <source src="/assets/modavidnew.webm" type="video/webm" />
        </video>

        {/* Fallback Image */}
        {!isVideoLoaded && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/assets/hero-fallback.jpg')` }}
          />
        )}

        {/* Overlay with red-tinted gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="animate-fade-in space-y-4 md:space-y-6">
            {/* Brand Name */}
            {/* <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="text-white drop-shadow-lg">MODA</span>{' '}
              <span className="text-red-500 drop-shadow-lg">WRLD</span>
            </h1> */}

            {/* Tagline */}
            {/* <p className="text-sm md:text-lg text-gray-300 max-w-xl mx-auto font-light tracking-wider uppercase">
              Premium Streetwear • Crafted for the Bold
            </p> */}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/shop"
                className="group relative inline-block bg-red-500 text-white px-10 py-5 font-bold uppercase tracking-widest text-sm overflow-hidden rounded-md"
              >
                <span className="relative z-10">Shop Collection</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                {/* <span className="relative z-10 group-hover:text-black">Shop Collection</span> */}
              </Link>
              
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section – Black background */}
      <section className="py-16 md:py-24 bg-black text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
              The <span className="text-red-500">Collection</span>
            </h2>
            <div className="w-20 h-1 bg-red-500 mx-auto mb-4" />
            <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
              Two distinct lines. One identity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto">
            {/* LH4H */}
            <Link
              to="/shop?category=LH4H"
              className="group relative h-72 md:h-[28rem] overflow-hidden rounded-2xl shadow-2xl"
            >
              <img
                src="/assets/LH4H-IMG.jpeg"
                alt="LH4H Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 md:pb-14">
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 border-b-2 border-red-500 pb-2">
                  LH4H
                </h3>
                <span className="text-sm uppercase tracking-[.3em] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Explore Collection →
                </span>
              </div>
            </Link>

            {/* Vengeance Arc.26 */}
            <Link
              to="/shop?category=Vengeance Arc.26"
              className="group relative h-72 md:h-[28rem] overflow-hidden rounded-2xl shadow-2xl"
            >
              <img
                src="/assets/V.arc-img.jpeg"
                alt="Vengeance Arc.26 Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 md:pb-14">
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 border-b-2 border-red-500 pb-2">
                  Vengeance Arc.26
                </h3>
                <span className="text-sm uppercase tracking-[.3em] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Explore Collection →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Drops – White background with black text */}
      

      {/* Features / Brand Values – Black background */}
     
    </>
  );
};

export default Home;