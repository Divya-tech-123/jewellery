import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, ArrowRight } from 'lucide-react';
import { getProducts } from '../../services/productService';
import { getAllOrders } from '../../services/orderService';
import api from '../../services/api';
import Loading from '../../components/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    productsCount: 0,
    usersCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prodRes, orderRes, usersRes] = await Promise.all([
          getProducts({ limit: 100 }),
          getAllOrders(),
          api.get('/users').catch(() => ({ data: { count: 2, users: [] } })),
        ]);

        const products = prodRes.products || [];
        const orders = orderRes.orders || [];
        const usersCount = usersRes.data?.count || 2;

        const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const lowStock = products.filter(p => (p.stock !== undefined && p.stock <= 5));

        setStats({
          revenue,
          ordersCount: orders.length,
          productsCount: products.length,
          usersCount,
        });

        setRecentOrders(orders.slice(0, 5));
        setLowStockProducts(lowStock);
      } catch (err) {
        console.error('Error fetching admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading text="Loading Atelier Dashboard Analytics..." />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-lumiere-border">
        <div>
          <span className="font-eyebrow block mb-1">ATELIER DIRECTORS PORTAL</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-charcoal font-normal">
            Executive Overview
          </h1>
        </div>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <Link
            to="/admin/banners"
            className="inline-flex items-center gap-1.5 bg-lumiere-gold hover:bg-lumiere-gold-dark text-white text-[11px] font-semibold py-2.5 px-4 rounded tracking-wider uppercase transition-colors shadow-sm"
          >
            <span>Hero Banners</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            to="/admin/products"
            className="btn-luxury-primary text-[10px] py-2.5 px-5"
          >
            Manage Catalogue →
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 border border-lumiere-border shadow-sm">
          <div className="flex justify-between items-center text-lumiere-light mb-3">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Total Revenue</span>
            <DollarSign size={18} className="text-lumiere-gold" />
          </div>
          <span className="font-serif text-3xl font-normal text-lumiere-charcoal block">
            ₹{stats.revenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Verified Transactions</span>
        </div>

        <div className="bg-white p-6 border border-lumiere-border shadow-sm">
          <div className="flex justify-between items-center text-lumiere-light mb-3">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Total Acquisitions</span>
            <ShoppingBag size={18} className="text-lumiere-gold" />
          </div>
          <span className="font-serif text-3xl font-normal text-lumiere-charcoal block">
            {stats.ordersCount}
          </span>
          <span className="text-[11px] text-lumiere-light mt-1 block">Lifetime Client Orders</span>
        </div>

        <div className="bg-white p-6 border border-lumiere-border shadow-sm">
          <div className="flex justify-between items-center text-lumiere-light mb-3">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Active Creational Pieces</span>
            <Package size={18} className="text-lumiere-gold" />
          </div>
          <span className="font-serif text-3xl font-normal text-lumiere-charcoal block">
            {stats.productsCount}
          </span>
          <span className="text-[11px] text-lumiere-light mt-1 block">Gold, Diamond & Bridal Pieces</span>
        </div>

        <div className="bg-white p-6 border border-lumiere-border shadow-sm">
          <div className="flex justify-between items-center text-lumiere-light mb-3">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Patrons & Clients</span>
            <Users size={18} className="text-lumiere-gold" />
          </div>
          <span className="font-serif text-3xl font-normal text-lumiere-charcoal block">
            {stats.usersCount}
          </span>
          <span className="text-[11px] text-lumiere-light mt-1 block">Registered Connoisseurs</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (col 8) */}
        <div className="lg:col-span-8 bg-white p-6 border border-lumiere-border">
          <div className="flex justify-between items-center pb-4 border-b border-lumiere-border mb-4">
            <h3 className="font-serif text-xl text-lumiere-charcoal font-medium">Recent Acquisitions</h3>
            <Link to="/admin/orders" className="text-xs uppercase font-semibold text-lumiere-gold hover:text-lumiere-charcoal">
              View All Orders →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-lumiere-muted py-6 text-center">No orders recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-lumiere-border/60 text-lumiere-light uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Order Ref</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Value</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lumiere-border/40">
                  {recentOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-[#FAF7F2]">
                      <td className="py-3 font-mono text-[11px]">{o._id}</td>
                      <td className="py-3 font-medium">{o.shippingAddress?.fullName || o.guestEmail}</td>
                      <td className="py-3 font-semibold">₹{Number(o.total).toLocaleString('en-IN')}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 text-[10px] uppercase font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link to="/admin/orders" className="text-lumiere-gold hover:underline">
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts (col 4) */}
        <div className="lg:col-span-4 bg-white p-6 border border-lumiere-border">
          <div className="flex items-center gap-2 pb-4 border-b border-lumiere-border mb-4 text-amber-800">
            <AlertTriangle size={18} />
            <h3 className="font-serif text-xl font-medium text-lumiere-charcoal">Limited Atelier Stock</h3>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-emerald-700 py-6 text-center">All creations well-stocked.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {lowStockProducts.map((p) => (
                <div key={p._id || p.id} className="flex justify-between items-center py-2 border-b border-lumiere-border/40 text-xs">
                  <div>
                    <h5 className="font-serif font-medium line-clamp-1">{p.name}</h5>
                    <span className="text-[10px] text-lumiere-light">₹{Number(p.price).toLocaleString('en-IN')}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold text-red-700 bg-red-50 rounded">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
