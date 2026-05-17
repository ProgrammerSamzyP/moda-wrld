import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import { useUIContext } from '../../context/UIContext';
import { formatCurrency } from '../../utils/helpers';

const SuccessModal = () => {
  const { isSuccessModalOpen, successData, closeSuccess } = useUIContext();

  return (
    <AnimatePresence>
      {isSuccessModalOpen && successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeSuccess}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
          >
            <button
              onClick={closeSuccess}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              <FiX />
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-5xl text-green-500" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-black mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600">
                Your order has been placed successfully
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Order ID:</span>
                <span className="text-sm font-mono font-bold text-black">
                  {successData.orderId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="text-sm font-bold text-black">
                  {formatCurrency(successData.total)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/orders"
                onClick={closeSuccess}
                className="block w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-wider text-center hover:bg-red-500 transition-all"
              >
                View My Orders
              </Link>
              <Link
                to="/shop"
                onClick={closeSuccess}
                className="block w-full border-2 border-black text-black py-3 rounded-lg font-bold uppercase tracking-wider text-center hover:bg-black hover:text-white transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;