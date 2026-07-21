'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function CustomerDetailsPage() {
  const params = useParams();

  const customerId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [vipLevel, setVipLevel] = useState('');

  useEffect(() => {
    if (!customerId) return;
    loadCustomer();
  }, [customerId]);

  useEffect(() => {
    if (customer?.vipLevel) {
      setVipLevel(customer.vipLevel);
    }
  }, [customer]);

  async function loadCustomer() {
    try {
      const token = localStorage.getItem('token');

      const response = await api.get(`/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomer(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateVipLevel() {
    try {
      const token = localStorage.getItem('token');

      await api.patch(
        `/customers/${customerId}/vip`,
        { vipLevel },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert('VIP Level Updated');
      loadCustomer();
    } catch (error) {
      console.error(error);
      alert('Failed to update VIP');
    }
  }

  if (loading) {
    return <div className="p-10 text-gray-400">Loading...</div>;
  }

  if (!customer) {
    return <div className="p-10 text-gray-400">Customer not found</div>;
  }

  const totalSpend = customer.orders
    .filter((order: any) =>
      ['paid', 'processing', 'ready_for_dispatch', 'out_for_delivery', 'delivered'].includes(
        order.status,
      ),
    )
    .reduce((sum: number, order: any) => sum + (order.grandTotal || 0), 0);

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">{customer.name}</h1>

      {/* Summary stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Spend</p>
          <h2 className="text-3xl font-bold text-gray-900">
            KES {totalSpend.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-3xl font-bold text-gray-900">{customer.orders.length}</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">VIP Level</p>
          <h2 className="text-3xl font-bold text-gray-900">{customer.vipLevel}</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Loyalty Points</p>
          <h2 className="text-3xl font-bold text-gray-900">{customer.loyaltyPoints}</h2>
        </div>
      </div>

      {/* Customer info */}
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold text-gray-900">Customer Information</h2>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong className="text-gray-900">Phone:</strong> {customer.phone}
          </p>
          <p>
            <strong className="text-gray-900">Email:</strong> {customer.email}
          </p>
          <p>
            <strong className="text-gray-900">City:</strong> {customer.city}
          </p>
          <p>
            <strong className="text-gray-900">Country:</strong> {customer.country}
          </p>
          <p>
            <strong className="text-gray-900">Status:</strong> {customer.status}
          </p>
        </div>
      </div>

      {/* VIP Management */}
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold text-gray-900">VIP Management</h2>

        <div className="flex items-center gap-4">
          <select
            value={vipLevel}
            onChange={(e) => setVipLevel(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          >
            <option value="Regular">Regular</option>
            <option value="Prestige">Prestige</option>
            <option value="Executive">Executive</option>
            <option value="Elite">Elite</option>
            <option value="Dynasty">Dynasty</option>
          </select>

          <button
            onClick={updateVipLevel}
            className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Update VIP
          </button>
        </div>
      </div>

      {/* Customer Actions */}
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold text-gray-900">Customer Actions</h2>

        <div className="flex gap-4">
          <button className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700">
            Suspend Customer
          </button>

          <button className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700">
            Activate Customer
          </button>
        </div>
      </div>

      {/* VIP Journey */}
      {customer.vipHistory?.length > 0 && (
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-gray-900">VIP Journey</h2>

          <div className="space-y-4">
            {customer.vipHistory.map((history: any) => (
              <div key={history.id} className="border-l-4 border-purple-500 pl-4">
                <p className="font-semibold text-gray-900">
                  {history.oldLevel} → {history.newLevel}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(history.changedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order history */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Order History</h2>

        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="py-3">Order</th>
              <th className="py-3">Status</th>
              <th className="py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {customer.orders.map((order: any) => (
              <tr key={order.id} className="border-t border-gray-100">
                <td className="py-4 font-medium text-gray-900">{order.orderNumber}</td>
                <td className="py-4 text-gray-700">{order.status}</td>
                <td className="py-4 text-gray-700">
                  KES {Number(order.grandTotal || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customer.orders.length === 0 && (
          <div className="py-10 text-center text-gray-400">No orders yet.</div>
        )}
      </div>
    </main>
  );
}