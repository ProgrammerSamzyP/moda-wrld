import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 md:pt-16 pb-24 md:pb-8 mt-12 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-serif text-2xl font-bold mb-4 text-red-500">MODA WRLD</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">Redefining luxury streetwear with exclusivity and swag.</p>
            <div className="flex space-x-3">
              <a href="https://www.instagram.com/mvdebymoda" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500 hover:text-black transition-all">
                <FaInstagram />
              </a>
              <a href="https://www.tiktok.com/@mvdebymoda" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500 hover:text-black transition-all">
                <FaTiktok />
              </a>
              <a href="https://wa.me/2349078859896" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 transition-all">
                <FaWhatsapp />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-4 text-xs md:text-sm">Shop</h4>
            <ul className="space-y-2 text-gray-300 text-xs md:text-sm">
              <li><Link to="/shop?category=LH4H" className="hover:text-red-500 transition-colors">LH4H</Link></li>
              <li><Link to="/shop?category=Vengeance Arc.26" className="hover:text-red-500 transition-colors">Vengeance Arc.26</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-4 text-xs md:text-sm">Support</h4>
            <ul className="space-y-2 text-gray-300 text-xs md:text-sm">
              <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
              <li><a href="https://wa.me/2349078859896" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">WhatsApp Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-4 text-xs md:text-sm">Contact</h4>
            <a href="https://wa.me/2349078859896" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 px-3 py-2 rounded text-xs font-bold hover:scale-105 transition-transform w-full justify-center md:justify-start mb-2">
              <FaWhatsapp /> WhatsApp Us</a>
            <p className="text-xs text-gray-400 mt-2">Fast response guaranteed</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 md:pt-8 text-center text-gray-400 text-xs">
          <p>&copy; 2024 Moda Wrld. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;