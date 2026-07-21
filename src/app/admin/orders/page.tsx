'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500',
  paid: 'bg-green-500',
  processing: 'bg-blue-500',
  ready_for_dispatch: 'bg-purple-500',
  out_for_delivery: 'bg-orange-500',
  delivered: 'bg-emerald-600',
  cancelled: 'bg-red-500',
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'ready_for_dispatch', label: 'Ready For Dispatch' },
  { value: 'out_for_delivery', label: 'Out For Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TABLE_HEADERS = [
  'Order',
  'Customer',
  'Phone',
  'Total',
  'Status',
  'Gift Ambassador',
  'Delivery Note',
  'Tracking',
  'Date',
];

function authHeader() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [giftAmbassadors, setGiftAmbassadors] = useState<any[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchGiftAmbassadors();
  }, []);

  async function fetchOrders() {
    try {
      const response = await api.get('/orders/admin/all', {
        headers: authHeader(),
      });
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchGiftAmbassadors() {
    try {
      const response = await api.get('/orders/gift-ambassadors', {
        headers: authHeader(),
      });
      setGiftAmbassadors(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function assignGiftAmbassador(orderId: string, giftAmbassadorId: string) {
    try {
      await api.patch(
        `/orders/${orderId}/gift-ambassador`,
        { giftAmbassadorId },
        { headers: authHeader() },
      );
      toast.success('Gift Ambassador Assigned');
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Assignment failed');
    }
  }

  async function updateStatus(orderId: string, status: string, note?: string) {
    try {
      await api.patch(
        `/orders/${orderId}/status`,
        { status, note },
        { headers: authHeader() },
      );
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading orders...</div>;
  }

  return (
    <>

      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-10">📦 Admin Orders</h1>

          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  {TABLE_HEADERS.map((header) => (
                    <th key={header} className="p-4">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-4 font-bold">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>

                    <td className="p-4">{order.address?.fullName}</td>

                    <td className="p-4">{order.address?.phone}</td>

                    <td className="p-4 font-semibold">
                      KES {Number(order.grantTotal).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value, note)}
                        className={`px-3 py-2 rounded-xl text-white font-semibold border-0 ${STATUS_STYLES[order.status] ?? 'bg-red-500'}`}
                      >
                        {STATUS_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.giftAmbassadorId || ''}
                        onChange={(e) => assignGiftAmbassador(order.id, e.target.value)}
                        className="border rounded-xl p-2 w-full"
                      >
                        <option value="">Assign Ambassador</option>
                        {giftAmbassadors.map((ambassador) => (
                          <option key={ambassador.id} value={ambassador.id}>
                            {ambassador.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4">
                      <textarea
                        rows={2}
                        placeholder="Delivery note..."
                        className="border rounded-xl p-3 w-full resize-none"
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </td>

                    <td className="p-4 font-mono text-sm">{order.trackingNumber}</td>

                    <td className="p-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}