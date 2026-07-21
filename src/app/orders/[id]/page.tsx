'use client';

import Navbar from '@/components/Navbar';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {formatCurrency, formatRexo,} from '@/common/utils/currency.util';

export default function OrderDetailsPage() {

  const params = useParams();

  const orderId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;

  const [order, setOrder] =
    useState<any>(null);

const [giftMessage, setGiftMessage] =
  useState('');

  const [loading, setLoading] =
    useState(true);

useEffect(() => {

  if (!orderId) {
    setLoading(false);
    return;
  }

  async function loadOrder() {

    try {

      const token =
        localStorage.getItem('token');

      let response;

      if (token) {

        response = await api.get(
          `/orders/${orderId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      } else {

        response = await api.get(
          `/public-orders/${orderId}`,
        );

      }

      setOrder(response.data);

      setGiftMessage(
        response.data.giftMessage || '',
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  loadOrder();

}, [orderId]);

if (loading) {

  return (
    <>
      <Navbar />
      <div className="p-10 text-center text-xl">
        Loading Order...
      </div>
    </>
  );

}

if (!order) {

  return (
    <>
      <Navbar />
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold">
          Order Not Found
        </h1>
      </div>
    </>
  );

}

  const rexoEarned =
    order.paymentMethod === 'rexo'
      ? 0
      : Number(order.walletUsed || 0) / 5000;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 py-10">

        <div className="max-w-5xl mx-auto">

          <div className="bg-white shadow-2xl border border-gray-200">

            {/* HEADER */}

            <div className="border-b p-10">

              <div className="flex justify-between items-start">

                <div>
                  <h1 className="text-5xl font-serif font-bold text-gray-900">
                    INVOICE
                  </h1>
                  <p className="mt-3 text-gray-500">
                    Rexus Gift Shop
                  </p>
                  <p className="text-gray-500">
                    For Love, With Love.
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-gray-500">
                    Order Number
                  </p>

                  <p className="text-2xl font-bold">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>

                  <div className="mt-4">

                    <p className="text-gray-500 mb-2">
                      Tracking Number
                    </p>

                    <div className="flex items-center gap-3">

                      <span className="inline-block bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl font-mono font-bold">
                        {order.trackingNumber || 'Not Assigned'}
                      </span>

                      {order.trackingNumber && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(order.trackingNumber);
                            toast.success('Tracking number copied');
                          }}
                          className="border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 transition"
                        >
                          📋
                        </button>
                      )}

                    </div>

                  </div>

                  {order.giftAmbassador && (

  <div className="mt-6">

    <p className="text-gray-500">
      Gift Ambassador
    </p>

    <p className="font-semibold">
      {order.giftAmbassador.name}
    </p>

    <p>
      {order.giftAmbassador.phone}
    </p>

    {order.giftAmbassador
      .vehicleNumber && (

      <p>

        Vehicle:
        {' '}
        {
          order.giftAmbassador
            .vehicleNumber
        }

      </p>

    )}

  </div>

)}

                  <p className="mt-4 text-gray-500">
                    Date
                  </p>

                  <p>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                </div>

              </div>

            </div>

            {/* STATUS */}

            <div className="p-8 border-b flex justify-between items-center">

              <span className="font-semibold">
                Order Status
              </span>

              <span
                className={`px-4 py-2 rounded-full text-white font-semibold ${
                  order.status === 'pending'
                    ? 'bg-yellow-500'
                  : order.status === 'paid'
                    ? 'bg-green-500'
                  : order.status === 'processing'
                    ? 'bg-blue-500'
                  : order.status === 'ready_for_dispatch'
                    ? 'bg-purple-500'
                  : order.status === 'out_for_delivery'
                    ? 'bg-orange-500'
                  : order.status === 'delivered'
                    ? 'bg-emerald-600'
                  : 'bg-red-500'
                }`}
              >
                {order.status.replaceAll('_', ' ').toUpperCase()}
              </span>

            </div>

           {/* CUSTOMER & RECIPIENT */}

<div className="p-8 border-b">

  <div className="grid md:grid-cols-2 gap-12">


{/* CUSTOMER */}

<div>

  <h3 className="text-red-300 uppercase text-xs tracking-[4px] font-bold mb-5">

    Customer

  </h3>

  <div className="space-y-2">

    <p className="font-semibold text-lg">
      {order.customerName || '-'}
    </p>

    <p className="text-gray-600">
      {order.customerPhone || '-'}
    </p>

    <p className="text-gray-600">
      {order.customerEmail || '-'}
    </p>

  </div>

</div>

{/* RECIPIENT */}

<div>

  <h3 className="text-red-300 uppercase text-xs tracking-[4px] font-bold mb-5">

    Recipient

  </h3>

  <div className="space-y-2">

    <p className="font-semibold text-lg">
      {order.recipientName || '-'}
    </p>

    <p className="text-gray-600">
      {order.recipientPhone || '-'}
    </p>

  </div>

</div>


  </div>

</div>

            {order.giftMessage && (

  <div className="p-8 border-b">

    <h2 className="text-2xl font-bold mb-4">
      🎁 Gift Message
    </h2>

    <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6">

      <p className="italic whitespace-pre-wrap">
        {order.giftMessage}
      </p>

    </div>

  </div>

)}

            {/* ADDRESS */}

            <div className="p-8 border-b">

              <h2 className="text-2xl font-bold mb-6">
                Delivery Address
              </h2>

              <div className="space-y-2">
                <p><strong>County:</strong> {order.address?.county || 'N/A'}</p>
                <p><strong>Town:</strong> {order.address?.town || 'N/A'}</p>
                <p><strong>Estate:</strong> {order.address?.estate || '-'}</p>
                <p><strong>Building:</strong> {order.address?.building || '-'}</p>
                <p><strong>Landmark:</strong> {order.address?.landmark || '-'}</p>
                <p><strong>Instructions:</strong> {order.address?.deliveryInstructions || '-'}</p>
              </div>

            </div>

            {/* ITEMS */}

            <div className="p-8 border-b">

              <h2 className="text-2xl font-bold mb-6">
                Ordered Items
              </h2>

              <table className="w-full">
<thead>
 
  <tr className="border-b">

    <th className="text-left py-3">
      Product
    </th>

    <th className="text-center py-3">
      Qty
    </th>

    <th className="text-right py-3">
      Unit Price
    </th>

    <th className="text-right py-3">
      Total
    </th>

  </tr>

</thead>

                <tbody>
                  {order.items?.map((item: any) => (
                    <tr key={item.id} className="border-b">

                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <span className="font-medium">
                            {item.product.name}
                          </span>
                        </div>
                      </td>

                      <td className="text-center">
                        {item.quantity}
                      </td>

                      <td className="text-right">
  {formatCurrency(item.price)}
</td>

<td className="text-right font-semibold">
  {formatCurrency(
    item.price * item.quantity,
  )}
</td>

                    </tr>
                  ))}
                </tbody>

              </table>

<div className="mt-8 border-t pt-6">

  <div className="space-y-3 max-w-md ml-auto">

 <div className="flex justify-between">

  <span>
    Subtotal
  </span>

  <span>
    {formatCurrency(
      order.subTotal || 0
    )}
  </span>

</div>

    <div className="flex justify-between">

      <span>
        Delivery Fee
      </span>

      <span>
        {formatCurrency(
          order.deliveryFee || 0,
        )}
      </span>

    </div>

    <div className="flex justify-between">

      <span>
        Wallet Used
      </span>

      <span>
        {formatCurrency(
          order.walletUsed || 0,
        )}
      </span>

    </div>

    <div className="flex justify-between">

      <span>
        Rexo Used
      </span>

      <span>
        {formatRexo(
          order.rexoUsed || 0,
        )}
      </span>

    </div>

    <div className="border-t pt-4 flex justify-between text-2xl font-bold">

      <span>
        GRAND TOTAL
      </span>

      <span>
{formatCurrency(
  order.grandTotal || 0
)}
      </span>

    </div>

  </div>

</div>


            </div>

            {/* PAYMENT */}

            <div className="p-8 border-b">

              <h2 className="text-2xl font-bold mb-6">
                Payment Information
              </h2>

              <div className="space-y-3">

                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span>{order.paymentMethod || 'Wallet'}</span>
                </div>

                <div className="flex justify-between">
                  <span>Wallet Used</span>
                  <span>{formatCurrency(order.walletUsed || 0)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Rexo Used</span>
                  <span>{formatRexo(order.rexoUsed || 0)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(order.deliveryFee || 0)}</span>
                </div>

              </div>

            </div>

            {/* REXO */}

            <div className="p-8 border-b">

              <h2 className="text-2xl font-bold mb-6">
                Rexo Rewards
              </h2>

              <p>
                Earned:{' '}
                <strong>{rexoEarned.toFixed(2)} Rexo</strong>
              </p>

            </div>

           {/* DELIVERY TRACKER */}

<div className="p-8 border-b">

  <h2 className="text-2xl font-bold mb-8">
    Delivery Progress
  </h2>

  <div className="relative ml-4">

    <div className="absolute left-3 top-0 bottom-0 w-1 bg-gray-200"></div>

    {[
      {
        label: 'Order Received',
        active: true,
        date: order.createdAt,
      },

      {
        label: 'Payment Confirmed',
        active: [
          'paid',
          'processing',
          'ready_for_dispatch',
          'out_for_delivery',
          'delivered',
        ].includes(order.status),
        date: order.createdAt,
      },

      {
        label: 'Preparing Gift',
        active: [
          'processing',
          'ready_for_dispatch',
          'out_for_delivery',
          'delivered',
        ].includes(order.status),
        date: order.processedAt,
      },

      {
        label: 'Ready For Dispatch',
        active: [
          'ready_for_dispatch',
          'out_for_delivery',
          'delivered',
        ].includes(order.status),
        date: order.readyForDispatchAt,
      },

      {
        label: 'Out For Delivery',
        active: [
          'out_for_delivery',
          'delivered',
        ].includes(order.status),
        date: order.outForDeliveryAt,
      },

      {
        label: 'Delivered',
        active:
          order.status === 'delivered',
        date: order.deliveredAt,
      },
    ].map((step) => (

      <div
        key={step.label}
        className="flex gap-5 mb-8 relative"
      >

        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${
            step.active
              ? 'bg-green-500 text-white'
              : 'bg-gray-300'
          }`}
        >
          {step.active ? '✓' : ''}
        </div>

        <div>

          <p
            className={`font-medium ${
              step.active
                ? 'text-black'
                : 'text-gray-400'
            }`}
          >
            {step.label}
          </p>

          {step.date && (

            <p className="text-sm text-gray-500 mt-1">

              {new Date(
                step.date,
              ).toLocaleString()}

            </p>

          )}

        </div>

      </div>

    ))}

  </div>

</div>

{/* DELIVERY NOTES */}

<div className="p-8 border-b">

  <h2 className="text-2xl font-bold mb-4">
    Delivery Updates
  </h2>

  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

    {order.deliveryNote ? (

      <p className="text-blue-900">
        {order.deliveryNote}
      </p>

    ) : (

      <p className="text-gray-500">
        No delivery updates yet.
      </p>

    )}

  </div>

</div>

{/* ORDER UPDATES */}

<div className="p-8 border-b">

  <h2 className="text-2xl font-bold mb-6">
    Order Updates
  </h2>

  <div className="space-y-5">

    {order.updates?.length ? (

      order.updates.map(
        (update: any) => (

          <div
            key={update.id}
            className="border-l-4 border-blue-500 pl-4 py-1"
          >

            <p className="font-medium">
              {update.message}
            </p>

            <p className="text-sm text-gray-500 mt-1">

              {new Date(
                update.createdAt,
              ).toLocaleString()}

            </p>

          </div>

        ),
      )

    ) : (

      <p className="text-gray-500">
        No updates available yet.
      </p>

    )}

  </div>

</div>

            {/* TOTAL */}

            <div className="p-10 bg-gray-50">

              <div className="text-right">

                <p className="text-gray-500 text-lg">
                  GRAND TOTAL
                </p>

                <h2 className="text-5xl font-bold mt-2">
  {formatCurrency(order.grandTotal || 0)}
</h2>

              </div>

            </div>

          </div>

        </div>

      </main>
    </>
  );
}