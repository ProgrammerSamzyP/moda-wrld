import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useUIContext } from '../../context/UIContext';
import { useCartContext } from '../../context/CartContext';
import CustomerForm from './CustomerForm';
import PaymentStep from './PaymentStep';
import PaymentForm from './PaymentForm';
import { calculateDeliveryFee, generateOrderId, formatCurrency } from '../../utils/helpers';
import { saveOrder } from '../../services/firebase';
import { sendOrderEmails } from '../../services/email';
import toast from 'react-hot-toast';

const STEPS = ['Customer Details', 'Payment Method', 'Complete Payment'];

const CheckoutModal = () => {
  const { isCheckoutOpen, closeCheckout, showSuccess } = useUIContext();
  const { cart, cartTotal, clearCart } = useCartContext();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [customerData, setCustomerData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cartTotal + deliveryFee;

  const handleCustomerSubmit = useCallback((data) => {
    const fee = calculateDeliveryFee(
      cartTotal,
      data.locationType,
      data.state,
      data.city
    );
    setCustomerData(data);
    setDeliveryFee(fee);
    setCurrentStep(2);
  }, [cartTotal]);

  const handlePaymentMethodSelect = useCallback((method) => {
    setPaymentMethod(method);
    setCurrentStep(3);
  }, []);

  const handlePaymentSuccess = useCallback(async (reference) => {
    setIsProcessing(true);
    try {
      const orderData = {
        orderId: reference || generateOrderId(),
        userId: customerData.userId,
        customerName: customerData.fullName,
        customerEmail: customerData.email,
        customer: customerData,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image
        })),
        subtotal: cartTotal,
        deliveryFee,
        total,
        paymentMethod,
        status: 'pending'
      };

      // Save order to Firebase
      await saveOrder(orderData);

      // Send confirmation emails
      await sendOrderEmails(orderData);

      // Clear cart and close modal
      await clearCart();
      closeCheckout();

      // Show success modal
      showSuccess({
        orderId: orderData.orderId,
        total
      });

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Failed to process order:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [customerData, cart, cartTotal, deliveryFee, total, paymentMethod, clearCart, closeCheckout, showSuccess]);

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, index) => (
        <React.Fragment key={index}>
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${index + 1 < currentStep
                ? 'bg-green-500 text-white'
                : index + 1 === currentStep
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-500'
              }
            `}
          >
            {index + 1 < currentStep ? '✓' : index + 1}
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`
                w-8 md:w-12 h-1
                ${index + 1 < currentStep ? 'bg-black' : 'bg-gray-200'}
              `}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-bold">{formatCurrency(cartTotal)}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Delivery Fee</span>
        <span className="font-bold">
          {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
        </span>
      </div>
      <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
        <span className="font-bold text-lg">Total</span>
        <span className="font-bold text-xl text-black">{formatCurrency(total)}</span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeCheckout}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <button
              onClick={closeCheckout}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              <FiX className="text-xl" />
            </button>

            <div className="p-6 md:p-8">
              {renderStepIndicator()}

              {currentStep === 1 && (
                <CustomerForm onSubmit={handleCustomerSubmit} />
              )}

              {currentStep === 2 && (
                <PaymentStep
                  deliveryFee={deliveryFee}
                  total={total}
                  cartTotal={cartTotal}
                  onSelect={handlePaymentMethodSelect}
                  onBack={() => goToStep(1)}
                />
              )}

              {currentStep === 3 && (
                <PaymentForm
                  total={total}
                  paymentMethod={paymentMethod}
                  customerData={customerData}
                  onSuccess={handlePaymentSuccess}
                  onBack={() => goToStep(2)}
                  isProcessing={isProcessing}
                />
              )}

              {renderOrderSummary()}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;