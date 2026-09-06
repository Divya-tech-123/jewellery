import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Printer, ArrowRight, Package, Truck, Lock, Sparkles } from 'lucide-react';
import { getOrderById } from '../services/orderService';
import Loading from '../components/Loading';
import OptimizedImage from '../components/OptimizedImage';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        setLoading(true);
        try {
          const res = await getOrderById(id);
          if (res.success && res.order) {
            setOrder(res.order);
          } else {
            setError('Unable to locate order confirmation.');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to retrieve order confirmation details.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return <Loading text="Verifying Heirloom Acquisition Receipt..." />;
  }

  if (error || !order) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center bg-lumiere-bg px-4">
        <h2 className="font-serif text-3xl mb-3 text-lumiere-text">Order Receipt Not Found</h2>
        <p className="text-xs text-lumiere-muted mb-6 max-w-sm">
          {error || 'The requested order reference could not be verified.'}
        </p>
        <Link to="/shop" className="btn-primary-indian text-xs py-3.5 px-6">
          RETURN TO ATELIER →
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const orderRef = order.orderNumber || order._id;
  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="py-12 sm:py-20 bg-lumiere-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Confirmation Card */}
        <div className="bg-white border border-lumiere-border p-6 sm:p-10 lg:p-12 shadow-[0_10px_35px_rgba(45,40,35,0.06)] relative overflow-hidden">
          
          {/* Subtle Top Gold Banner */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-lumiere-gold via-lumiere-gold-light to-lumiere-gold" />

          {/* Success Banner */}
          <div className="text-center max-w-lg mx-auto mb-10">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-700 shadow-sm">
              <CheckCircle size={36} strokeWidth={1.8} />
            </div>
            
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-lumiere-gold block mb-1">
              ACQUISITION CONFIRMED
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-text font-normal mb-2">
              Thank You For Your Patronage
            </h1>
            <p className="text-xs sm:text-sm text-lumiere-muted font-light leading-relaxed">
              Your order <strong className="text-lumiere-text font-mono font-bold">#{orderRef}</strong> has been secured with tamper-proof seal and allocated for priority courier dispatch.
            </p>
          </div>

          {/* Order Details Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAF7F2] border border-lumiere-border/80 text-xs mb-8">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-lumiere-muted block">Order Ref</span>
              <span className="font-mono font-bold text-lumiere-text truncate block">{orderRef}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-lumiere-muted block">Placed On</span>
              <span className="font-medium text-lumiere-text">{formattedDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-lumiere-muted block">Payment Status</span>
              <span className="text-emerald-800 font-bold uppercase flex items-center gap-1">
                <ShieldCheck size={13} /> {order.paymentStatus || 'PAID'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-lumiere-muted block">Total Paid</span>
              <span className="font-bold text-lumiere-text font-serif text-sm">₹{Number(order.total).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Courier Progression Steps */}
          <div className="mb-10 pb-8 border-b border-lumiere-border/80">
            <span className="text-[10px] uppercase font-bold tracking-widest text-lumiere-gold block mb-4">
              INSURED COURIER STATUS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-0.5">1. Confirmed</span>
                <span className="text-[10px] text-emerald-700">Payment Verified</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] border border-lumiere-border">
                <span className="font-bold text-lumiere-text block mb-0.5">2. Atelier Vault</span>
                <span className="text-[10px] text-lumiere-muted">BIS Hallmarking Check</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] border border-lumiere-border">
                <span className="font-bold text-lumiere-text block mb-0.5">3. Tamper Seal</span>
                <span className="text-[10px] text-lumiere-muted">Insured Courier Box</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] border border-lumiere-border">
                <span className="font-bold text-lumiere-text block mb-0.5">4. OTP Delivery</span>
                <span className="text-[10px] text-lumiere-muted">Direct Handover</span>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="mb-8">
            <h2 className="font-serif text-xl font-normal text-lumiere-text mb-4 pb-2 border-b border-lumiere-border">
              Purchased Creations ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-lumiere-border/60">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center gap-4">
                  <OptimizedImage
                    src={item.image || '/assets/category_necklace.webp'}
                    alt={item.name}
                    className="w-16 h-20 object-cover bg-lumiere-secondary border border-lumiere-border/60 flex-shrink-0"
                    sizes="thumbnail"
                    aspectRatio="16/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base text-lumiere-text font-medium truncate">
                      {item.name}
                    </h3>
                    <div className="text-[11px] text-lumiere-bronze uppercase tracking-wider mt-0.5">
                      {item.purity} {item.size ? `• ${item.size}` : ''} • Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-lumiere-text font-serif">
                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-lumiere-muted block">
                      (₹{Number(item.price).toLocaleString('en-IN')} each)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Financial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-lumiere-border/80 mb-10 text-xs">
            
            {/* Delivery Address Details */}
            <div className="bg-[#FAF7F2] p-5 border border-lumiere-border">
              <span className="font-bold text-[11px] uppercase tracking-wider text-lumiere-text block mb-2">
                Insured Handover Destination
              </span>
              <p className="font-serif text-sm font-semibold text-lumiere-text mb-1">
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-lumiere-muted leading-relaxed mb-2">
                {order.shippingAddress?.street}
                {order.shippingAddress?.landmark ? `, Near ${order.shippingAddress?.landmark}` : ''}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}<br />
                {order.shippingAddress?.country || 'India'}
              </p>
              <p className="text-lumiere-text font-mono text-[11px]">
                Mobile (OTP Contact): {order.shippingAddress?.phone}
              </p>
              <p className="text-lumiere-muted text-[11px]">
                Email: {order.guestEmail}
              </p>
            </div>

            {/* Financial Summary */}
            <div className="space-y-2.5 p-5 bg-[#FAF7F2] border border-lumiere-border">
              <span className="font-bold text-[11px] uppercase tracking-wider text-lumiere-text block mb-2">
                Payment Breakdown
              </span>
              <div className="flex justify-between text-lumiere-muted">
                <span>Subtotal</span>
                <span className="text-lumiere-text font-medium">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Privilege Benefit {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span>–₹{Number(order.discountAmount).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-lumiere-muted">
                <span>Insured Courier Delivery</span>
                <span className="text-lumiere-gold font-bold">
                  {order.shippingFee === 0 ? 'COMPLIMENTARY' : `₹${Number(order.shippingFee).toLocaleString('en-IN')}`}
                </span>
              </div>

              {order.razorpayPaymentId && (
                <div className="flex justify-between text-[11px] text-lumiere-muted pt-1">
                  <span>Transaction Reference</span>
                  <span className="font-mono text-lumiere-text">{order.razorpayPaymentId}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-lumiere-text pt-3 border-t border-lumiere-border">
                <span>Total Amount Paid</span>
                <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-lumiere-border">
            <Link to="/shop" className="btn-primary-indian text-xs py-3.5 px-8 w-full sm:w-auto text-center">
              CONTINUE BROWSING CATALOGUE →
            </Link>

            <button
              type="button"
              onClick={handlePrint}
              className="btn-secondary-indian text-xs py-3.5 px-6 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Printer size={15} />
              <span>Print Official Receipt</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
