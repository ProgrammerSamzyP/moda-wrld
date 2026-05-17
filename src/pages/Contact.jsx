import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  return (
    <section className="pt-6 md:pt-10 pb-12 md:pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-black mb-4 md:mb-6">Get in Touch</h1>
          <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg">
            Have questions? Reach out via WhatsApp for instant support.
          </p>
          <div className="space-y-4 md:space-y-6">
            <a href="https://wa.me/2349078859896" target="_blank" rel="noopener noreferrer" 
              className="flex items-start gap-3 md:gap-4 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                <FaWhatsapp className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-black text-sm md:text-base">WhatsApp</h3>
                <p className="text-gray-600 text-xs md:text-sm">+234 907 885 9896</p>
                <p className="text-green-600 text-xs font-bold mt-1">Usually replies in 10 minutes</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;