'use client';

import AppLayout from '@/components/layout/AppLayout';
import Container from '@/components/layout/Container';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatRexo } from '@/common/utils/currency.util';

export default function PaymentPage() {
  const { wallet, rexo } = useApp();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [giftMessage, setGiftMessage] = useState('');

  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    async function loadOrder() {
      try {
        const token = localStorage.getItem('token');

        const response = await api.get(`/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(response.data);
        setGiftMessage(response.data.giftMessage || '');
      } catch (error) {
        console.error(error);
        toast.error('Failed to load order');
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  async function payWithWallet() {
    try {
      const token = localStorage.getItem('token');

      await api.post(
        `/wallet/pay/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success('Payment successful');
      window.location.href = `/order-success?orderId=${orderId}`;
    } catch (error) {
      console.error(error);
      toast.error('Payment failed');
    }
  }

  async function payWithRexo() {
    try {
      const token = localStorage.getItem('token');

      const response = await api.post(
        `/wallet/pay-rexo/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.fullyPaid) {
        toast.success('Order paid successfully with Rexo');
        window.location.href = `/order-success?orderId=${orderId}`;
        return;
      }

      const remaining = response.data.remainingAmount;

      const confirmWallet = window.confirm(
        `Rexo applied successfully.\n\nRemaining Balance: KES ${remaining.toFixed(2)}\n\nWould you like to pay the balance using Wallet?`,
      );

      if (confirmWallet) {
        await api.post(
          `/wallet/pay/${orderId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success('Remaining balance paid successfully');
        window.location.href = `/order-success?orderId=${orderId}`;
      }
    } catch (error) {
      console.error(error);
      toast.error('Rexo payment failed');
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <AppLayout>

      <section className="bg-[#fafaf8] py-12">
  <Container>

    <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h1 className="text-4xl font-bold mb-8">Checkout Payment</h1>

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
  {formatCurrency(
    order?.grandTotal || 0,
  )}
</p>
              </div>


<div className="mt-4 space-y-2">

  <div className="flex justify-between">

    <span>
      Products
    </span>

<span>
  {formatCurrency(
    order?.subTotal || 0,
  )}
</span>
  </div>

  <div className="flex justify-between">

    <span>
      Delivery Fee
    </span>

    <span>
      {formatCurrency(
        order?.deliveryFee || 0,
      )}
    </span>

    <div className="flex justify-between font-bold border-t pt-3 mt-3">

  <span>
    Grand Total
  </span>

  <span>
    {formatCurrency(
      order?.grandTotal || 0,
    )}
  </span>

</div>

  </div>

</div>

              <div>
                <p className="text-gray-500">Wallet Balance</p>
                <p className="text-2xl font-semibold">{formatCurrency(wallet)}</p>
              </div>

              <div>
                <p className="text-gray-500">Rexo Balance</p>
                <p className="text-2xl font-semibold text-green-600">{formatRexo(rexo)}</p>
                <p className="text-sm text-gray-500">
                  Equivalent Value: {formatCurrency(rexo * 500)}
                </p>
              </div>

              {order?.address && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                  <div className="space-y-2">
                    <p><strong>Recipient:</strong> {order.address.fullName}</p>
                    <p><strong>Phone:</strong> {order.address.phone}</p>
                    <p><strong>County:</strong> {order.address.county}</p>
                    <p><strong>Town:</strong> {order.address.town}</p>
                    {order.address.landmark && (
                      <p><strong>Landmark:</strong> {order.address.landmark}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">🎁 Gift Message</h2>

                <textarea
                  rows={4}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Write a heartfelt message for the recipient..."
                  className="w-full border rounded-2xl p-4 resize-none"
                />

                <p className="text-sm text-gray-500 mt-2">
                  This message will appear on the invoice and gift card.
                </p>

                <div className="mt-8 border-t pt-6">

  <h2 className="text-xl font-bold mb-5">
    Choose Payment Method
  </h2>

  <div className="grid md:grid-cols-2 gap-4">

    <button
      onClick={payWithWallet}
      className="bg-black hover:bg-gray-800 text-white rounded-2xl p-6 shadow-lg transition"
    >

      <div className="font-bold text-lg">
        Pay with Wallet
      </div>

      <div className="text-sm text-gray-300 mt-1">
        Available:
        {' '}
        {formatCurrency(wallet)}
      </div>
    </button>

    <button
      onClick={payWithRexo}
      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-2xl p-6 shadow-lg transition"
    >

      <div className="font-bold text-lg">
        Pay with Rexo
      </div>

      <div className="text-sm text-green-100 mt-1">
        Available:
        {' '}
        {formatRexo(rexo)}
      </div>
    </button>

  </div>

  <div className="grid md:grid-cols-2 gap-4 mt-4">

    <button
      disabled
      className="bg-green-600 text-white rounded-2xl p-6 opacity-50 cursor-not-allowed"
    >
      📱 M-Pesa
      <div className="text-sm mt-1">
        Coming Soon
      </div>
    </button>

    <button
      disabled
      className="bg-blue-600 text-white rounded-2xl p-6 opacity-50 cursor-not-allowed"
    >
      💳 Bank / Card
      <div className="text-sm mt-1">
        Coming Soon
      </div>
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