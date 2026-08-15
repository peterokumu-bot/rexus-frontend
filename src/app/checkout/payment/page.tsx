'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import AppLayout from '@/components/layout/AppLayout';
import Container from '@/components/layout/Container';
import api from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatRexo } from '@/common/utils/currency.util';

function PaymentPageContent() {
  const { wallet, rexo } = useApp();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [giftMessage, setGiftMessage] = useState('');

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
        setGiftMessage(data.giftMessage || '');
      } catch (error) {
        console.error(error);
        toast.error('Failed to load order');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  async function payWithWallet() {
    try {
      await api.post(`/wallet/pay/${orderId}`);
      toast.success('Payment successful');
      window.location.href = `/order-success?orderId=${orderId}`;
    } catch (error) {
      console.error(error);
      toast.error('Payment failed');
    }
  }

  async function payWithRexo() {
    try {
      const { data } = await api.post(`/wallet/pay-rexo/${orderId}`);

      if (data.fullyPaid) {
        toast.success('Order paid successfully with Rexo');
        window.location.href = `/order-success?orderId=${orderId}`;
        return;
      }

      const remaining = data.remainingAmount;
      const confirmWallet = window.confirm(
        `Rexo applied successfully.\n\nRemaining Balance: KES ${remaining.toFixed(2)}\n\nWould you like to pay the balance using Wallet?`,
      );

      if (confirmWallet) {
        await api.post(`/wallet/pay/${orderId}`);
        toast.success('Remaining balance paid successfully');
        window.location.href = `/order-success?orderId=${orderId}`;
      }
    } catch (error) {
      console.error(error);
      toast.error('Rexo payment failed');
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="p-10 text-center">Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="bg-[#fafaf8] py-12">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
              <h1 className="mb-8 text-4xl font-bold">Checkout Payment</h1>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-500">Tracking Number</p>
                  <p className="font-mono text-xl font-bold text-blue-600">
                    {order?.trackingNumber}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Order Total</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(order?.grandTotal || 0)}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Products</span>
                    <span>{formatCurrency(order?.subTotal || 0)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{formatCurrency(order?.deliveryFee || 0)}</span>
                  </div>

                  <div className="mt-3 flex justify-between border-t pt-3 font-bold">
                    <span>Grand Total</span>
                    <span>{formatCurrency(order?.grandTotal || 0)}</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500">Wallet Balance</p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(wallet)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Rexo Balance</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {formatRexo(rexo)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Equivalent Value: {formatCurrency(rexo * 500)}
                  </p>
                </div>

                {order?.address && (
                  <div className="border-t pt-6">
                    <h2 className="mb-4 text-xl font-bold">Delivery Address</h2>
                    <div className="space-y-2">
                      <p>
                        <strong>Recipient:</strong> {order.address.fullName}
                      </p>
                      <p>
                        <strong>Phone:</strong> {order.address.phone}
                      </p>
                      <p>
                        <strong>County:</strong> {order.address.county}
                      </p>
                      <p>
                        <strong>Town:</strong> {order.address.town}
                      </p>
                      {order.address.landmark && (
                        <p>
                          <strong>Landmark:</strong> {order.address.landmark}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h2 className="mb-4 text-xl font-bold">🎁 Gift Message</h2>

                  <textarea
                    rows={4}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Write a heartfelt message for the recipient..."
                    className="w-full resize-none rounded-2xl border p-4"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    This message will appear on the invoice and gift card.
                  </p>

                  <div className="mt-8 border-t pt-6">
                    <h2 className="mb-5 text-xl font-bold">
                      Choose Payment Method
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                      <button
                        onClick={payWithWallet}
                        className="rounded-2xl bg-black p-6 text-white shadow-lg transition hover:bg-gray-800"
                      >
                        <div className="text-lg font-bold">Pay with Wallet</div>
                        <div className="mt-1 text-sm text-gray-300">
                          Available: {formatCurrency(wallet)}
                        </div>
                      </button>

                      <button
                        onClick={payWithRexo}
                        className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shadow-lg transition hover:from-green-400 hover:to-emerald-500"
                      >
                        <div className="text-lg font-bold">Pay with Rexo</div>
                        <div className="mt-1 text-sm text-green-100">
                          Available: {formatRexo(rexo)}
                        </div>
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <button
                        disabled
                        className="cursor-not-allowed rounded-2xl bg-green-600 p-6 text-white opacity-50"
                      >
                        📱 M-Pesa
                        <div className="mt-1 text-sm">Coming Soon</div>
                      </button>

                      <button
                        disabled
                        className="cursor-not-allowed rounded-2xl bg-blue-600 p-6 text-white opacity-50"
                      >
                        💳 Bank / Card
                        <div className="mt-1 text-sm">Coming Soon</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AppLayout>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <AppLayout>
          <div className="p-10 text-center">Loading...</div>
        </AppLayout>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}