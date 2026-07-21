'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
    >
      <path d="M3 1.5L7.5 5 3 8.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M7.2 14.2a1.8 1.8 0 0 0 3.6 0" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

const PRODUCTS_PATHS = ['/admin/products', '/admin/categories', '/admin/subcategories'];
const CUSTOMERS_PATHS = ['/admin/customers', '/admin/recipients', '/admin/ambassadors'];
const PAYMENTS_PATHS = ['/admin/payments', '/admin/invoices'];
const SETTINGS_PATHS = [
  '/admin/settings',
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Each section only opens by default when you're actually inside it,
  // instead of Products being hardcoded open on every load/refresh.
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

  const navClass = (path: string) =>
    pathname.startsWith(path)
      ? `
        bg-[#C9A227]/10
        text-[#E3C567]
        border-l-2
        border-[#C9A227]
      `
      : `
        text-slate-300
        hover:bg-white/5
        border-l-2
        border-transparent
      `;

  return (
    <div className="h-screen flex bg-[#FAF7F2] overflow-hidden font-sans text-[#1A1A1A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#0B1220] via-[#0F1B2D] to-[#0B1220] text-white flex flex-col border-r border-black/40">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-serif text-2xl font-semibold tracking-wide">REXUS</h1>
          <div className="mt-2 h-px w-8 bg-[#C9A227]" />
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
            Admin Center
          </p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto text-sm">
          {/* DASHBOARD */}
          <Link
            href="/admin"
            className={`block px-4 py-3 transition ${
              pathname === '/admin'
                ? 'bg-[#C9A227]/10 text-[#E3C567] border-l-2 border-[#C9A227]'
                : 'text-slate-300 hover:bg-white/5 border-l-2 border-transparent'
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/search"
            className={`block px-4 py-3 mt-1 transition ${navClass('/admin/search')}`}
          >
            Global Search
          </Link>

          {/* PRODUCTS */}
          <button
            onClick={() => setProductsOpen(!productsOpen)}
            className="w-full flex justify-between items-center px-4 py-3 mt-4 text-slate-300 hover:bg-white/5 uppercase text-xs tracking-[0.15em]"
          >
            <span>Products</span>
            <Chevron open={productsOpen} />
          </button>

          {productsOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
              <Link
                href="/admin/products"
                className={`block px-3 py-2 transition ${navClass('/admin/products')}`}
              >
                Products
              </Link>

              <Link
                href="/admin/categories"
                className={`block px-3 py-2 transition ${navClass('/admin/categories')}`}
              >
                Categories
              </Link>

              <Link
                href="/admin/subcategories"
                className={`block px-3 py-2 transition ${navClass('/admin/subcategories')}`}
              >
                Sub Categories
              </Link>
            </div>
          )}

          {/* ORDERS */}
          <Link
            href="/admin/orders"
            className={`block px-4 py-3 mt-4 transition ${navClass('/admin/orders')}`}
          >
            Orders
          </Link>

          {/* CUSTOMERS */}
          <button
            onClick={() => setCustomersOpen(!customersOpen)}
            className="w-full flex justify-between items-center px-4 py-3 mt-4 text-slate-300 hover:bg-white/5 uppercase text-xs tracking-[0.15em]"
          >
            <span>Customers</span>
            <Chevron open={customersOpen} />
          </button>

          {customersOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
              <Link
                href="/admin/customers"
                className={`block px-3 py-2 transition ${navClass('/admin/customers')}`}
              >
                Customers
              </Link>

              <Link
                href="/admin/recipients"
                className={`block px-3 py-2 transition ${navClass('/admin/recipients')}`}
              >
                Recipients
              </Link>

              <Link
                href="/admin/ambassadors"
                className={`block px-3 py-2 transition ${navClass('/admin/ambassadors')}`}
              >
                Gift Ambassadors
              </Link>
            </div>
          )}

          {/* PAYMENTS */}
          <button
            onClick={() => setPaymentsOpen(!paymentsOpen)}
            className="w-full flex justify-between items-center px-4 py-3 mt-4 text-slate-300 hover:bg-white/5 uppercase text-xs tracking-[0.15em]"
          >
            <span>Payments</span>
            <Chevron open={paymentsOpen} />
          </button>

          {paymentsOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
              <Link
                href="/admin/payments"
                className={`block px-3 py-2 transition ${navClass('/admin/payments')}`}
              >
                Payments
              </Link>

              <Link
                href="/admin/invoices"
                className={`block px-3 py-2 transition ${navClass('/admin/invoices')}`}
              >
                Invoices
              </Link>
            </div>
          )}

          {/* ANALYTICS */}
          <Link
            href="/admin/analytics"
            className={`block px-4 py-3 mt-4 transition ${navClass('/admin/analytics')}`}
          >
            Analytics
          </Link>

          {/* SETTINGS */}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full flex justify-between items-center px-4 py-3 mt-4 text-slate-300 hover:bg-white/5 uppercase text-xs tracking-[0.15em]"
          >
            <span>Settings</span>
            <Chevron open={settingsOpen} />
          </button>

          {settingsOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
              <Link
  href="/admin/settings"
  className={`block px-3 py-2 transition ${navClass('/admin/settings')}`}
>
  Settings
</Link>
            </div>
          )}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="h-20 bg-[#0B1220] border-b border-[#C9A227]/20 px-6 flex items-center justify-between">
          {/* SEARCH */}
          <div className="w-[350px]">
            <input
              placeholder="Search orders, products, customers..."
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition focus:border-[#C9A227]/50 focus:outline-none focus:ring-1 focus:ring-[#C9A227]/30"
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6">
            <div className="text-right text-white">
              <div className="font-serif text-lg tracking-wide">22:51:34</div>
              <div className="text-xs text-slate-400">Friday, 12 Jun 2026</div>
            </div>

            <button className="text-[#C9A227] hover:text-[#E3C567] transition">
              <BellIcon />
            </button>

            <div className="flex items-center gap-3 border-l border-white/10 pl-5">
              <div className="h-9 w-9 rounded-full border border-[#C9A227]/40 bg-[#0F1B2D] flex items-center justify-center font-serif text-sm text-[#E3C567]">
                A
              </div>

              <div>
                <p className="text-white text-sm font-medium">Admin</p>
                <p className="text-slate-400 text-xs">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT + ACTIVITY */}
        <div className="flex flex-1 overflow-hidden">
          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-y-auto bg-[#FAF7F2]">{children}</main>

          {/* RIGHT SIDEBAR */}
          <aside className="w-60 bg-white border-l border-[#E3DDD1] overflow-y-auto">
            <div className="p-5">
              {/* LIVE STATUS */}
              <div className="mb-7 border-b border-[#F1EDE3] pb-5">
                <h2 className="font-serif text-base font-semibold text-[#1B2A4A] mb-2">
                  Live Activity
                </h2>

                <div className="flex items-center gap-2 text-sm text-[#3F7D58]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3F7D58]" />
                  System Online
                </div>
              </div>

              {/* STAFF ONLINE */}
              <div className="mb-7 border-b border-[#F1EDE3] pb-5">
                <h2 className="font-serif text-base font-semibold text-[#1B2A4A] mb-3">
                  Staff Online
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">Admin</p>
                      <p className="text-xs text-[#6B6F76]">Super Admin</p>
                    </div>

                    <span className="h-1.5 w-1.5 rounded-full bg-[#3F7D58]" />
                  </div>
                </div>
              </div>

              {/* CUSTOMERS ONLINE */}
              <div className="mb-7 border-b border-[#F1EDE3] pb-5">
                <h2 className="font-serif text-base font-semibold text-[#1B2A4A] mb-3">
                  Customers Online
                </h2>

                <div className="space-y-2">
                  <div className="border border-[#E3DDD1] rounded-sm px-3 py-2 text-sm text-[#4A4D52]">
                    Browsing Gift Shop
                  </div>

                  <div className="border border-[#E3DDD1] rounded-sm px-3 py-2 text-sm text-[#4A4D52]">
                    In Checkout
                  </div>
                </div>
              </div>

              {/* ORDERS TODAY */}
              <div className="mb-7 border-b border-[#F1EDE3] pb-5">
                <h2 className="font-serif text-base font-semibold text-[#1B2A4A] mb-3">
                  Orders Today
                </h2>

                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-sm border border-[#E3DDD1] px-3 py-2 text-sm">
                    <span className="text-[#4A4D52]">New Orders</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3A6EA5]" />
                  </div>

                  <div className="flex items-center justify-between rounded-sm border border-[#E3DDD1] px-3 py-2 text-sm">
                    <span className="text-[#4A4D52]">Pending</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B08D57]" />
                  </div>

                  <div className="flex items-center justify-between rounded-sm border border-[#E3DDD1] px-3 py-2 text-sm">
                    <span className="text-[#4A4D52]">Confirmed</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3F7D58]" />
                  </div>
                </div>
              </div>

              {/* PAYMENTS */}
              <div className="mb-7 border-b border-[#F1EDE3] pb-5">
                <h2 className="font-serif text-base font-semibold text-[#1B2A4A] mb-3">
                  Payments Today
                </h2>

                <div className="space-y-2">
                  <div className="border border-[#E3DDD1] rounded-sm px-3 py-2">
                    <p className="text-sm font-medium text-[#1A1A1A]">Wallet</p>
                    <p className="text-xs text-[#6B6F76]">Payment Received</p>
                  </div>

                  <div className="border border-[#E3DDD1] rounded-sm px-3 py-2">
                    <p className="text-sm font-medium text-[#1A1A1A]">Rexo</p>
                    <p className="text-xs text-[#6B6F76]">Payment Received</p>
                  </div>
                </div>
              </div>

              {/* NOTIFICATIONS */}
              <div>
                <h2 className="font-serif text-base font-semibold text-[#1B2A4A] mb-3">
                  Notifications
                </h2>

                <div className="space-y-2">
                  <div className="rounded-sm border border-[#D9C9A3] bg-[#FAF3E4] px-3 py-2 text-sm text-[#8A6A2F]">
                    New Order Received
                  </div>

                  <div className="rounded-sm border border-[#CBDDD0] bg-[#F1F8F3] px-3 py-2 text-sm text-[#3F7D58]">
                    Payment Completed
                  </div>

                  <div className="rounded-sm border border-[#CBD8E8] bg-[#F1F5FA] px-3 py-2 text-sm text-[#3A6EA5]">
                    Gift Ambassador Assigned
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}