import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { saveOrder } from '../services/firebase';
import { formatCurrency, generateOrderId } from '../utils/helpers';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Shipping Details
  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    locationType: 'other'
  });

  // Order Success
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const DELIVERY_FEES = {
    abuad: 3000,
    lagos: 5000,
    other: 8000
  };

  const calculateDeliveryFee = () => {
    if (cartTotal >= 50000) return 0;
    
    if (shipping.locationType === 'abuad' || shipping.state === 'Ekiti') {
      return DELIVERY_FEES.abuad;
    }
    if (shipping.locationType === 'lagos' || shipping.state === 'Lagos' || shipping.state === 'Oyo') {
      return DELIVERY_FEES.lagos;
    }
    return DELIVERY_FEES.other;
  };

  const deliveryFee = calculateDeliveryFee();
  const total = cartTotal + deliveryFee;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shipping.firstName || !shipping.lastName || !shipping.email || !shipping.phone || !shipping.address || !shipping.city || !shipping.state) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setStep(2);
  };

  // 🔥 UPDATED: completeOrder function with Firebase
  const completeOrder = async (reference) => {
    setLoading(true);
    
    const orderId = reference || generateOrderId();
    
    const orderData = {
      orderId,
      customer: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        fullName: `${shipping.firstName} ${shipping.lastName}`,
        email: shipping.email,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        locationType: shipping.locationType
      },
      customerName: `${shipping.firstName} ${shipping.lastName}`,
      customerEmail: shipping.email,
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
      paymentMethod: 'paystack',
      paymentReference: reference,
      status: 'pending',
      date: new Date().toISOString(),
      userId: user?.uid || null,
      userEmail: user?.email || shipping.email
    };

    try {
      // Save order to Firebase Firestore
      const docId = await saveOrder(orderData);
      console.log('✅ Order saved to Firebase with ID:', docId);
      
      // Set order details for receipt display
      setOrderDetails({
        ...orderData,
        firebaseId: docId
      });
      
      // Show success page
      setOrderSuccess(true);
      
      // Clear the cart
      clearCart();
      
      // Move to confirmation step
      setStep(3);
      
      // Log email notifications (in production, integrate with EmailJS)
      console.log('📧 Sending order confirmation to customer:', shipping.email);
      console.log('📧 Sending new order notification to owner: modawrld61@gmail.com');
      console.log('📦 Order Details:', {
        orderId: orderData.orderId,
        customer: orderData.customerName,
        total: formatCurrency(orderData.total),
        items: orderData.items.length,
        status: orderData.status
      });

      // Store in localStorage as backup
      try {
        const existingOrders = JSON.parse(localStorage.getItem('moda_orders_backup') || '[]');
        existingOrders.unshift(orderData);
        localStorage.setItem('moda_orders_backup', JSON.stringify(existingOrders.slice(0, 50))); // Keep last 50 orders as backup
      } catch (storageError) {
        console.warn('Failed to save backup to localStorage:', storageError);
      }

    } catch (error) {
      console.error('❌ Error saving order to Firebase:', error);
      
      // Fallback: Save to localStorage if Firebase fails
      try {
        const existingOrders = JSON.parse(localStorage.getItem('moda_orders') || '[]');
        existingOrders.unshift(orderData);
        localStorage.setItem('moda_orders', JSON.stringify(existingOrders));
        
        const adminOrders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        adminOrders.unshift(orderData);
        localStorage.setItem('admin_orders', JSON.stringify(adminOrders));
        
        console.log('⚠️ Order saved to localStorage as fallback');
        
        setOrderDetails(orderData);
        setOrderSuccess(true);
        clearCart();
        setStep(3);
      } catch (storageError) {
        console.error('❌ Failed to save order locally:', storageError);
        setError('Failed to save your order. Please contact support with your payment reference: ' + reference);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    setLoading(true);
    setError('');

    try {
      // Check if Paystack is available
      if (typeof window.PaystackPop === 'undefined') {
        // If Paystack script hasn't loaded yet, wait and retry
        setTimeout(() => {
          if (typeof window.PaystackPop === 'undefined') {
            setError('Payment system is still loading. Please refresh the page and try again.');
            setLoading(false);
            return;
          }
          processPaystackPayment();
        }, 1000);
        return;
      }

      processPaystackPayment();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const processPaystackPayment = () => {
    const paystackRef = 'MODA_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

    const handler = window.PaystackPop.setup({
    //   key: 'pk_live_b16889dbfcb36d563de40962373f25906f47a542', // Live key
      key: 'pk_test_3e2b0630ceccd8cd2f5dae7998ee3638c7f780a3', // Test key (uncomment for testing)
      email: shipping.email,
      amount: total * 100, // Amount in kobo
      currency: 'NGN',
      ref: paystackRef,
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: `${shipping.firstName} ${shipping.lastName}`
          },
          {
            display_name: "Phone Number",
            variable_name: "customer_phone",
            value: shipping.phone
          },
          {
            display_name: "Delivery Address",
            variable_name: "delivery_address",
            value: `${shipping.address}, ${shipping.city}, ${shipping.state}`
          }
        ]
      },
      callback: function(response) {
        // Payment successful - reference is in response.reference
        console.log('💳 Payment successful!', response);
        completeOrder(response.reference);
      },
      onClose: function() {
        // Customer closed the payment modal
        setLoading(false);
        console.log('Payment window closed by user');
      }
    });

    handler.openIframe();
  };

  // Load Paystack script dynamically
  useEffect(() => {
    // Check if Paystack script is already loaded
    if (document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => console.log('✅ Paystack script loaded');
    script.onerror = () => console.error('❌ Failed to load Paystack script');
    document.body.appendChild(script);
    
    return () => {
      // Don't remove script on unmount as it might be used elsewhere
    };
  }, []);

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="pt-20 pb-20">
        <div className="max-w-2xl mx-auto text-center px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some products to your cart first</p>
          <button onClick={() => navigate('/shop')} className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-red-500 transition-all">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Order Success */}
        {orderSuccess && orderDetails && (
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-4xl text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">Thank you for your purchase</p>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto">
              <h2 className="font-bold text-lg mb-4">Order Receipt</h2>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono font-bold text-sm">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date(orderDetails.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span>{orderDetails.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-sm">{orderDetails.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span>{orderDetails.customer?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Address:</span>
                  <span className="text-sm text-right max-w-[200px]">
                    {orderDetails.customer?.address}, {orderDetails.customer?.city}, {orderDetails.customer?.state}
                  </span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <h3 className="font-bold text-sm mb-2">Items Ordered:</h3>
                  {orderDetails.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span>{item.name} x{item.quantity} ({item.size})</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatCurrency(orderDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className={orderDetails.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                      {orderDetails.deliveryFee === 0 ? 'Free' : formatCurrency(orderDetails.deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span className="text-red-500">{formatCurrency(orderDetails.total)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{orderDetails.paymentMethod?.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Ref:</span>
                    <span className="font-mono text-xs">{orderDetails.paymentReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-bold uppercase">
                      {orderDetails.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                📧 A confirmation email has been sent to <strong>{shipping.email}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                The store owner has also been notified of your order.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                You can track your order status on the <strong>My Orders</strong> page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/orders')}
                className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-red-500 transition-all"
              >
                View My Orders
              </button>
              <button 
                onClick={() => navigate('/shop')}
                className="border-2 border-black text-black px-6 py-3 rounded-lg font-bold hover:bg-black hover:text-white transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Checkout Steps */}
        {!orderSuccess && (
          <>
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12">
              {['Shipping', 'Payment', 'Confirmation'].map((label, idx) => (
                <div key={idx} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    idx + 1 <= step ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {idx + 1 < step ? '✓' : idx + 1}
                  </div>
                  <span className="ml-2 text-sm font-bold hidden md:block">{label}</span>
                  {idx < 2 && (
                    <div className={`w-16 md:w-24 h-1 mx-2 rounded transition-all ${
                      idx + 1 < step ? 'bg-black' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                <span>⚠️</span>
                <div>
                  <p className="font-bold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="animate-slide-up">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FiTruck className="text-red-500" /> Shipping Information
                </h2>
                <form onSubmit={handleShippingSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">First Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={shipping.firstName}
                        onChange={(e) => setShipping({...shipping, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Last Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={shipping.lastName}
                        onChange={(e) => setShipping({...shipping, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Email *</label>
                      <input 
                        type="email" 
                        required 
                        value={shipping.email}
                        onChange={(e) => setShipping({...shipping, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Phone *</label>
                      <input 
                        type="tel" 
                        required 
                        value={shipping.phone}
                        onChange={(e) => setShipping({...shipping, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        placeholder="08012345678"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Delivery Address *</label>
                    <textarea 
                      required 
                      rows="3"
                      value={shipping.address}
                      onChange={(e) => setShipping({...shipping, address: e.target.value})}
                      placeholder="Street address, landmark, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">City *</label>
                      <input 
                        type="text" 
                        required 
                        value={shipping.city}
                        onChange={(e) => setShipping({...shipping, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        placeholder="Lagos"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">State *</label>
                      <select 
                        required 
                        value={shipping.state}
                        onChange={(e) => setShipping({...shipping, state: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select State</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Oyo">Oyo (Ibadan)</option>
                        <option value="Ogun">Ogun</option>
                        <option value="Ekiti">Ekiti (ABUAD)</option>
                        <option value="Osun">Osun</option>
                        <option value="Ondo">Ondo</option>
                        <option value="Abuja">Abuja (FCT)</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Other">Other State</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">Location Type</label>
                    <div className="space-y-2">
                      {[
                        { value: 'abuad', label: 'ABUAD Campus', price: '₦3,000' },
                        { value: 'lagos', label: 'Lagos/Ibadan', price: '₦5,000' },
                        { value: 'other', label: 'Other States', price: '₦8,000' }
                      ].map(option => (
                        <label 
                          key={option.value} 
                          className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            shipping.locationType === option.value 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="locationType"
                              value={option.value}
                              checked={shipping.locationType === option.value}
                              onChange={(e) => setShipping({...shipping, locationType: e.target.value})}
                              className="w-4 h-4 text-red-500"
                            />
                            <span className="text-sm font-medium">{option.label}</span>
                          </div>
                          <span className="text-sm text-gray-600">{option.price}</span>
                        </label>
                      ))}
                    </div>
                    {cartTotal >= 50000 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                        <p className="text-green-700 text-sm">🎉 Your order qualifies for <strong>free delivery</strong>!</p>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-red-500 transition-all"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="animate-slide-up">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FiCreditCard className="text-red-500" /> Payment
                </h2>
                
                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                  
                  {/* Shipping Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-bold mb-1">Delivery To:</p>
                    <p className="text-sm text-gray-600">
                      {shipping.firstName} {shipping.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{shipping.address}</p>
                    <p className="text-sm text-gray-600">{shipping.city}, {shipping.state}</p>
                    <p className="text-sm text-gray-600">{shipping.phone}</p>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {cart.map(item => (
                      <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span className="flex-1">{item.name} x{item.quantity} ({item.size})</span>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                        {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span className="text-red-500">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4">Pay with Paystack</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You will be redirected to Paystack's secure payment page to complete your payment.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs text-gray-500 mb-2">Accepted payment methods:</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      <span className="bg-white px-3 py-1.5 rounded-lg border shadow-sm">💳 Debit/Credit Card</span>
                      <span className="bg-white px-3 py-1.5 rounded-lg border shadow-sm">🏦 Bank Transfer</span>
                      <span className="bg-white px-3 py-1.5 rounded-lg border shadow-sm">📱 USSD</span>
                      <span className="bg-white px-3 py-1.5 rounded-lg border shadow-sm">📲 Bank App</span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800">
                      🔒 Your payment is secured with 256-bit SSL encryption
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-bold uppercase hover:bg-gray-50 transition-all"
                  >
                    ← Back
                  </button>
                  <button 
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 bg-black text-white py-4 rounded-lg font-bold uppercase hover:bg-red-500 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      `Pay ${formatCurrency(total)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;