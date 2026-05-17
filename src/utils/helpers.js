export const formatCurrency = (amount) => {
  return `₦${amount.toLocaleString()}`;
};

export const calculateDiscount = (price, originalPrice) => {
  if (!originalPrice) return 0;
  return Math.round((1 - price / originalPrice) * 100);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generateOrderId = () => {
  return `MODA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};