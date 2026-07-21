'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import api from '@/lib/api';
import AppLayout from '@/components/layout/AppLayout';
import Container from '@/components/layout/Container';

import { Package } from 'lucide-react';
import { formatCurrency } from '@/common/utils/currency.util';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;

  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  grandTotal: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      const { data } = await api.get('/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <AppLayout>

      <section className="py-10">

        <Container>

          <div className="mb-10">

            <h1 className="text-4xl font-black">
              My Orders
            </h1>

            <p className="mt-2 text-gray-500">
              Track every gift you've purchased.
            </p>

          </div>

          {loading && (
            <div className="py-24 text-center">
              Loading orders...
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-section bg-white py-24">

              <Package
                size={70}
                className="mb-5 text-rexo-teal"
              />

              <h2 className="text-3xl font-bold">
                No Orders Yet
              </h2>

              <p className="mt-3 text-gray-500">
                Your future orders will appear here.
              </p>

              <Link
                href="/"
                className="
                  mt-8
                  rounded-full
                  bg-rexo-teal
                  px-8
                  py-4
                  font-semibold
                  text-white
                  transition
                  hover:bg-rexo-teal-dark
                "
              >
                Start Shopping
              </Link>

            </div>
          )}

          <div className="space-y-6">

            {orders.map((order) => (

              <Link
                key={order.id}
                href={`/orders/${order.id}`}
              >

                <article
                  className="
                    rounded-section
                    bg-white
                    p-8
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-card
                  "
                >

                  <div className="mb-6 flex items-center justify-between">

                    <div>

                      <h2 className="text-xl font-bold">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>

                    </div>

                    <span
                      className={`
                        rounded-full
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        ${
                          order.status === 'paid'
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }
                      `}
                    >
                      {order.status}
                    </span>

                  </div>

                  <div className="space-y-4">

                    {order.items?.map((item) => (

                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >

                        <div className="flex items-center gap-4">

                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-16 w-16 rounded-xl object-cover"
                          />

                          <div>

                            <h3 className="font-semibold">
                              {item.product.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>

                          </div>

                        </div>

                        <span className="font-semibold">
                          {formatCurrency(item.price)}
                        </span>

                      </div>

                    ))}

                  </div>

                  <div className="mt-8 border-t pt-6 text-right">

                    <p className="text-sm text-gray-500">
                      Order Total
                    </p>

                    <h3 className="text-2xl font-black">
                      {formatCurrency(order.grandTotal ?? 0)}
                    </h3>

                  </div>

                </article>

              </Link>

            ))}

          </div>

        </Container>

      </section>

    </AppLayout>
  );
}