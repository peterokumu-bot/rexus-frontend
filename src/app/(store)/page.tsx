'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '@/lib/api';

import { useApp } from '@/context/AppContext';
import { Product } from '@/types/product';

import Container from '@/components/layout/Container';

import Hero from '@/components/hero/Hero';

import CatalogItem from '@/components/catalog/CatalogItem';

interface GuestCartItem {
  productId: string;
  quantity: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { refreshAppData } = useApp();

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load products.');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = async (productId: string) => {
    const token = localStorage.getItem('token');

    try {
      // -------------------------
      // Guest Cart
      // -------------------------

      if (!token) {
        const guestCart: GuestCartItem[] = JSON.parse(
          localStorage.getItem('guestCart') ?? '[]',
        );

        const existing = guestCart.find(
          (item) => item.productId === productId,
        );

        if (existing) {
          existing.quantity += 1;
        } else {
          guestCart.push({
            productId,
            quantity: 1,
          });
        }

        localStorage.setItem(
          'guestCart',
          JSON.stringify(guestCart),
        );

        refreshAppData();

        toast.success('Added to cart');

        return;
      }

      // -------------------------
      // Logged-in User
      // -------------------------

      await api.post(
        '/orders/cart/add',
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      refreshAppData();

      toast.success('Added to cart');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add item.');
    }
  };

 return (
  <>

      <Hero />

      {/* ========================= */}
      {/* Trending Products */}
      {/* ========================= */}

  {/* ========================= */}
{/* Trending Products */}
{/* ========================= */}

<section className="bg-white py-10">

  <Container className="max-w-[1920px]">

    <div className="mb-6 flex items-center justify-between">

      <div>

        <h2 className="text-2xl font-bold tracking-tight">
          Trending Gifts
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Discover premium gifts for every occasion.
        </p>

      </div>

    </div>

    <div
      className="
        grid
        grid-cols-2
        gap-x-3
        gap-y-8

        sm:grid-cols-3

        md:grid-cols-4

        lg:grid-cols-5

        xl:grid-cols-6

        2xl:grid-cols-7
      "
    >

      {products.map((product) => (
        <CatalogItem
          key={product.id}
          product={product}
        />
      ))}

    </div>

  </Container>

</section>

     </>
  );
}