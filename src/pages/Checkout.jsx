import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheck,
  FiAlertCircle,
  FiArrowLeft,
  FiShoppingBag,
  FiLock,
  FiMapPin,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { saveOrder } from '../services/firebase';
import { formatCurrency, generateOrderId } from '../utils/helpers';
import { PRODUCTS } from '../utils/constants';
import { sendOrderEmails } from '../services/email';

// ---------- Design tokens (LITGANG-inspired: black / white / pink) ----------
const PINK = 'bg-[#FF4F9A]';
const heading = 'font-black uppercase tracking-tight';
const label = 'block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2';
const inputClass = (err) =>
  `w-full bg-white border px-4 py-3.5 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-black ${
    err ? 'border-red-600' : 'border-gray-300'
  }`;

// Defined outside Checkout so inputs don't remount (and lose focus) on each keystroke
const Field = ({ name, children, error }) => (
  <div>
    <label className={label}>{name}</label>
    {children}
    {error && <p className="text-red-600 text-xs mt-1.5 font-medium">{error}</p>}
  </div>
);

// Complete list of Nigerian states
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe',
  'Zamfara', 'Abuja (FCT)', 'Other',
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
    const product = PRODUCTS.find((p) => p.id === item.id);
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

  const set = (key) => (e) => setShipping({ ...shipping, [key]: e.target.value });

  // ---------- RENDER ----------
  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-white">
        <div className="text-center px-4 max-w-md">
          <h1 className={`${heading} text-4xl text-black mb-3`}>Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Nothing here yet. Check out the current drop.</p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#FF4F9A] hover:text-black transition-colors"
          >
            <FiShoppingBag /> Shop Now
          </button>
        </div>
      </div>
    );
  }

  // ---------- SUCCESS ----------
  if (orderSuccess && orderDetails) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-black text-white p-8 sm:p-10 mb-0">
            <div className={`w-12 h-12 ${PINK} flex items-center justify-center mb-6`}>
              <FiCheck className="text-2xl text-black" />
            </div>
            <h1 className={`${heading} text-4xl sm:text-5xl leading-none`}>You're in the Geng.</h1>
            <p className="text-gray-400 mt-4">
              Payment received. A confirmation is on its way to {orderDetails.customerEmail}.
            </p>
          </div>

          <div className="border border-black border-t-0 p-6 sm:p-8 text-sm">
            <h2 className={`${heading} text-lg mb-5`}>Order receipt</h2>

            <dl className="space-y-3">
              {[
                ['Order ID', orderDetails.orderId],
                ['Date', new Date(orderDetails.date).toLocaleDateString()],
                ['Customer', orderDetails.customerName],
                ['Email', orderDetails.customerEmail],
                ['Phone', orderDetails.customer?.phone],
                ['Delivery to', `${orderDetails.customer?.address}, ${orderDetails.customer?.city}, ${orderDetails.customer?.state}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="font-semibold text-black text-right break-all sm:break-normal max-w-[260px]">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-gray-200 pt-5 mt-6">
              <h3 className="font-bold uppercase tracking-widest text-[11px] text-gray-500 mb-3">
                Items ({orderDetails.items?.length})
              </h3>
              {orderDetails.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1.5">
                  <span className="text-gray-700">
                    {item.name} × {item.quantity}
                    {item.size ? ` (${item.size})` : ''}
                  </span>
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-5 mt-5 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCurrency(orderDetails.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="font-semibold">
                  {orderDetails.deliveryFee === 0 ? 'Free' : formatCurrency(orderDetails.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-black pt-3 border-t border-black">
                <span className="uppercase">Total</span>
                <span>{formatCurrency(orderDetails.total)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-5 mt-6 text-xs text-gray-500 space-y-1.5">
              <p>Payment method: {orderDetails.paymentMethod?.toUpperCase()}</p>
              <p className="break-all">Payment ref: {orderDetails.paymentReference}</p>
              <p className="flex items-center gap-2">
                Status:
                <span className={`${PINK} text-black px-2 py-0.5 font-bold uppercase tracking-widest`}>
                  {orderDetails.status}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 bg-black text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#FF4F9A] hover:text-black transition-colors"
            >
              View my orders
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="flex-1 border border-black text-black py-4 font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors"
            >
              Keep shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- CHECKOUT ----------
  const steps = ['Shipping', 'Payment', 'Confirmation'];
  const zones = [
    { value: 'abuad', label: 'ABUAD Campus', price: '₦3,000' },
    { value: 'lagos', label: 'Lagos / Ibadan', price: '₦5,000' },
    { value: 'other', label: 'Other States', price: '₦8,000' },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + steps */}
        <div className="mb-10">
          <h1 className={`${heading} text-4xl md:text-5xl text-black`}>Checkout</h1>
          <ol className="flex items-center gap-2 sm:gap-4 mt-6 text-xs font-bold uppercase tracking-widest">
            {steps.map((s, idx) => {
              const n = idx + 1;
              const done = n < step;
              const active = n === step;
              return (
                <li key={s} className="flex items-center gap-2 sm:gap-4">
                  <span
                    className={`w-7 h-7 flex items-center justify-center text-[11px] ${
                      done ? `${PINK} text-black` : active ? 'bg-black text-white' : 'border border-gray-300 text-gray-400'
                    }`}
                  >
                    {done ? <FiCheck /> : n}
                  </span>
                  <span className={`hidden sm:block ${active ? 'text-black' : 'text-gray-400'}`}>{s}</span>
                  {idx < 2 && <span className={`w-6 sm:w-12 h-px ${done ? 'bg-black' : 'bg-gray-300'}`} />}
                </li>
              );
            })}
          </ol>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-600 bg-red-50 flex items-start gap-3 text-red-700">
            <FiAlertCircle className="text-lg mt-0.5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* LEFT: steps */}
          <div className="lg:col-span-3">
            {step === 1 && (
              <form onSubmit={handleShippingSubmit} noValidate>
                <h2 className={`${heading} text-2xl mb-6`}>Shipping details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <Field name="First name" error={fieldErrors.firstName}>
                    <input type="text" value={shipping.firstName} onChange={set('firstName')} placeholder="John" className={inputClass(fieldErrors.firstName)} />
                  </Field>
                  <Field name="Last name" error={fieldErrors.lastName}>
                    <input type="text" value={shipping.lastName} onChange={set('lastName')} placeholder="Doe" className={inputClass(fieldErrors.lastName)} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <Field name="Email" error={fieldErrors.email}>
                    <input type="email" value={shipping.email} onChange={set('email')} placeholder="you@example.com" className={inputClass(fieldErrors.email)} />
                  </Field>
                  <Field name="Phone" error={fieldErrors.phone}>
                    <input type="tel" value={shipping.phone} onChange={set('phone')} placeholder="08012345678" className={inputClass(fieldErrors.phone)} />
                  </Field>
                </div>

                <div className="mb-5">
                  <Field name="Delivery address" error={fieldErrors.address}>
                    <textarea
                      rows={3}
                      value={shipping.address}
                      onChange={set('address')}
                      placeholder="House number, street name, landmark"
                      className={`${inputClass(fieldErrors.address)} resize-none`}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                  <Field name="City" error={fieldErrors.city}>
                    <input type="text" value={shipping.city} onChange={set('city')} placeholder="Ikeja" className={inputClass(fieldErrors.city)} />
                  </Field>
                  <Field name="State" error={fieldErrors.state}>
                    <select value={shipping.state} onChange={set('state')} className={inputClass(fieldErrors.state)}>
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mb-8">
                  <span className={label}>Delivery zone</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {zones.map((opt) => {
                      const selected = shipping.locationType === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className={`cursor-pointer p-4 border transition-colors ${
                            selected ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'
                          }`}
                        >
                          <input
                            type="radio"
                            name="locationType"
                            value={opt.value}
                            checked={selected}
                            onChange={set('locationType')}
                            className="sr-only"
                          />
                          <span className="block text-sm font-bold">{opt.label}</span>
                          <span className={`block text-xs mt-1 ${selected ? 'text-[#FF4F9A]' : 'text-gray-500'}`}>{opt.price}</span>
                        </label>
                      );
                    })}
                  </div>
                  {subtotalOriginal >= 50000 && (
                    <p className={`mt-3 ${PINK} text-black text-sm font-bold px-4 py-3`}>
                      Free delivery unlocked on this order.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#FF4F9A] hover:text-black transition-colors"
                >
                  Continue to payment
                </button>
              </form>
            )}

            {step === 2 && (
              <div>
                <h2 className={`${heading} text-2xl mb-6`}>Payment</h2>

                <div className="border border-gray-300 p-5 mb-6 flex items-start gap-3">
                  <FiMapPin className="text-gray-400 mt-0.5 shrink-0" />
                  <div className="text-sm flex-1">
                    <p className="font-bold text-black">{shipping.firstName} {shipping.lastName}</p>
                    <p className="text-gray-600">{shipping.address}</p>
                    <p className="text-gray-600">{shipping.city}, {shipping.state}</p>
                    <p className="text-gray-500">{shipping.phone} · {shipping.email}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:text-[#FF4F9A]"
                  >
                    Edit
                  </button>
                </div>

                <div className="border border-black p-5 mb-8">
                  <h3 className="font-black uppercase tracking-tight text-lg mb-1">Pay with Paystack</h3>
                  <p className="text-gray-600 text-sm mb-4">Card, bank transfer, USSD or bank app.</p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <FiLock /> Payments are encrypted and processed by Paystack.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-2 px-6 py-4 border border-black text-black font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors"
                  >
                    <FiArrowLeft /> Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 bg-black text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#FF4F9A] hover:text-black transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing
                      </>
                    ) : (
                      `Pay ${formatCurrency(total)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: persistent order summary */}
          <aside className="lg:col-span-2">
            <div className="bg-black text-white p-6 sm:p-8 lg:sticky lg:top-28">
              <h2 className={`${heading} text-xl mb-6`}>Your order</h2>

              <ul className="space-y-5 mb-6">
                {cart.map((item) => {
                  const product = PRODUCTS.find((p) => p.id === item.id);
                  const price = product?.originalPrice || item.price;
                  return (
                    <li key={`${item.id}-${item.size}`} className="flex gap-4">
                      <div className="relative w-16 h-20 bg-neutral-800 shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                        <span className={`absolute -top-2 -right-2 ${PINK} text-black text-[11px] font-black w-5 h-5 flex items-center justify-center`}>
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 text-sm">
                        <p className="font-bold truncate">{item.name}</p>
                        {item.size && <p className="text-xs text-gray-400 mt-0.5">Size {item.size}</p>}
                      </div>
                      <span className="text-sm font-semibold">{formatCurrency(price * item.quantity)}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-neutral-700 pt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>{formatCurrency(subtotalOriginal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-[#FF4F9A] font-bold' : ''}>
                    {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-black pt-4 mt-2 border-t border-neutral-700">
                  <span className="uppercase">Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;