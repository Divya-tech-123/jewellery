import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, AlertCircle, RefreshCw, CheckCircle2, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loadRazorpaySDK, getRazorpayKey, createRazorpayOrder, verifyPayment } from '../services/paymentService';
import OptimizedImage from '../components/OptimizedImage';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 
  'Kerala', 'Delhi', 'Gujarat', 'Rajasthan', 'West Bengal', 'Uttar Pradesh', 
  'Haryana', 'Punjab', 'Madhya Pradesh', 'Goa', 'Odisha', 'Bihar', 'Assam',
  'Jammu & Kashmir', 'Uttarakhand', 'Himachal Pradesh', 'Jharkhand', 'Chhattisgarh'
];

const Checkout = () => {
  const { cartItems, subtotal, shippingFee, discountAmount, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast() || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    landmark: '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || 'Telangana',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: 'India',
  });

  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    loadRazorpaySDK().then((ready) => {
      setSdkReady(ready);
    });
  }, []);

  // If cart is empty and user not redirected yet
  if (cartItems.length === 0) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center bg-lumiere-bg px-4">
        <div className="w-16 h-16 rounded-full bg-white border border-lumiere-border flex items-center justify-center mx-auto mb-4 text-lumiere-gold">
          <ShieldCheck size={28} />
        </div>
        <h2 className="font-serif text-3xl mb-2 text-lumiere-text">Your bag is currently empty</h2>
        <p className="text-xs text-lumiere-muted mb-6">Add jewellery pieces to proceed with checkout.</p>
        <Link to="/shop" className="btn-primary-indian text-xs py-3 px-6">
          BROWSE CATALOGUE →
        </Link>
      </div>
    );
  }

  // Field Validation
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Please enter a valid full name';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required for certificate and receipt';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    const cleanPhone = formData.phone.replace(/[\s\-+]/g, '');
    if (!cleanPhone) {
      errors.phone = 'Mobile number is required for OTP courier delivery';
    } else if (cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.street.trim()) {
      errors.street = 'Street address, house / apartment number is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City / Town is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State selection is required';
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = '6-Digit Postal PIN Code is required';
    } else if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      errors.postalCode = 'PIN code must be exactly 6 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Order Submission & Razorpay Payment
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');

    if (!validateForm()) {
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Required Details Missing',
          message: 'Please complete all highlighted delivery and contact fields.',
        });
      }
      return;
    }

    setLoading(true);

    const orderPayload = {
      user: user?._id || user?.id || null,
      guestEmail: formData.email,
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        purity: item.purity,
        size: item.size,
        image: item.image,
      })),
      shippingAddress: {
        fullName: formData.fullName,
        street: formData.street,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country || 'India',
        phone: formData.phone,
      },
      subtotal,
      discountAmount,
      couponCode: appliedCoupon?.code || '',
      shippingFee,
      tax: 0,
      total,
      paymentMethod: 'Razorpay (UPI / Card / NetBanking)',
    };

    try {
      // 1. Create order on backend
      const orderRes = await createRazorpayOrder(total, `rcpt_${Date.now()}`, {
        customer_name: formData.fullName,
        customer_email: formData.email,
      });

      if (!orderRes || !orderRes.success) {
        throw new Error(orderRes?.message || 'Unable to initiate payment transaction.');
      }

      const { orderId, amount, currency, keyId, isLiveGateway } = orderRes;

      // 2. Open Razorpay Checkout Modal
      if (window.Razorpay && isLiveGateway) {
        const options = {
          key: keyId,
          amount: amount,
          currency: currency || 'INR',
          name: 'LUMIÈRE ATELIER',
          description: 'Timeless Luxury Jewellery Acquisition',
          image: '/assets/category_necklace.webp',
          order_id: orderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            brand: 'LUMIÈRE Luxury Jewellery',
            shipping_city: formData.city,
          },
          theme: {
            color: '#2D2823',
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setPaymentError('Payment window was dismissed. Your cart contents remain saved.');
              if (showToast) {
                showToast({
                  type: 'info',
                  title: 'Payment Dismissed',
                  message: 'Transaction was cancelled. You can review details and try again anytime.',
                });
              }
            },
          },
          handler: async function (response) {
            try {
              // 3. Backend Verification
              const verifyRes = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderPayload,
              });

              if (verifyRes.success && verifyRes.order) {
                clearCart();
                if (showToast) {
                  showToast({
                    type: 'success',
                    title: 'Payment Confirmed',
                    message: `Thank you, ${formData.fullName}. Your acquisition has been recorded.`,
                  });
                }
                const confirmedId = verifyRes.order.orderNumber || verifyRes.order._id;
                navigate(`/order-confirmation/${confirmedId}`, { state: { order: verifyRes.order } });
              } else {
                throw new Error(verifyRes.message || 'Signature verification failed.');
              }
            } catch (vErr) {
              setLoading(false);
              setPaymentError(vErr.message || 'Payment verification failed. Please contact atelier support.');
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setLoading(false);
          const reason = response.error?.description || 'Transaction failed or was rejected by bank.';
          setPaymentError(`Payment Failed: ${reason}`);
          if (showToast) {
            showToast({
              type: 'error',
              title: 'Payment Failed',
              message: reason,
            });
          }
        });

        rzp.open();
      } else {
        // Fallback / Sandbox direct verification flow
        console.log('[LUMIÈRE CHECKOUT] Executing verified sandbox test transaction.');
        const simPaymentId = `pay_test_${Date.now()}`;
        const verifyRes = await verifyPayment({
          razorpay_order_id: orderId,
          razorpay_payment_id: simPaymentId,
          razorpay_signature: 'verified_signature',
          orderData: orderPayload,
          isSimulated: true,
        });

        if (verifyRes.success && verifyRes.order) {
          clearCart();
          if (showToast) {
            showToast({
              type: 'success',
              title: 'Payment Verified',
              message: `Your luxury acquisition has been secured.`,
            });
          }
          const confirmedId = verifyRes.order.orderNumber || verifyRes.order._id;
          navigate(`/order-confirmation/${confirmedId}`, { state: { order: verifyRes.order } });
        } else {
          throw new Error(verifyRes.message || 'Transaction could not be verified.');
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setLoading(false);
      setPaymentError(err.message || 'Unable to complete order. Please check your network connection and retry.');
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-lumiere-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-lumiere-gold block mb-1">
            CONFIDENTIAL ATELIER CHECKOUT
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-text font-normal">
            Secure Delivery & Payment
          </h1>
          <div className="w-12 h-0.5 bg-lumiere-gold mx-auto mt-3" />
        </div>

        {/* Payment Error Notice */}
        {paymentError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-xs max-w-3xl mx-auto">
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">Payment Notice:</span>
              <p className="leading-relaxed">{paymentError}</p>
            </div>
            <button
              type="button"
              onClick={() => setPaymentError('')}
              className="text-red-700 font-bold uppercase text-[10px] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* ===================================================================
              Left Column: Delivery Information & Payment (col 7)
              =================================================================== */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Contact Details */}
            <div className="bg-white p-6 sm:p-8 border border-lumiere-border shadow-sm">
              <h2 className="font-serif text-xl font-normal text-lumiere-text pb-3 border-b border-lumiere-border mb-5 flex items-center justify-between">
                <span>1. Contact & Recipient Details</span>
                <span className="text-[10px] uppercase tracking-wider text-lumiere-muted font-sans">
                  Step 1 of 2
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-lumiere-text block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Priya Sharma"
                    className={`w-full bg-[#FAF7F2] border ${formErrors.fullName ? 'border-red-500' : 'border-lumiere-border'} p-3 text-xs outline-none focus:border-lumiere-gold`}
                  />
                  {formErrors.fullName && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-lumiere-text block mb-1">
                    Mobile Number (for Courier OTP) *
                  </label>
                  <div className="flex">
                    <span className="bg-lumiere-secondary px-3 py-3 text-xs border border-r-0 border-lumiere-border text-lumiere-text font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="98490 12345"
                      maxLength={12}
                      className={`w-full bg-[#FAF7F2] border ${formErrors.phone ? 'border-red-500' : 'border-lumiere-border'} p-3 text-xs outline-none focus:border-lumiere-gold`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-lumiere-text block mb-1">
                  Email Address (for Digital Certificate & Invoice) *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="priya.sharma@example.com"
                  className={`w-full bg-[#FAF7F2] border ${formErrors.email ? 'border-red-500' : 'border-lumiere-border'} p-3 text-xs outline-none focus:border-lumiere-gold`}
                />
                {formErrors.email && (
                  <p className="text-[10px] text-red-600 mt-1">{formErrors.email}</p>
                )}
                <span className="text-[10px] text-lumiere-muted mt-1 block">
                  All insurance coverage documents and BIS hallmark HUID slips will be sent to this email.
                </span>
              </div>
            </div>

            {/* 2. Insured Courier Shipping Address */}
            <div className="bg-white p-6 sm:p-8 border border-lumiere-border shadow-sm">
              <h2 className="font-serif text-xl font-normal text-lumiere-text pb-3 border-b border-lumiere-border mb-5 flex items-center justify-between">
                <span>2. Insured Courier Delivery Address</span>
                <span className="text-[10px] uppercase tracking-wider text-lumiere-muted font-sans">
                  India Wide
                </span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-lumiere-text block mb-1">
                    Street Address / Flat / Villa / Apartment *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="House No, Building Name, Street / Road Name"
                    className={`w-full bg-[#FAF7F2] border ${formErrors.street ? 'border-red-500' : 'border-lumiere-border'} p-3 text-xs outline-none focus:border-lumiere-gold`}
                  />
                  {formErrors.street && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.street}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-lumiere-text block mb-1">
                    Landmark / Locality (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Near City Center / Opposite Temple"
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs outline-none focus:border-lumiere-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-lumiere-text block mb-1">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Hyderabad"
                      className={`w-full bg-[#FAF7F2] border ${formErrors.city ? 'border-red-500' : 'border-lumiere-border'} p-3 text-xs outline-none focus:border-lumiere-gold`}
                    />
                    {formErrors.city && (
                      <p className="text-[10px] text-red-600 mt-1">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-lumiere-text block mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full bg-[#FAF7F2] border ${formErrors.state ? 'border-red-500' : 'border-lumiere-border'} p-3 text-xs outline-none focus:border-lumiere-gold cursor-pointer`}
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {formErrors.state && (
                      <p className="text-[10px] text-red-600 mt-1">{formErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-lumiere-text block mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="500034"
                      maxLength={6}
                      className={`w-full bg-[#FAF7F2] border ${formErrors.postalCode ? 'border-red-500' : 'border-lumiere-border'} p-3 text-xs outline-none focus:border-lumiere-gold`}
                    />
                    {formErrors.postalCode && (
                      <p className="text-[10px] text-red-600 mt-1">{formErrors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Gateway Mode Selection */}
            <div className="bg-white p-6 sm:p-8 border border-lumiere-border shadow-sm">
              <h2 className="font-serif text-xl font-normal text-lumiere-text pb-3 border-b border-lumiere-border mb-4 flex items-center justify-between">
                <span>3. Payment Gateway</span>
                <span className="text-emerald-800 text-[10px] font-bold uppercase flex items-center gap-1">
                  <ShieldCheck size={14} /> 256-Bit Encrypted
                </span>
              </h2>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border border-lumiere-gold bg-[#FAF7F2] cursor-pointer">
                  <input
                    type="radio"
                    name="paymentGateway"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="accent-lumiere-gold mt-1"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-lumiere-text uppercase tracking-wider block">
                      Razorpay Online Payment (UPI / Cards / NetBanking)
                    </span>
                    <span className="text-[11px] text-lumiere-muted block mt-0.5">
                      Supports Google Pay, PhonePe, Paytm, BHIM UPI, Visa, Mastercard, RuPay, and Indian NetBanking.
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] bg-white border border-lumiere-border px-2 py-0.5 font-bold uppercase text-lumiere-text">
                        UPI Instant
                      </span>
                      <span className="text-[9px] bg-white border border-lumiere-border px-2 py-0.5 font-bold uppercase text-lumiere-text">
                        Credit / Debit Card
                      </span>
                      <span className="text-[9px] bg-white border border-lumiere-border px-2 py-0.5 font-bold uppercase text-lumiere-text">
                        NetBanking
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* ===================================================================
              Right Column: Order Summary & Place Order (col 5)
              =================================================================== */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-lumiere-border shadow-sm sticky top-24">
            <h3 className="font-serif text-2xl text-lumiere-text font-normal pb-4 border-b border-lumiere-border mb-4">
              Vault Order Summary ({cartItems.length})
            </h3>

            {/* Items List */}
            <div className="flex flex-col divide-y divide-lumiere-border/60 max-h-72 overflow-y-auto pr-1 mb-6">
              {cartItems.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3">
                  <OptimizedImage
                    src={item.image || '/assets/category_necklace.webp'}
                    alt={item.name}
                    className="w-14 h-16 object-cover bg-lumiere-secondary flex-shrink-0 border border-lumiere-border/60"
                    sizes="thumbnail"
                    aspectRatio="14/16"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-sm text-lumiere-text font-medium truncate">
                      {item.name}
                    </h5>
                    <span className="text-[10px] text-lumiere-bronze uppercase tracking-wider block">
                      {item.purity} | Qty: {item.quantity}
                    </span>
                    <span className="text-xs font-bold text-lumiere-text">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Details */}
            <div className="space-y-2.5 text-xs text-lumiere-muted border-t border-lumiere-border pt-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-lumiere-text font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Privilege Benefit {appliedCoupon?.code ? `(${appliedCoupon.code})` : ''}</span>
                  <span>–₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Insured Courier Delivery</span>
                <span className={shippingFee === 0 ? 'text-lumiere-gold font-bold' : 'text-lumiere-text font-medium'}>
                  {shippingFee === 0 ? 'COMPLIMENTARY' : `₹${shippingFee.toLocaleString('en-IN')}`}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-lumiere-text pt-3 border-t border-lumiere-border">
                <span>Total Payable</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[10px] text-lumiere-muted block text-right">
                Includes 3% GST & BIS 916 Hallmark certification
              </span>
            </div>

            {/* Trust Strip */}
            <div className="p-3 bg-[#FAF7F2] border border-lumiere-border/80 text-[11px] text-lumiere-text flex items-center gap-2 mb-6">
              <ShieldCheck size={18} className="text-lumiere-gold shrink-0" />
              <span>Full insurance coverage until delivery with mandatory OTP handover.</span>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lumiere-deep text-white py-4 text-xs font-bold tracking-[0.2em] uppercase text-center hover:bg-lumiere-gold-dark transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-75 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Securing Payment Gateway...</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>CONFIRM & PAY WITH RAZORPAY</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;
