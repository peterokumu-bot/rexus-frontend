'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

function authHeader() {
  const token = localStorage.getItem('token');

  return {
    Authorization: `Bearer ${token}`,
  };
}

const STATUS_ROWS: Array<{ label: string; key: string }> = [
  { label: 'Pending', key: 'pending' },
  { label: 'Paid', key: 'paid' },
  { label: 'Processing', key: 'processing' },
  { label: 'Ready Dispatch', key: 'readyForDispatch' },
  { label: 'Out For Delivery', key: 'outForDelivery' },
  { label: 'Delivered', key: 'delivered' },
];

function initials(name?: string) {
  if (!name) return '—';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [statusStats, setStatusStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const headers = authHeader();

      const [statsRes, ordersRes, customersRes, productsRes, statusRes] = await Promise.all([
        api.get('/dashboard/stats', { headers }),
        api.get('/dashboard/orders/recent', { headers }),
        api.get('/dashboard/customers/recent', { headers }),
        api.get('/dashboard/products/recent', { headers }),
        api.get('/dashboard/order-status', { headers }),
      ]);

      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
      setRecentCustomers(customersRes.data);
      setRecentProducts(productsRes.data);
      setStatusStats(statusRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] font-serif text-lg italic text-[#6B6F76]">
        Preparing dashboard…
      </div>
    );
  }

  const kpis = [
    {
      label: 'Revenue',
      value: `KES ${Number(stats?.totalRevenue || 0).toLocaleString()}`,
      accent: true,
    },
    { label: 'Orders', value: stats?.totalOrders || 0 },
    { label: 'Customers', value: stats?.totalCustomers || 0 },
    { label: 'Products', value: stats?.totalProducts || 0 },
    { label: 'Ambassadors', value: stats?.totalAmbassadors || 0 },
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-12 font-sans text-[#1A1A1A] sm:px-10">
      <style>{`
        .leader-row {
          background-image: radial-gradient(circle, #C8BFA8 1px, transparent 1px);
          background-position: bottom 7px left 0;
          background-size: 6px 1px;
          background-repeat: repeat-x;
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-12 flex flex-col gap-2 border-b border-[#E3DDD1] pb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A227]">
            Overview
          </span>
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-[#1B2A4A]">
            Dashboard
          </h1>
        </div>

        {/* KPI CARDS */}
        <div className="mb-12 grid gap-5 md:grid-cols-5">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="relative rounded-sm border border-[#E3DDD1] bg-white p-6"
            >
              <span className="absolute left-0 top-0 h-full w-[3px] bg-[#C9A227]" />

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B6F76]">
                {kpi.label}
              </p>

              <h2
                className={`mt-3 font-serif text-3xl font-semibold ${
                  kpi.accent ? 'text-[#9C6B12]' : 'text-[#1B2A4A]'
                }`}
              >
                {kpi.value}
              </h2>
            </div>
          ))}
        </div>

        {/* SECOND ROW */}
        <div className="mb-12 grid gap-6 lg:grid-cols-3">
          {/* ORDER STATUS */}
          <div className="rounded-sm border border-[#E3DDD1] bg-white p-7">
            <h2 className="mb-6 font-serif text-xl font-semibold text-[#1B2A4A]">
              Order Status
            </h2>

            <div className="space-y-3">
              {STATUS_ROWS.map((row) => (
                <div
                  key={row.key}
                  className="leader-row flex items-end justify-between pb-1 text-sm"
                >
                  <span className="bg-white pr-2 text-[#4A4D52]">{row.label}</span>
                  <strong className="bg-white pl-2 font-serif text-base text-[#1B2A4A]">
                    {statusStats?.[row.key] || 0}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* CUSTOMERS */}
          <div className="rounded-sm border border-[#E3DDD1] bg-white p-7">
            <h2 className="mb-6 font-serif text-xl font-semibold text-[#1B2A4A]">
              Recent Customers
            </h2>

            <div className="space-y-4">
              {recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center gap-3 border-b border-[#F1EDE3] pb-3 last:border-b-0 last:pb-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D9C9A3] bg-[#FAF3E4] font-serif text-xs font-semibold text-[#9C6B12]">
                    {initials(customer.name)}
                  </div>

                  <div>
                    <p className="font-medium text-[#1A1A1A]">{customer.name}</p>
                    <p className="text-sm text-[#6B6F76]">{customer.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="rounded-sm border border-[#E3DDD1] bg-white p-7">
            <h2 className="mb-6 font-serif text-xl font-semibold text-[#1B2A4A]">
              Recent Products
            </h2>

            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between border-b border-[#F1EDE3] pb-3 last:border-b-0 last:pb-0">
                  <p className="font-medium text-[#1A1A1A]">{product.name}</p>
                  <p className="font-serif text-sm text-[#9C6B12]">
                    KES {Number(product.price).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div className="overflow-hidden rounded-sm border border-[#E3DDD1] bg-white">
          <div className="border-b border-[#E3DDD1] px-7 py-6">
            <h2 className="font-serif text-xl font-semibold text-[#1B2A4A]">Recent Orders</h2>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E3DDD1] text-left text-xs font-semibold uppercase tracking-[0.15em] text-[#6B6F76]">
                <th className="px-7 py-4">Tracking</th>
                <th className="px-7 py-4">Customer</th>
                <th className="px-7 py-4">Amount</th>
                <th className="px-7 py-4">Status</th>
                <th className="px-7 py-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center italic text-[#6B6F76]">
                    No Orders Found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#F1EDE3] last:border-b-0">
                    <td className="px-7 py-4 font-mono text-sm text-[#4A4D52]">
                      {order.trackingNumber}
                    </td>

                    <td className="px-7 py-4 text-[#1A1A1A]">
                      {order.customerName || order.address?.fullName || '-'}
                    </td>

                    <td className="px-7 py-4 font-serif text-[#1B2A4A]">
                      KES {Number(order.grandTotal).toLocaleString()}
                    </td>

                    <td className="px-7 py-4">
                      <span className="rounded-sm border border-[#D9C9A3] bg-[#FAF3E4] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#9C6B12]">
                        {order.status}
                      </span>
                    </td>

                    <td className="px-7 py-4 text-sm text-[#6B6F76]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}