'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

function GuestPaymentContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [waitingPayment, setWaitingPayment] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await api.get(`/guest-checkout/order/${orderId}`);
        setOrder(response.data);
        setMpesaPhone(response.data.customerPhone || '');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  useEffect(() => {

  if (
    !waitingPayment ||
    !order
  ) {
    return;
  }

  const interval =
    setInterval(
      async () => {

        try {

          const response =
            await api.get(
              `/public-orders/${order.id}/status`,
            );

          console.log(
            'Payment Status:',
            response.data.status,
          );

          if (
            response.data.status ===
            'paid'
          ) {

            clearInterval(
              interval,
            );

            router.push(
              `/orders/${order.id}`,
            );

          }

        } catch (error) {

          console.error(
            error,
          );

        }

      },
      3000,
    );

  return () =>
    clearInterval(
      interval,
    );

}, [
  waitingPayment,
  order,
  router,
]);


 async function payWithMpesa() {

  try {

    const response =
      await api.post(
        '/payments/stk-push',
        {
          phone:
            mpesaPhone,
          amount:
            order.grandTotal,
          orderId:
            order.id,
        },
      );

    if (
      response.data.ResponseCode ===
      '0'
    ) {

      setWaitingPayment(
        true,
      );

    } else {

      alert(
        'Failed to send STK Push',
      );

    }

  } catch (error) {

    console.error(
      error,
    );

    alert(
      'Payment failed',
    );

  }
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    );
  }

 const productsTotal =
  order.subTotal || 0;

  return (
    <main className="min-h-screen bg-black/40 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold">Guest Checkout</h1>
          <p className="mt-1 text-white/90">Review your order before payment</p>
          <div className="mt-4 inline-flex bg-white/20 rounded-xl px-4 py-2">
            <div>
              <p className="text-xs">Order Number</p>
              <p className="font-bold font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* CUSTOMER + RECIPIENT */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <h2 className="font-semibold text-base mb-2">👤 Customer</h2>
              <p className="font-semibold">{order.customerName}</p>
              <p className="text-gray-600">{order.customerPhone}</p>
              <p className="text-gray-600">{order.customerEmail}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <h2 className="font-semibold text-base mb-2">🎁 Recipient</h2>
              <p className="font-semibold">{order.recipientName}</p>
              <p className="text-gray-600">{order.recipientPhone}</p>
            </div>
          </div>

          {/* DELIVERY */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h2 className="font-semibold text-base mb-2">🚚 Delivery Address</h2>
            <p>
              {order.address?.county}, {order.address?.town}
            </p>
            {order.address?.estate && <p>Estate: {order.address.estate}</p>}
            {order.address?.building && <p>Building: {order.address.building}</p>}
          </div>

          {/* ITEMS */}
          <div>
            <h2 className="font-bold text-lg mb-3">🎀 Ordered Gifts</h2>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="border rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-bold">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL */}
          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="flex justify-between mb-2">
              <span>Products</span>
              <span>
  KES {order.subTotal.toLocaleString()}
</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery</span>
              <span>KES {order.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="border-t pt-3 mt-3 flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span className="text-pink-600">
  KES {order.grandTotal.toLocaleString()}
</span>
            </div>
          </div>

          {/* PAYMENT */}
          <div>
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">M-Pesa Number</label>
              <input
                type="text"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="2547XXXXXXXX"
                className="w-full border rounded-xl p-4"
              />
              <p className="text-xs text-gray-500 mt-2">
                We'll send the payment request to this number.
              </p>
            </div>

            <h2 className="font-bold text-lg mb-4">Payment Method</h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={payWithMpesa}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold"
              >
                📱 Pay with M-Pesa
              </button>

              <button className="w-full bg-gray-100 hover:bg-gray-200 py-4 rounded-xl font-bold">
                💳 Card Payment
              </button>
            </div>

            {waitingPayment && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                ✅ M-Pesa request sent. Please complete payment on your phone.
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

export default function GuestPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GuestPaymentContent />
    </Suspense>
  );
}