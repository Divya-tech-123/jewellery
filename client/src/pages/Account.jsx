import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, User, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/orderService';
import SectionHeading from '../components/SectionHeading';
import Loading from '../components/Loading';

const Account = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        if (res.success) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Error fetching orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="py-12 sm:py-20 bg-lumiere-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-lumiere-border mb-10 gap-4">
          <div>
            <span className="font-eyebrow block mb-1">PRIVILEGED CLIENT DOSSIER</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-charcoal font-normal">
              Welcome, {user.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="btn-luxury-primary text-xs py-2.5 px-5 bg-lumiere-gold border-lumiere-gold"
              >
                Admin Atelier Dashboard →
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lumiere-charcoal hover:text-red-600"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Profile Overview (col 4) */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 border border-lumiere-border h-fit">
            <h3 className="font-serif text-xl text-lumiere-charcoal font-medium pb-3 border-b border-lumiere-border mb-4">
              Client Dossier
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <span className="text-lumiere-light uppercase tracking-wider block text-[10px]">Client Name</span>
                <span className="font-semibold text-lumiere-charcoal text-sm">{user.name}</span>
              </div>
              <div>
                <span className="text-lumiere-light uppercase tracking-wider block text-[10px]">Email</span>
                <span className="font-medium text-lumiere-charcoal">{user.email}</span>
              </div>
              {user.phone && (
                <div>
                  <span className="text-lumiere-light uppercase tracking-wider block text-[10px]">Phone</span>
                  <span className="font-medium text-lumiere-charcoal">{user.phone}</span>
                </div>
              )}
              <div>
                <span className="text-lumiere-light uppercase tracking-wider block text-[10px]">Tier Status</span>
                <span className="text-lumiere-gold font-bold uppercase tracking-wider">Lumière Privileged Connoisseur</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-lumiere-border flex flex-col gap-3">
              <Link to="/wishlist" className="text-xs uppercase font-semibold text-lumiere-charcoal hover:text-lumiere-gold">
                View Saved Heirlooms →
              </Link>
              <Link to="/shop" className="text-xs uppercase font-semibold text-lumiere-charcoal hover:text-lumiere-gold">
                Browse New High Jewellery →
              </Link>
            </div>
          </div>

          {/* Orders History (col 8) */}
          <div className="lg:col-span-8">
            <h3 className="font-serif text-2xl text-lumiere-charcoal font-normal mb-6">
              Order Acquisition History ({orders.length})
            </h3>

            {loading ? (
              <Loading text="Retrieving order history..." />
            ) : orders.length === 0 ? (
              <div className="bg-white p-10 border border-lumiere-border text-center">
                <Package size={38} className="text-lumiere-border mx-auto mb-3" />
                <h4 className="font-serif text-xl text-lumiere-charcoal mb-2">No Acquisitions Yet</h4>
                <p className="text-xs text-lumiere-muted mb-6">
                  You have not placed any orders yet. Discover our latest collections.
                </p>
                <Link to="/shop" className="btn-luxury-primary text-xs py-3 px-6">
                  Discover Jewellery
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white p-6 border border-lumiere-border shadow-sm"
                  >
                    <div className="flex flex-wrap justify-between items-center pb-4 border-b border-lumiere-border/60 gap-4 mb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-lumiere-light block">Acquisition Reference</span>
                        <span className="font-mono text-xs font-semibold">{order._id}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-lumiere-light block">Date</span>
                        <span className="text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-lumiere-light block">Total Value</span>
                        <span className="text-xs font-bold text-lumiere-charcoal">₹{Number(order.total).toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-lumiere-light block">Status</span>
                        <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-12 h-14 object-cover bg-lumiere-secondary flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <h5 className="font-serif text-sm font-medium text-lumiere-charcoal">{item.name}</h5>
                            <span className="text-[10px] text-lumiere-light">{item.purity} | Qty: {item.quantity}</span>
                          </div>
                          <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
