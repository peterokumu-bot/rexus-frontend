'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/api';
import AppLayout from '@/components/layout/AppLayout';
import Container from '@/components/layout/Container';

import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import DeliveryAddress from '@/components/cart/DeliveryAddress';
import GuestCheckoutModal from '@/components/cart/GuestCheckoutModal';
import EmptyCart from '@/components/cart/EmptyCart';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const router = useRouter();
  const { refreshAppData } = useApp();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsGuest(true);
      loadGuestCart().finally(() => setLoading(false));
      return;
    }

    Promise.all([fetchCart(), fetchAddresses()]).finally(() => setLoading(false));
  }, []);

  async function loadGuestCart() {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

    if (!guestCart.length) {
      setCart([]);
      return;
    }

    try {
      const products = await api.get('/products');

      const cartItems = guestCart.map((guestItem: any) => {
        const product = products.data.find((p: any) => p.id === guestItem.productId);

        return {
          id: guestItem.productId,
          productId: guestItem.productId,
          quantity: guestItem.quantity,
          product,
        };
      });

      setCart(cartItems);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchCart() {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/orders/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAddresses() {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);

      const defaultAddress = response.data.find((address: any) => address.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateQuantity(cartItemId: string, quantity: number) {
    // GUEST CART
    if (isGuest) {
      let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

      if (quantity <= 0) {
        guestCart = guestCart.filter((item: any) => item.productId !== cartItemId);
      } else {
        guestCart = guestCart.map((item: any) =>
          item.productId === cartItemId ? { ...item, quantity } : item,
        );
      }

      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      await loadGuestCart();
      refreshAppData();
      toast.success('Cart updated');
      return;
    }

    // LOGGED IN USERS
    try {
      const token = localStorage.getItem('token');

      await api.patch(
        `/orders/cart/${cartItemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await fetchCart();
      refreshAppData();
      toast.success('Cart updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update cart');
    }
  }

  async function checkout() {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await api.post(
        '/orders/checkout',
        { addressId: selectedAddress },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      router.push(`/checkout/payment?orderId=${response.data.order.id}`);
      fetchCart();
    } catch (error) {
      console.error(error);
      toast.error('Checkout failed');
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item?.product?.price || 0) * Number(item?.quantity || 0),
    0,
  );

  if (loading) {
    return <div className="p-10 text-xl">Loading cart...</div>;
  }

  return (
    <AppLayout>

      <section className="py-10">

  <Container>
         <div className="mb-10">

  <h1 className="text-4xl font-black">
    Shopping Cart
  </h1>

  <p className="mt-2 text-gray-500">
    Review your items before checkout.
  </p>
<div
  className="
    grid
    grid-cols-1
    gap-10
    lg:grid-cols-3
  "
>
            {/* CART ITEMS */}

<section
  className="
    space-y-6
    lg:col-span-2
  "
>

  {cart.length === 0 ? (

    <EmptyCart />

  ) : (

    cart.map((item) => (

      <CartItem
        key={item.id}
        item={item}
        isGuest={isGuest}
        onUpdateQuantity={updateQuantity}
      />

    ))

  )}
  </section>

</div>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              {/* DELIVERY ADDRESS — LOGGED IN USERS */}
            {/* DELIVERY ADDRESS */}

{!isGuest && (

  <DeliveryAddress
    addresses={addresses}
    selectedAddress={selectedAddress}
    onSelect={setSelectedAddress}
    onAddAddress={() =>
      router.push('/addresses')
    }
  />

)}
              {/* GUEST CHECKOUT INFO */}
              {isGuest && (
                <div className="bg-pink-50 border border-pink-200 rounded-3xl p-6">
                  <h2 className="font-bold text-lg mb-2">Guest Checkout</h2>
                  <p className="text-gray-600">
                    Delivery details will be collected in the next step.
                  </p>
                </div>
              )}
{/* TOTAL + CHECKOUT */}
              <CartSummary
  total={total}
  isGuest={isGuest}
  onCheckout={() => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }

    checkout();
  }}
/>
        {/* GUEST MODAL */}
<GuestCheckoutModal
  open={showGuestModal}
  onClose={() => setShowGuestModal(false)}
  onLogin={() => router.push('/login')}
  onRegister={() => router.push('/register')}
  onGuestCheckout={() =>
    router.push('/guest-checkout')
  }
/>
</aside>
</div>
         </Container>
        
</section>
  </AppLayout>
  );
}