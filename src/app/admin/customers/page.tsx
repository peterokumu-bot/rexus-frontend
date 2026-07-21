'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const VIP_STYLES: Record<string, string> = {
  Regular: 'bg-gray-500',
  Prestige: 'bg-blue-600',
  Executive: 'bg-purple-600',
  Elite: 'bg-yellow-500',
  Dynasty: 'bg-black',
};

const VIP_LEVELS = ['Regular', 'Prestige', 'Executive', 'Elite', 'Dynasty'];

export default function AdminCustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [vipFilter, setVipFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const token = localStorage.getItem('token');

      const response = await api.get('/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const years = useMemo(() => {
    const set = new Set<string>();

    customers.forEach((customer) => {
      if (customer.createdAt) {
        set.add(new Date(customer.createdAt).getFullYear().toString());
      }
    });

    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        !search ||
        customer.name?.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(search.toLowerCase()) ||
        customer.customerNumber?.toLowerCase().includes(search.toLowerCase());

      const matchesVip = !vipFilter || customer.vipLevel === vipFilter;

      const matchesYear =
        !yearFilter ||
        (customer.createdAt &&
          new Date(customer.createdAt).getFullYear().toString() === yearFilter);

      return matchesSearch && matchesVip && matchesYear;
    });
  }, [customers, search, vipFilter, yearFilter]);

  function exportCustomers() {
    const headers = [
      'Customer ID',
      'Name',
      'Date Joined',
      'VIP Level',
      'Orders',
      'Total Spend',
    ];

    const rows = filteredCustomers.map((customer) => [
      customer.customerNumber,
      customer.name,
      customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '',
      customer.vipLevel,
      customer.totalOrders,
      customer.totalSpent || 0,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function clearFilters() {
    setSearch('');
    setVipFilter('');
    setYearFilter('');
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-400">
        Loading customers...
      </div>
    );
  }

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Customers</h1>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        {/* Filters */}
        <div className="space-y-4 border-b border-gray-100 p-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={vipFilter}
              onChange={(e) => setVipFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="">All VIP levels</option>
              {VIP_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="">All years joined</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {(search || vipFilter || yearFilter) && (
              <button
                onClick={clearFilters}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
              >
                Clear filters
              </button>
            )}

            <button
              onClick={exportCustomers}
              className="ml-auto rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Export CSV
            </button>
          </div>

          <p className="text-sm text-gray-400">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="p-4">Customer ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Spend</th>
              <th className="p-4">Date Joined</th>
              <th className="p-4">VIP</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => router.push(`/admin/customers/${customer.id}`)}
                className="cursor-pointer border-t border-gray-100 transition hover:bg-gray-50"
              >
                <td className="p-4 text-gray-500">{customer.customerNumber}</td>

                <td className="p-4">
                  <div className="font-bold text-gray-900">{customer.name}</div>
                </td>

                <td className="p-4 text-gray-700">{customer.totalOrders}</td>

                <td className="p-4 text-gray-700">
                  KES {Number(customer.totalSpent || 0).toLocaleString()}
                </td>

                <td className="p-4 text-gray-700">
                  {customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString()
                    : '—'}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                      VIP_STYLES[customer.vipLevel] || 'bg-gray-500'
                    }`}
                  >
                    {customer.vipLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="p-10 text-center text-gray-400">No customers found.</div>
        )}
      </div>
    </main>
  );
}