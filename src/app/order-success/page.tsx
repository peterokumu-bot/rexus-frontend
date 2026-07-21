'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function OrderSuccessPage() {

  const searchParams =
    useSearchParams();

  const orderId =
    searchParams.get('orderId');

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">

        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-3xl w-full">

          <div className="text-center">

            <div className="text-8xl mb-6">
              🎉
            </div>

            <h1 className="text-5xl font-bold mb-4">
              Payment Successful
            </h1>

            <p className="text-gray-600 text-lg mb-10">
              Your gift is being wrapped with love.
              <br />
              Thank you for shopping with Rexus Gift Shop.
            </p>

          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-3xl p-6 mb-8">

            <h2 className="text-2xl font-bold mb-3">
              Order Confirmation
            </h2>

            <p className="text-gray-700">
              Order ID
            </p>

            <p className="font-semibold break-all">
              {orderId}
            </p>

          </div>

          <div className="bg-gray-50 rounded-3xl p-6 mb-8">

            <h2 className="text-2xl font-bold mb-5">
              Delivery Progress
            </h2>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <span className="text-green-600 text-2xl">
                  ✅
                </span>

                <span>
                  Order Received
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-2xl">
                  ⏳
                </span>

                <span className="text-gray-500">
                  Preparing Gift
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-2xl">
                  📦
                </span>

                <span className="text-gray-500">
                  Ready for Dispatch
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-2xl">
                  🚚
                </span>

                <span className="text-gray-500">
                  Out for Delivery
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-2xl">
                  🎁
                </span>

                <span className="text-gray-500">
                  Delivered
                </span>
              </div>

            </div>

          </div>

          <div className="flex flex-col md:flex-row gap-4">

            <Link
              href="/"
              className="flex-1 bg-pink-500 text-white text-center py-4 rounded-2xl font-semibold hover:scale-105 transition"
            >
              Continue Shopping with Rexus
            </Link>

            <Link
              href="/orders"
              className="flex-1 bg-black text-white text-center py-4 rounded-2xl font-semibold hover:scale-105 transition"
            >
              📦 View My Orders
            </Link>

          </div>

        </div>

      </main>
    </>
  );
}