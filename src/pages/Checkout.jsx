import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCreditCard,
  FiTruck,
  FiCheck,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAlertCircle,
  FiArrowLeft,
  FiShoppingBag,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { saveOrder } from '../services/firebase';
import { formatCurrency, generateOrderId } from '../utils/helpers';
import { PRODUCTS } from '../utils/constants';
import { sendOrderEmails } from '../services/email'; // ← external email function

// Complete list of Nigerian states
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe',
  'Zamfara', 'Abuja (FCT)', 'Other'
];

const DELIVERY_FEES = {
  abuad: 3000,
  lagos: 5000,
  other: 8000,
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    locationType: 'other',
  });

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const paystackLoadedRef = useRef(false);

  // Calculate subtotal using original prices
  const subtotalOriginal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    const price = product?.originalPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const calculateDeliveryFee = () => {
    if (subtotalOriginal >= 50000) return 0;
    if (shipping.locationType === 'abuad' || shipping.state === 'Ekiti') return DELIVERY_FEES.abuad;
    if (shipping.locationType === 'lagos' || shipping.state === 'Lagos' || shipping.state === 'Oyo') return DELIVERY_FEES.lagos;
    return DELIVERY_FEES.other;
  };

  const deliveryFee = calculateDeliveryFee();
  const total = subtotalOriginal + deliveryFee;

  // Validation
  const validateShipping = () => {
    const errors = {};
    if (!shipping.firstName.trim()) errors.firstName = 'First name is required';
    if (!shipping.lastName.trim()) errors.lastName = 'Last name is required';
    if (!shipping.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) errors.email = 'Invalid email address';
    if (!shipping.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^0\d{10}$/.test(shipping.phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid Nigerian phone (08012345678)';
    if (!shipping.address.trim()) errors.address = 'Address is required';
    if (!shipping.city.trim()) errors.city = 'City is required';
    if (!shipping.state.trim()) errors.state = 'Please select a state';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!validateShipping()) return;
    setError('');
    setStep(2);
  };

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
        locationType: shipping.locationType,
      },
      customerName: `${shipping.firstName} ${shipping.lastName}`,
      customerEmail: shipping.email,
      items: cart.map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.id);
        const price = product?.originalPrice || item.price;
        return {
          id: item.id,
          name: item.name,
          price,
          quantity: item.quantity,
          size: item.size,
          image: item.image,
        };
      }),
      subtotal: subtotalOriginal,
      deliveryFee,
      total,
      paymentMethod: 'paystack',
      paymentReference: reference,
      status: 'pending',
      date: new Date().toISOString(),
      userId: user?.uid || null,
      userEmail: user?.email || shipping.email,
    };

    try {
      const docId = await saveOrder(orderData);
      setOrderDetails({ ...orderData, firebaseId: docId });
      setOrderSuccess(true);
      clearCart();
      setStep(3);

      // Send emails using the external function
      sendOrderEmails({ ...orderData, firebaseId: docId });

    } catch (err) {
      console.error('❌ Error saving order:', err);
      try {
        // Fallback to localStorage
        const existingOrders = JSON.parse(localStorage.getItem('moda_orders') || '[]');
        existingOrders.unshift(orderData);
        localStorage.setItem('moda_orders', JSON.stringify(existingOrders));
        const adminOrders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        adminOrders.unshift(orderData);
        localStorage.setItem('admin_orders', JSON.stringify(adminOrders));
        setOrderDetails(orderData);
        setOrderSuccess(true);
        clearCart();
        setStep(3);

        // Send emails even when falling back to localStorage
        sendOrderEmails(orderData);

      } catch (storageError) {
        setError('Failed to save order. Contact support with reference: ' + reference);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    setLoading(true);
    setError('');

    const processPaystackPayment = () => {
      const paystackRef = 'MODA_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      const handler = window.PaystackPop.setup({
        key: 'pk_live_b16889dbfcb36d563de40962373f25906f47a542', // Live key
        email: shipping.email,
        amount: total * 100,
        currency: 'NGN',
        ref: paystackRef,
        metadata: {
          custom_fields: [
            { display_name: 'Customer Name', variable_name: 'customer_name', value: `${shipping.firstName} ${shipping.lastName}` },
            { display_name: 'Phone Number', variable_name: 'customer_phone', value: shipping.phone },
            { display_name: 'Delivery Address', variable_name: 'delivery_address', value: `${shipping.address}, ${shipping.city}, ${shipping.state}` },
          ],
        },
        callback: (response) => completeOrder(response.reference),
        onClose: () => setLoading(false),
      });
      handler.openIframe();
    };

    if (typeof window.PaystackPop === 'undefined') {
      setTimeout(() => {
        if (typeof window.PaystackPop === 'undefined') {
          setError('Payment system loading. Please refresh the page.');
          setLoading(false);
          return;
        }
        processPaystackPayment();
      }, 1000);
    } else {
      processPaystackPayment();
    }
  };

  // Load Paystack script only once
  useEffect(() => {
    if (paystackLoadedRef.current) return;
    if (document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
      paystackLoadedRef.current = true;
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => { paystackLoadedRef.current = true; };
    document.body.appendChild(script);
    return () => {};
  }, []);

  // ---------- RENDER ----------
  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="text-7xl mb-5">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some items to get started</p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md"
          >
            <FiShoppingBag /> Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {orderSuccess && orderDetails ? (
          /* SUCCESS PAGE */
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-5xl text-emerald-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-10">Your order has been placed successfully.</p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8 text-left max-w-lg mx-auto">
              <h2 className="font-bold text-lg mb-5 text-gray-900">Order Receipt</h2>
              <div className="space-y-3 text-sm">
                {[
                  ['Order ID', orderDetails.orderId],
                  ['Date', new Date(orderDetails.date).toLocaleDateString()],
                  ['Customer', orderDetails.customerName],
                  ['Email', orderDetails.customerEmail],
                  ['Phone', orderDetails.customer?.phone],
                  ['Delivery Address', `${orderDetails.customer?.address}, ${orderDetails.customer?.city}, ${orderDetails.customer?.state}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900 text-right max-w-[220px]">{value}</span>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-2">Items ({orderDetails.items?.length})</h3>
                  {orderDetails.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1">
                      <span className="text-gray-600">{item.name} x{item.quantity} ({item.size})</span>
                      <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatCurrency(orderDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery</span>
                    <span className={orderDetails.deliveryFee === 0 ? 'text-emerald-600 font-medium' : ''}>
                      {orderDetails.deliveryFee === 0 ? 'Free' : formatCurrency(orderDetails.deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-red-500">{formatCurrency(orderDetails.total)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4 text-xs text-gray-500 space-y-1">
                  <p>Payment Method: {orderDetails.paymentMethod?.toUpperCase()}</p>
                  <p>Payment Ref: {orderDetails.paymentReference}</p>
                  <div className="flex items-center gap-2">
                    Status:
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold uppercase tracking-wide">
                      {orderDetails.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button onClick={() => navigate('/orders')} className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all">
                View My Orders
              </button>
              <button onClick={() => navigate('/shop')} className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:border-gray-400 transition-all">
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-10">
              {['Shipping', 'Payment', 'Confirmation'].map((label, idx) => (
                <div key={idx} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      idx + 1 <= step ? 'bg-black text-white shadow-md' : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    {idx + 1 < step ? <FiCheck className="text-lg" /> : idx + 1}
                  </div>
                  <span className="ml-3 text-sm font-semibold text-gray-700 hidden sm:block">{label}</span>
                  {idx < 2 && (
                    <div className={`w-12 sm:w-16 h-1 mx-2 rounded-full transition-all ${idx + 1 < step ? 'bg-black' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                <FiAlertCircle className="text-lg mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* STEP 1: Shipping */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <FiTruck className="text-2xl text-red-500" />
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Shipping Details</h2>
                </div>

                <form onSubmit={handleShippingSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name *</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={shipping.firstName}
                          onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                          placeholder="John"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${fieldErrors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                      </div>
                      {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
                    </div>
                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name *</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={shipping.lastName}
                          onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                          placeholder="Doe"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${fieldErrors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                      </div>
                      {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={shipping.email}
                          onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                          placeholder="you@example.com"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                      </div>
                      {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                    </div>
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={shipping.phone}
                          onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                          placeholder="08012345678"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${fieldErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                      </div>
                      {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Address *</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-4 text-gray-400" />
                      <textarea
                        rows={3}
                        value={shipping.address}
                        onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                        placeholder="House number, street name, landmark..."
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none ${fieldErrors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                    </div>
                    {fieldErrors.address && <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                    {/* City */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                      <input
                        type="text"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        placeholder="Ikeja"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${fieldErrors.city ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {fieldErrors.city && <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>}
                    </div>
                    {/* State - improved dropdown */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">State *</label>
                      <select
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-white ${fieldErrors.state ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      >
                        <option value="">Select State</option>
                        {NIGERIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.state && <p className="text-red-500 text-xs mt-1">{fieldErrors.state}</p>}
                    </div>
                  </div>

                  {/* Location Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Delivery Zone</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: 'abuad', label: 'ABUAD Campus', price: '₦3,000' },
                        { value: 'lagos', label: 'Lagos / Ibadan', price: '₦5,000' },
                        { value: 'other', label: 'Other States', price: '₦8,000' },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            shipping.locationType === opt.value
                              ? 'border-red-500 bg-red-50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="locationType"
                              value={opt.value}
                              checked={shipping.locationType === opt.value}
                              onChange={(e) => setShipping({ ...shipping, locationType: e.target.value })}
                              className="w-4 h-4 text-red-500"
                            />
                            <span className="text-sm font-medium">{opt.label}</span>
                          </div>
                          <span className="text-xs text-gray-500">{opt.price}</span>
                        </label>
                      ))}
                    </div>
                    {subtotalOriginal >= 50000 && (
                      <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-emerald-700 text-sm">
                        <span>🎉</span> Your order qualifies for <strong className="ml-1">free delivery</strong>!
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <FiCreditCard className="text-2xl text-red-500" />
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Payment</h2>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FiShoppingBag className="text-gray-600" /> Order Summary
                  </h3>

                  <div className="bg-gray-50 rounded-xl p-4 mb-5">
                    <div className="flex items-start gap-3">
                      <FiMapPin className="text-gray-400 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{shipping.firstName} {shipping.lastName}</p>
                        <p className="text-gray-600">{shipping.address}</p>
                        <p className="text-gray-600">{shipping.city}, {shipping.state}</p>
                        <p className="text-gray-500">{shipping.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    {cart.map((item) => {
                      const product = PRODUCTS.find(p => p.id === item.id);
                      const price = product?.originalPrice || item.price;
                      return (
                        <div key={`${item.id}-${item.size}`} className="flex justify-between items-center text-sm py-2 border-b border-gray-100">
                          <div className="flex-1 pr-4">
                            <p className="font-medium text-gray-900">{item.name} <span className="text-gray-500">×{item.quantity}</span></p>
                            {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                          </div>
                          <span className="font-semibold">{formatCurrency(price * item.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotalOriginal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery</span>
                      <span className={deliveryFee === 0 ? 'text-emerald-600 font-medium' : 'font-medium'}>
                        {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-red-500">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Paystack Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h3 className="font-bold text-lg mb-2">Pay with Paystack</h3>
                  <p className="text-gray-500 text-sm mb-4">Secure payment via card, bank transfer, USSD, or bank app.</p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 flex items-center gap-2">
                    🔒 Your payment is protected by 256-bit SSL encryption.
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold uppercase hover:bg-gray-50 transition-all"
                  >
                    <FiArrowLeft /> Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 bg-black text-white py-4 rounded-xl font-bold uppercase hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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