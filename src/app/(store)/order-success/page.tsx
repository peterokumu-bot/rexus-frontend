'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <AppLayout>
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-3xl rounded-3xl bg-white p-12 shadow-xl">
          <div className="text-center">
            <div className="mb-6 text-8xl">🎉</div>
            <h1 className="mb-4 text-5xl font-bold">Payment Successful</h1>
            <p className="mb-10 text-lg text-gray-600">
              Your gift is being wrapped with love.
              <br />
              Thank you for shopping with Rexus Gift Shop.
            </p>
          </div>

          <div className="mb-8 rounded-3xl border border-pink-200 bg-pink-50 p-6">
            <h2 className="mb-3 text-2xl font-bold">Order Confirmation</h2>
            <p className="text-gray-700">Order ID</p>
            <p className="break-all font-semibold">{orderId}</p>
          </div>

          <div className="mb-8 rounded-3xl bg-gray-50 p-6">
            <h2 className="mb-5 text-2xl font-bold">Delivery Progress</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-green-600">✅</span>
                <span>Order Received</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl text-gray-400">⏳</span>
                <span className="text-gray-500">Preparing Gift</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl text-gray-400">📦</span>
                <span className="text-gray-500">Ready for Dispatch</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl text-gray-400">🚚</span>
                <span className="text-gray-500">Out for Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl text-gray-400">🎁</span>
                <span className="text-gray-500">Delivered</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <Link
              href="/"
              className="flex-1 rounded-2xl bg-pink-500 py-4 text-center font-semibold text-white transition hover:scale-105"
            >
              Continue Shopping with Rexus
            </Link>
            <Link
              href="/orders"
              className="flex-1 rounded-2xl bg-black py-4 text-center font-semibold text-white transition hover:scale-105"
            >
              📦 View My Orders
            </Link>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <AppLayout>
          <div className="p-10 text-center">Loading...</div>
        </AppLayout>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}