import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useUIContext } from '../../context/UIContext';
import { useCartContext } from '../../context/CartContext';
import { formatCurrency, calculateDiscount } from '../../utils/helpers';
import { WHATSAPP_CONFIG } from '../../utils/constants';

const ProductModal = () => {
  const { isProductModalOpen, selectedProduct, closeProductModal } = useUIContext();
  const { addToCart, wishlist, toggleWishlist } = useCartContext();
  const [selectedSize, setSelectedSize] = useState('');

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const discountPercent = calculateDiscount(selectedProduct.price, selectedProduct.originalPrice);
  const isSoldOut = !selectedProduct.inStock;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(selectedProduct, selectedSize);
    closeProductModal();
  };

  return (
    <AnimatePresence>
      {isProductModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeProductModal}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="relative bg-white rounded-t-2xl md:rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={closeProductModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-gray-100 shadow-lg"
            >
              <FiX className="text-xl" />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="h-64 md:h-auto bg-gray-100 md:aspect-square">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="p-4 md:p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-red-500 uppercase tracking-widest text-xs font-bold">
                    {selectedProduct.category}
                  </p>
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`text-2xl ${isWishlisted ? 'text-red-500' : 'text-gray-300'}`}
                  >
                    <FiHeart className={isWishlisted ? 'fill-current' : ''} />
                  </button>
                </div>

                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 md:mb-4">
                  {selectedProduct.name}
                </h2>

                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xl md:text-2xl font-bold text-black">
                    {formatCurrency(selectedProduct.price)}
                  </p>
                  {selectedProduct.originalPrice && (
                    <>
                      <p className="text-sm text-gray-400 line-through">
                        {formatCurrency(selectedProduct.originalPrice)}
                      </p>
                      <span className="discount-badge">-{discountPercent}% OFF</span>
                    </>
                  )}
                </div>

                <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                  {selectedProduct.description}
                </p>

                {isSoldOut ? (
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                      <span className="font-bold">Out of Stock</span>
                    </div>
                    <a
                      href={`https://wa.me/${WHATSAPP_CONFIG.number}?text=Hi%20Moda%20Wrld,%20is%20${encodeURIComponent(selectedProduct.name)}%20available?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 text-white font-bold py-3 uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform text-sm"
                    >
                      <FaWhatsapp /> Check Availability
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Size Selection */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                        Select Size
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`
                              px-4 py-2 border rounded text-sm font-medium transition-all
                              ${
                                selectedSize === size
                                  ? 'bg-red-500 text-white border-red-500'
                                  : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                              }
                            `}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-black text-white font-bold py-3 md:py-4 uppercase tracking-widest hover:bg-red-500 transition-all duration-300 shadow-lg rounded-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;