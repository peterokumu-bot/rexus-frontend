'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import api from '@/lib/api';
import { SiteSettings } from '@/types/siteSettings';

type AppContextType = {
  wallet: number;
  rexo: number;
  cartCount: number;
  user: any;
  siteSettings: SiteSettings | null;
  refreshAppData: () => Promise<void>;
  refreshSiteSettings: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

function getAuthHeaders(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

function sumQuantities(items: any[]) {
  return items.reduce((sum: number, item: any) => sum + item.quantity, 0);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState(0);
  const [rexo, setRexo] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  async function refreshAppData() {
    const token = localStorage.getItem('token');

    // Guest user: derive cart count from localStorage only.
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

      setCartCount(sumQuantities(guestCart));
      setWallet(0);
      setRexo(0);
      setUser(null);
      return;
    }

    try {
      const authHeaders = getAuthHeaders(token);

      const [profileRes, walletRes, cartRes] = await Promise.all([
        api.get('/profile', authHeaders),
        api.get('/wallet', authHeaders),
        api.get('/orders/cart', authHeaders),
      ]);

      setUser(profileRes.data);
      setWallet(Number(walletRes.data.wallet?.balance || 0));
      setRexo(Number(walletRes.data.rexoWallet?.balance || 0));
      setCartCount(sumQuantities(cartRes.data));
    } catch (error) {
      console.error('Failed to refresh app data:', error);
    }
  }

  async function refreshSiteSettings() {
    try {
      const { data } = await api.get('/settings');
      setSiteSettings(data);
    } catch (error) {
      console.error('Failed to load site settings:', error);
    }
  }

  useEffect(() => {
    refreshAppData();
    refreshSiteSettings();

    const handleRefresh = () => refreshAppData();
    window.addEventListener('storage', handleRefresh);

    return () => {
      window.removeEventListener('storage', handleRefresh);
    };
  }, []);

  return (
   <AppContext.Provider
  value={{
    wallet,
    rexo,
    cartCount,
    user,

    siteSettings,

    refreshAppData,

    refreshSiteSettings,
  }}
>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }

  return context;
}