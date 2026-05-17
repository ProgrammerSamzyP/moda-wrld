import { PAYSTACK_CONFIG } from '../utils/constants';

export const initializePaystackPayment = ({
  email,
  amount,
  reference,
  metadata,
  onSuccess,
  onClose
}) => {
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_CONFIG.publicKey,
    email,
    amount: amount * 100, // Convert to kobo
    currency: 'NGN',
    ref: reference,
    metadata,
    callback: (response) => {
      if (onSuccess) onSuccess(response);
    },
    onClose: () => {
      if (onClose) onClose();
    }
  });
  
  handler.openIframe();
};

export const verifyPayment = async (reference) => {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_CONFIG.publicKey}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw error;
  }
};