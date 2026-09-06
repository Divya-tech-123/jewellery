import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, CheckCircle, Clock, Truck, CheckCheck, XCircle, ShieldCheck, User, MapPin } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import Loading from '../../components/Loading';

const STATUS_CONFIG = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', icon: Clock },
  Confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', icon: CheckCircle },
  Processing: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', icon: RefreshCw },
  Shipped: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200', icon: Truck },
  Delivered: { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300', icon: CheckCheck },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', icon: XCircle },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId || o.orderNumber === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter & Search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    const orderRef = (order.orderNumber || order._id || '').toLowerCase();
    const customerName = (order.shippingAddress?.fullName || '').toLowerCase();
    const customerEmail = (order.guestEmail || order.user?.email || '').toLowerCase();
    const customerPhone = (order.shippingAddress?.phone || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch = !q || orderRef.includes(q) || customerName.includes(q) || customerEmail.includes(q) || customerPhone.includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-lumiere-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-lumiere-gold block mb-1">
            ATELIER VAULT LEDGER
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-text font-normal">
            Client Acquisitions & Orders ({orders.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="btn-secondary-indian text-xs py-2 px-4 self-start sm:self-auto flex items-center gap-1.5"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 border border-lumiere-border shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by Order ID, Client Name, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-lumiere-border text-xs py-2.5 pl-9 pr-3 outline-none focus:border-lumiere-gold"
          />
          <Search size={15} className="absolute left-3 top-3 text-lumiere-muted" />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Pending', 'Cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold border transition-all ${
                statusFilter === st
                  ? 'bg-lumiere-deep text-white border-lumiere-deep'
                  : 'bg-white text-lumiere-text border-lumiere-border hover:border-lumiere-gold'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <Loading text="Retrieving Atelier Acquisitions..." />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-12 text-center border border-lumiere-border shadow-sm">
          <p className="font-serif text-2xl text-lumiere-text mb-2">No acquisitions found</p>
          <p className="text-xs text-lumiere-muted">
            {searchQuery || statusFilter !== 'All'
              ? 'Try changing your search keywords or status filter.'
              : 'No client orders have been placed yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const StatusIcon = STATUS_CONFIG[order.orderStatus]?.icon || Clock;
            const statusStyle = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Confirmed;
            const orderRef = order.orderNumber || order._id;

            return (
              <div
                key={order._id || orderRef}
                className="bg-white border border-lumiere-border p-6 shadow-sm hover:border-lumiere-gold/70 transition-all"
              >
                {/* Order Top Ribbon */}
                <div className="flex flex-wrap justify-between items-center pb-4 border-b border-lumiere-border/60 gap-4 mb-5">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-lumiere-gold block">
                      Order Reference
                    </span>
                    <span className="font-mono text-sm font-bold text-lumiere-text">{orderRef}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-lumiere-muted block">
                      Date & Time
                    </span>
                    <span className="text-xs text-lumiere-text font-medium">
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-lumiere-muted block">
                      Payment Status
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase inline-flex items-center gap-1">
                      <ShieldCheck size={12} /> {order.paymentStatus || 'PAID'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-lumiere-muted block">
                      Total Acquisition Value
                    </span>
                    <span className="text-sm font-bold text-lumiere-text font-serif">
                      ₹{Number(order.total).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-lumiere-gold block mb-1">
                      Update Order Status
                    </span>
                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs px-3 py-1.5 font-bold uppercase tracking-wider outline-none cursor-pointer border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Details Grid: Client Info + Vault Items */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  
                  {/* Client & Courier Address (col 5) */}
                  <div className="lg:col-span-5 bg-[#FAF7F2] p-4 border border-lumiere-border space-y-2">
                    <span className="font-bold text-lumiere-text uppercase tracking-wider text-[10px] block pb-1 border-b border-lumiere-border/60">
                      Client & Courier Address
                    </span>

                    <p className="font-bold text-sm text-lumiere-text font-serif">
                      {order.shippingAddress?.fullName}
                    </p>

                    <p className="text-lumiere-muted leading-relaxed">
                      {order.shippingAddress?.street}
                      {order.shippingAddress?.landmark ? `, Near ${order.shippingAddress?.landmark}` : ''}<br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}<br />
                      {order.shippingAddress?.country || 'India'}
                    </p>

                    <div className="pt-2 border-t border-lumiere-border/60 space-y-1 text-[11px]">
                      <p className="text-lumiere-text font-mono font-medium">
                        Tel: {order.shippingAddress?.phone}
                      </p>
                      <p className="text-lumiere-muted">
                        Email: {order.guestEmail}
                      </p>
                      {order.razorpayPaymentId && (
                        <p className="text-lumiere-bronze font-mono">
                          Razorpay Txn: {order.razorpayPaymentId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Purchased Items (col 7) */}
                  <div className="lg:col-span-7 flex flex-col gap-2.5">
                    <span className="font-bold text-lumiere-text uppercase tracking-wider text-[10px] pb-1 border-b border-lumiere-border/60">
                      Purchased Jewellery Pieces ({order.items?.length || 0})
                    </span>

                    <div className="divide-y divide-lumiere-border/40">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center gap-3">
                          <img
                            src={item.image || '/assets/category_necklace.jpg'}
                            alt={item.name}
                            className="w-12 h-14 object-cover bg-lumiere-secondary border border-lumiere-border/60 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-serif text-sm font-medium text-lumiere-text truncate">
                              {item.name}
                            </h5>
                            <span className="text-[10px] text-lumiere-bronze uppercase tracking-wider block">
                              {item.purity} {item.size ? `| ${item.size}` : ''} | Qty: {item.quantity}
                            </span>
                          </div>
                          <span className="font-bold text-xs font-serif text-lumiere-text">
                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Financial Summary Strip */}
                    <div className="mt-auto pt-2 border-t border-lumiere-border/60 flex justify-between text-[11px] text-lumiere-muted">
                      <span>Subtotal: ₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                      {order.discountAmount > 0 && <span>Discount: –₹{Number(order.discountAmount).toLocaleString('en-IN')}</span>}
                      <span>Courier: {order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee}`}</span>
                      <strong className="text-lumiere-text">Total: ₹{Number(order.total).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
