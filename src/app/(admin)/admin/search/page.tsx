'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function GlobalSearchPage() {
  const [tab, setTab] = useState('customers');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any>(null);

  async function runSearch() {
    try {
      const response = await api.get(`/search?q=${search}`);
      setResults(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">🔎 Global Search Center</h1>
        <p className="text-gray-500 mt-2">
          Search Customers, Orders, Payments, Products, Invoices and more.
        </p>
      </div>

      {/* MASTER SEARCH */}
      <div className="bg-white rounded-3xl shadow p-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search anything across the entire system..."
          className="w-full border rounded-2xl p-5 text-lg"
        />

        <button
          onClick={runSearch}
          className="mt-4 bg-cyan-600 text-white px-6 py-3 rounded-xl"
        >
          Search
        </button>
      </div>

      {/* QUICK MODULES */}
      <div className="bg-white rounded-3xl shadow p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('customers')}
            className={`px-6 py-3 rounded-2xl ${
              tab === 'customers' ? 'bg-cyan-500 text-white' : 'bg-slate-100'
            }`}
          >
            👥 Customers
          </button>

          <button
            onClick={() => setTab('orders')}
            className={`px-6 py-3 rounded-2xl ${
              tab === 'orders' ? 'bg-cyan-500 text-white' : 'bg-slate-100'
            }`}
          >
            📦 Orders
          </button>

          <button
            onClick={() => setTab('payments')}
            className={`px-6 py-3 rounded-2xl ${
              tab === 'payments' ? 'bg-cyan-500 text-white' : 'bg-slate-100'
            }`}
          >
            💳 Payments
          </button>

          <button
            onClick={() => setTab('products')}
            className={`px-6 py-3 rounded-2xl ${
              tab === 'products' ? 'bg-cyan-500 text-white' : 'bg-slate-100'
            }`}
          >
            🎁 Products
          </button>

          <button
            onClick={() => setTab('invoices')}
            className={`px-6 py-3 rounded-2xl ${
              tab === 'invoices' ? 'bg-cyan-500 text-white' : 'bg-slate-100'
            }`}
          >
            🧾 Invoices
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          {/* CUSTOMER SEARCH */}
          {tab === 'customers' && (
            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">👥 Customer Search</h2>

              <div className="grid grid-cols-3 gap-4">
                <input placeholder="Customer ID" className="border p-4 rounded-xl" />
                <input placeholder="Customer Name" className="border p-4 rounded-xl" />
                <input placeholder="Phone Number" className="border p-4 rounded-xl" />
                <input placeholder="Email" className="border p-4 rounded-xl" />
                <input placeholder="Wallet Number" className="border p-4 rounded-xl" />

                <select className="border p-4 rounded-xl">
                  <option>Active</option>
                  <option>Suspended</option>
                </select>
              </div>

              <button className="mt-6 bg-black text-white px-6 py-3 rounded-xl">
                Search Customers
              </button>
            </div>
          )}

          {/* ORDER SEARCH */}
          {tab === 'orders' && (
            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">📦 Order Search</h2>

              <div className="grid grid-cols-3 gap-4">
                <input placeholder="Order Number" className="border p-4 rounded-xl" />
                <input placeholder="Order ID" className="border p-4 rounded-xl" />
                <input placeholder="Transaction ID" className="border p-4 rounded-xl" />
                <input placeholder="Customer Name" className="border p-4 rounded-xl" />
                <input placeholder="Recipient Name" className="border p-4 rounded-xl" />

                <select className="border p-4 rounded-xl">
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Delivered</option>
                </select>
              </div>

              <button className="mt-6 bg-black text-white px-6 py-3 rounded-xl">
                Search Orders
              </button>
            </div>
          )}

          {/* PRODUCT SEARCH */}
          {tab === 'products' && (
            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">🎁 Product Search</h2>

              <div className="grid grid-cols-3 gap-4">
                <input placeholder="Product Name" className="border p-4 rounded-xl" />
                <input placeholder="SKU" className="border p-4 rounded-xl" />
                <input placeholder="Barcode" className="border p-4 rounded-xl" />
                <input placeholder="Category" className="border p-4 rounded-xl" />
                <input placeholder="Sub Category" className="border p-4 rounded-xl" />

                <select className="border p-4 rounded-xl">
                  <option>In Stock</option>
                  <option>Out Of Stock</option>
                </select>
              </div>

              <button className="mt-6 bg-black text-white px-6 py-3 rounded-xl">
                Search Products
              </button>
            </div>
          )}

          {/* PAYMENTS SEARCH */}
          {tab === 'payments' && (
            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">💳 Payment Search</h2>

              <div className="grid grid-cols-3 gap-4">
                <input placeholder="Transaction ID" className="border p-4 rounded-xl" />
                <input placeholder="Mpesa Receipt" className="border p-4 rounded-xl" />
                <input placeholder="Phone Number" className="border p-4 rounded-xl" />
                <input placeholder="Customer Name" className="border p-4 rounded-xl" />
                <input placeholder="Amount" className="border p-4 rounded-xl" />

                <select className="border p-4 rounded-xl">
                  <option>All Methods</option>
                  <option>Wallet</option>
                  <option>Rexo</option>
                  <option>Mpesa</option>
                </select>
              </div>

              <button className="mt-6 bg-black text-white px-6 py-3 rounded-xl">
                Search Payments
              </button>
            </div>
          )}

          {/* INVOICES SEARCH */}
          {tab === 'invoices' && (
            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">🧾 Invoice Search</h2>

              <div className="grid grid-cols-3 gap-4">
                <input placeholder="Invoice Number" className="border p-4 rounded-xl" />
                <input placeholder="Order Number" className="border p-4 rounded-xl" />
                <input placeholder="Customer Name" className="border p-4 rounded-xl" />
                <input placeholder="Invoice Amount" className="border p-4 rounded-xl" />
                <input placeholder="Transaction ID" className="border p-4 rounded-xl" />

                <select className="border p-4 rounded-xl">
                  <option>All Statuses</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <button className="mt-6 bg-black text-white px-6 py-3 rounded-xl">
                Search Invoices
              </button>
            </div>
          )}
        </div>

        {/* ADVANCED FILTERS */}
        <div className="col-span-3">
          <div className="bg-white rounded-3xl shadow p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-6">⚙️ Advanced Filters</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Start Date</label>
                <input type="date" className="w-full border p-3 rounded-xl" />
              </div>

              <div>
                <label className="block text-sm mb-2">End Date</label>
                <input type="date" className="w-full border p-3 rounded-xl" />
              </div>

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Exact Match
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Active Records Only
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Include Archived
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Include Deleted
              </label>

              <button className="w-full bg-green-600 text-white py-3 rounded-xl">
                Export Excel
              </button>

              <button className="w-full bg-red-600 text-white py-3 rounded-xl">
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl shadow p-6">
          <p className="text-gray-500">Customers Found</p>
          <h2 className="text-3xl font-bold mt-2">0</h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <p className="text-gray-500">Orders Found</p>
          <h2 className="text-3xl font-bold mt-2">0</h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <p className="text-gray-500">Products Found</p>
          <h2 className="text-3xl font-bold mt-2">0</h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <p className="text-gray-500">Payments Found</p>
          <h2 className="text-3xl font-bold mt-2">0</h2>
        </div>
      </div>

      {/* RECENT SEARCHES */}
      <div className="bg-white rounded-3xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">🕒 Recent Searches</h2>

        <div className="space-y-3">
          <div className="border rounded-xl p-4">Customer: Peter Okumu</div>
          <div className="border rounded-xl p-4">Order: ORD-10021</div>
          <div className="border rounded-xl p-4">Product: Roses</div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="bg-white rounded-3xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Search Results</h2>

          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-xl">
              Export Excel
            </button>

            <button className="bg-red-600 text-white px-4 py-2 rounded-xl">
              Export PDF
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Module</th>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {results?.customers?.length ? (
              results.customers.map((customer: any) => (
                <tr key={customer.id}>
                  <td className="p-4">Customer</td>
                  <td className="p-4">User</td>
                  <td className="p-4">{customer.id}</td>
                  <td className="p-4">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="p-4">Active</td>
                  <td className="p-4">—</td>
                  <td className="p-4">View</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No Results Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}