import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../utils/constants';

export const sendOrderEmails = async (orderData) => {
  const itemsList = orderData.items
    .map(item => 
      `${item.name} x${item.quantity} ${item.size ? `(Size: ${item.size})` : ''} - ₦${(item.price * item.quantity).toLocaleString()}`
    )
    .join('\n');

  const emailData = {
    order_id: orderData.orderId,
    customer_name: orderData.customer.fullName,
    customer_email: orderData.customer.email,
    customer_phone: orderData.customer.phone,
    address: `${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.state}`,
    items: itemsList,
    subtotal: `₦${orderData.subtotal.toLocaleString()}`,
    delivery_fee: orderData.deliveryFee === 0 ? 'Free' : `₦${orderData.deliveryFee.toLocaleString()}`,
    total: `₦${orderData.total.toLocaleString()}`,
    payment_method: orderData.paymentMethod,
    order_date: new Date().toLocaleString(),
    image_links: orderData.items.map(item => item.image).join(', '),
    map_coordinates: orderData.customer.mapLat && orderData.customer.mapLng
      ? `https://www.openstreetmap.org/?mlat=${orderData.customer.mapLat}&mlon=${orderData.customer.mapLng}`
      : 'Not provided'
  };

  try {
    // Send email to store owner
    await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.ownerTemplateId,
      emailData,
      EMAIL_CONFIG.publicKey
    );

    // Send confirmation email to customer
    await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.customerTemplateId,
      emailData,
      EMAIL_CONFIG.publicKey
    );

    return true;
  } catch (error) {
    console.error('Failed to send emails:', error);
    return false;
  }
};