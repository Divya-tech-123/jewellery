import api from './api';

// Dynamically load Razorpay standard checkout script into DOM
export const loadRazorpaySDK = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.warn('Failed to load Razorpay SDK from CDN. Fallback simulation active.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Get public Razorpay key ID from backend
export const getRazorpayKey = async () => {
  const res = await api.get('/payment/key');
  return res.data;
};

// Create Razorpay Order on backend
export const createRazorpayOrder = async (amount, receipt = '', notes = {}) => {
  const res = await api.post('/payment/create-order', {
    amount,
    receipt,
    notes,
  });
  return res.data;
};

// Verify payment signature on backend and record confirmed order
export const verifyPayment = async (paymentVerificationData) => {
  const res = await api.post('/payment/verify', paymentVerificationData);
  return res.data;
};
