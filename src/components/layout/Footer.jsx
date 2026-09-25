import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Top row: brand, social icons, and a small navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/"
            className="font-serif text-xl font-bold text-red-500 hover:text-white transition-colors"
          >
            MODA WRLD
          </Link>

          {/* Tiny navigation links – optional, keeps it minimal */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/shop" className="hover:text-red-500 transition-colors">
              Shop
            </Link>
            <Link to="/about" className="hover:text-red-500 transition-colors">
              Story
            </Link>
            <Link to="/contact" className="hover:text-red-500 transition-colors">
              Contact
            </Link>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/mvdebymoda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="text-lg" />
            </a>
            <a
              href="https://www.tiktok.com/@mvdebymoda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok className="text-lg" />
            </a>
            <a
              href="https://wa.me/2349078859896"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-500 transition-colors"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-lg" />
            </a>
          </div>
        </div>

        {/* Bottom row: copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} MODA WRLD. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;