'use client';

import Link from 'next/link';

import {
  User,
  Wallet,
  ShoppingBag,
  Gift,
  MapPin,
  Bell,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

import AppLayout from '@/components/layout/AppLayout';
import Container from '@/components/layout/Container';

import { useApp } from '@/context/AppContext';

import {
  formatCurrency,
  formatRexo,
} from '@/common/utils/currency.util';

export default function ProfilePage() {
  const {
    wallet,
    rexo,
    cartCount,
    user,
  } = useApp();

  const firstName =
    user?.firstName ??
    user?.name?.split(' ')[0] ??
    'Friend';

  const greeting = (() => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';

    if (hour < 18) return 'Good Afternoon';

    return 'Good Evening';
  })();

  return (
    <AppLayout>

      <main className="min-h-screen bg-rexo-background py-12">

        <Container>

          {/* HERO */}

          <section
            className="
              overflow-hidden
              rounded-section
              bg-gradient-luxury
              p-10
              text-white
              shadow-luxury
            "
          >

            <div
              className="
                flex
                flex-col
                gap-10
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >

              <div className="max-w-2xl">

                <p className="mb-3 text-lg opacity-90">
                  {greeting},
                </p>

                <h1 className="text-5xl font-black">
                  {firstName} 👋
                </h1>

                <p className="mt-6 text-lg leading-8 opacity-95">

                  Ready to make someone's day?

                  <br />

                  Discover beautiful gifts, track your
                  deliveries, manage recipients and
                  keep everything in one elegant place.

                </p>

                <Link
                  href="/"
                  className="
                    mt-8
                    inline-flex
                    items-center
                    gap-3
                    rounded-pill
                    bg-white
                    px-8
                    py-4
                    font-semibold
                    text-rexo-primary
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-card
                  "
                >

                  Explore Gifts

                  <ArrowRight size={18} />

                </Link>

              </div>

              <Link href="/profile/edit">

                <div
                  className="
                    flex
                    h-36
                    w-36
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-full
                    bg-white/20
                    backdrop-blur
                    transition-all
                    duration-300
                    hover:scale-105
                  "
                >

                  <User size={60} />

                </div>

              </Link>

            </div>

          </section>

          {/* QUICK STATS */}

          <section className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-card bg-white p-8 shadow-card">

              <Wallet
                size={34}
                className="mb-5 text-rexo-primary"
              />

              <p className="text-rexo-muted">
                Wallet Balance
              </p>

              <h2 className="mt-2 text-4xl font-black">
                {formatCurrency(wallet)}
              </h2>

            </div>

            <div className="rounded-card bg-white p-8 shadow-card">

              <CreditCard
                size={34}
                className="mb-5 text-rexo-secondary"
              />

              <p className="text-rexo-muted">
                Rexo Coins
              </p>

              <h2 className="mt-2 text-4xl font-black text-rexo-secondary">
                {formatRexo(rexo)}
              </h2>

            </div>

            <div className="rounded-card bg-white p-8 shadow-card">

              <ShoppingBag
                size={34}
                className="mb-5 text-rexo-primary"
              />

              <p className="text-rexo-muted">
                Shopping Cart
              </p>

              <h2 className="mt-2 text-4xl font-black">
                {cartCount}
              </h2>

            </div>

          </section>

          {/* QUICK ACTIONS */}

          <section
            className="
              mt-12
              rounded-section
              bg-white
              p-10
              shadow-card
            "
          >

            <h2 className="mb-8 text-3xl font-black">
              Quick Actions
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <AccountCard
                href="/orders"
                title="Orders"
                description="Track all your purchases and deliveries."
                icon={<ShoppingBag size={28} />}
              />

              <AccountCard
                href="/recipients"
                title="Recipients"
                description="Manage everyone you send gifts to."
                icon={<Gift size={28} />}
              />

              <AccountCard
                href="/addresses"
                title="Addresses"
                description="Manage your delivery locations."
                icon={<MapPin size={28} />}
              />

              <AccountCard
                href="/notifications"
                title="Notifications"
                description="Gift reminders and order updates."
                icon={<Bell size={28} />}
              />

            </div>

          </section>

        </Container>

      </main>

    </AppLayout>
  );
}

interface AccountCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function AccountCard({
  href,
  title,
  description,
  icon,
}: AccountCardProps) {
  return (
    <Link href={href}>

      <article
        className="
          group
          flex
          h-full
          flex-col
          justify-between
          rounded-card
          border
          border-rexo
          bg-white
          p-7
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-luxury
        "
      >

        <div>

          <div
            className="
              mb-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-rexo-primary/10
              text-rexo-primary
              transition-all
              duration-300
              group-hover:bg-rexo-primary
              group-hover:text-white
            "
          >
            {icon}
          </div>

          <h3 className="text-xl font-bold text-rexo">
            {title}
          </h3>

          <p className="mt-3 leading-7 text-rexo-muted">
            {description}
          </p>

        </div>

        <div
          className="
            mt-8
            flex
            items-center
            justify-between
            border-t
            border-rexo
            pt-5
            text-rexo-primary
            transition-all
            duration-300
            group-hover:translate-x-1
          "
        >

          <span className="font-semibold">
            Open
          </span>

          <ArrowRight size={18} />

        </div>

      </article>

    </Link>
  );
}