'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
    >
      <path
        d="M3 1.5L7.5 5 3 8.5"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 1.5c-2.1 0-3.6 1.7-3.6 3.8v2.4c0 .6-.2 1.2-.6 1.7L3.5 11c-.4.5-.1 1.3.5 1.3h10c.6 0 .9-.8.5-1.3l-1.3-1.6c-.4-.5-.6-1.1-.6-1.7V5.3c0-2.1-1.5-3.8-3.6-3.8z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M7.2 14.2a1.8 1.8 0 0 0 3.6 0"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

const PRODUCTS_PATHS = ['/admin/products', '/admin/categories', '/admin/subcategories'];
const CUSTOMERS_PATHS = ['/admin/customers', '/admin/recipients', '/admin/ambassadors'];
const PAYMENTS_PATHS = ['/admin/payments', '/admin/invoices'];
const SETTINGS_PATHS = ['/admin/settings'];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [now, setNow] = useState(() => new Date());

  const [productsOpen, setProductsOpen] = useState(() =>
    PRODUCTS_PATHS.some((path) => pathname.startsWith(path)),
  );
  const [customersOpen, setCustomersOpen] = useState(() =>
    CUSTOMERS_PATHS.some((path) => pathname.startsWith(path)),
  );
  const [paymentsOpen, setPaymentsOpen] = useState(() =>
    PAYMENTS_PATHS.some((path) => pathname.startsWith(path)),
  );
  const [settingsOpen, setSettingsOpen] = useState(() =>
    SETTINGS_PATHS.some((path) => pathname.startsWith(path)),
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navClass = (path: string) =>
    pathname.startsWith(path)
      ? 'bg-[#C9A227]/10 text-[#E3C567] border-l-2 border-[#C9A227]'
      : 'text-slate-300 hover:bg-white/5 border-l-2 border-transparent';

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF7F2] font-sans text-[#1A1A1A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Fraunces', Georgia, serif; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* LEFT SIDEBAR */}
      <aside className="flex w-64 flex-col border-r border-black/40 bg-gradient-to-b from-[#0B1220] via-[#0F1B2D] to-[#0B1220] text-white">
        <div className="border-b border-white/10 p-6">
          <h1 className="font-serif text-2xl font-semibold tracking-wide">
            REXUS
          </h1>
          <div className="mt-2 h-px w-8 bg-[#C9A227]" />
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
            Admin Center
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 text-sm">
          <Link
            href="/admin"
            className={`block px-4 py-3 transition ${
              pathname === '/admin'
                ? 'border-l-2 border-[#C9A227] bg-[#C9A227]/10 text-[#E3C567]'
                : 'border-l-2 border-transparent text-slate-300 hover:bg-white/5'
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/search"
            className={`mt-1 block px-4 py-3 transition ${navClass('/admin/search')}`}
          >
            Global Search
          </Link>

          <button
            type="button"
            onClick={() => setProductsOpen(!productsOpen)}
            className="mt-4 flex w-full items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.15em] text-slate-300 hover:bg-white/5"
          >
            <span>Products</span>
            <Chevron open={productsOpen} />
          </button>
          {productsOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
              <Link href="/admin/products" className={`block px-3 py-2 transition ${navClass('/admin/products')}`}>
                Products
              </Link>
              <Link href="/admin/categories" className={`block px-3 py-2 transition ${navClass('/admin/categories')}`}>
                Categories
              </Link>
              <Link href="/admin/subcategories" className={`block px-3 py-2 transition ${navClass('/admin/subcategories')}`}>
                Sub Categories
              </Link>
            </div>
          )}

          <Link
            href="/admin/orders"
            className={`mt-4 block px-4 py-3 transition ${navClass('/admin/orders')}`}
          >
            Orders
          </Link>

          <button
            type="button"
            onClick={() => setCustomersOpen(!customersOpen)}
            className="mt-4 flex w-full items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.15em] text-slate-300 hover:bg-white/5"
          >
            <span>Customers</span>
            <Chevron open={customersOpen} />
          </button>
          {customersOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
              <Link href="/admin/customers" className={`block px-3 py-2 transition ${navClass('/admin/customers')}`}>
                Customers
              </Link>
              <Link href="/admin/recipients" className={`block px-3 py-2 transition ${navClass('/admin/recipients')}`}>
                Recipients
              </Link>
              <Link href="/admin/ambassadors" className={`block px-3 py-2 transition ${navClass('/admin/ambassadors')}`}>
                Gift Ambassadors
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setPaymentsOpen(!paymentsOpen)}
            className="mt-4 flex w-full items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.15em] text-slate-300 hover:bg-white/5"
          >
            <span>Payments</span>
            <Chevron open={paymentsOpen} />
          </button>
          {paymentsOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
              <Link href="/admin/payments" className={`block px-3 py-2 transition ${navClass('/admin/payments')}`}>
                Payments
              </Link>
              <Link href="/admin/invoices" className={`block px-3 py-2 transition ${navClass('/admin/invoices')}`}>
                Invoices
              </Link>
            </div>
          )}

          <Link
            href="/admin/analytics"
            className={`mt-4 block px-4 py-3 transition ${navClass('/admin/analytics')}`}
          >
            Analytics
          </Link>

          <button
            type="button"
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="mt-4 flex w-full items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.15em] text-slate-300 hover:bg-white/5"
          >
            <span>Settings</span>
            <Chevron open={settingsOpen} />
          </button>
          {settingsOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
              <Link href="/admin/settings" className={`block px-3 py-2 transition ${navClass('/admin/settings')}`}>
                Settings
              </Link>
            </div>
          )}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="flex h-20 items-center justify-between border-b border-[#C9A227]/20 bg-[#0B1220] px-6">
          <div className="w-[350px]">
            <input
              placeholder="Search orders, products, customers..."
              className="w-full rounded-sm border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition focus:border-[#C9A227]/50 focus:outline-none focus:ring-1 focus:ring-[#C9A227]/30"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right text-white">
              <div className="font-serif text-lg tracking-wide">
                {now.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </div>
              <div className="text-xs text-slate-400">
                {now.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>

            <button type="button" className="text-[#C9A227] transition hover:text-[#E3C567]">
              <BellIcon />
            </button>

            <div className="flex items-center gap-3 border-l border-white/10 pl-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A227]/40 bg-[#0F1B2D] font-serif text-sm text-[#E3C567]">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* MAIN */}
          <main className="flex-1 overflow-y-auto bg-[#FAF7F2]">{children}</main>

          {/* RIGHT COLUMN — structure kept, no fake data */}
          <aside className="w-60 overflow-y-auto border-l border-[#E3DDD1] bg-white">
            <div className="space-y-7 p-5">
              <section className="border-b border-[#F1EDE3] pb-5">
                <h2 className="mb-2 font-serif text-base font-semibold text-[#1B2A4A]">
                  Live Activity
                </h2>
                <p className="text-sm text-[#6B6F76]">No live feeds connected yet.</p>
              </section>

              <section className="border-b border-[#F1EDE3] pb-5">
                <h2 className="mb-2 font-serif text-base font-semibold text-[#1B2A4A]">
                  Staff Online
                </h2>
                <p className="text-sm text-[#6B6F76]">Presence tracking not enabled.</p>
              </section>

              <section className="border-b border-[#F1EDE3] pb-5">
                <h2 className="mb-2 font-serif text-base font-semibold text-[#1B2A4A]">
                  Customers Online
                </h2>
                <p className="text-sm text-[#6B6F76]">No active sessions.</p>
              </section>

              <section className="border-b border-[#F1EDE3] pb-5">
                <h2 className="mb-2 font-serif text-base font-semibold text-[#1B2A4A]">
                  Orders Today
                </h2>
                <p className="text-sm text-[#6B6F76]">Connect dashboard stats to populate.</p>
              </section>

              <section>
                <h2 className="mb-2 font-serif text-base font-semibold text-[#1B2A4A]">
                  Notifications
                </h2>
                <p className="text-sm text-[#6B6F76]">No notifications.</p>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}