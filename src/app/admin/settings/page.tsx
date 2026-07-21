'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

import api, { API_URL } from '@/lib/api';

import {
  Palette,
  Building2,
  House,
  PanelTop,
  LayoutPanelTop,
  Phone,
  Globe,
  Search,
  CreditCard,
  Bell,
  Shield,
  MonitorCog,
  Upload,
  ImageIcon,
  type LucideIcon,
} from 'lucide-react';

/* =====================================================
   TYPES
===================================================== */

type MenuId =
  | 'branding'
  | 'company'
  | 'homepage'
  | 'navigation'
  | 'footer'
  | 'contact'
  | 'social'
  | 'seo'
  | 'payments'
  | 'notifications'
  | 'security'
  | 'system';

interface MenuItem {
  id: MenuId;
  label: string;
  icon: LucideIcon;
}

interface SiteSettings {
  id?: string;
  companyName: string;
  tagline: string;
  logoUrl: string | null;
  footerLogoUrl: string | null;
  faviconUrl: string | null;
  placeholderImageUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
}

type AssetKey = 'logoUrl' | 'footerLogoUrl' | 'faviconUrl';

/* =====================================================
   CONSTANTS
===================================================== */

const PRIMARY_COLOR = '#1B7979';
const SECONDARY_COLOR = '#E61E8C';

const MENUS: MenuItem[] = [
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'homepage', label: 'Homepage', icon: House },
  { id: 'navigation', label: 'Navigation', icon: PanelTop },
  { id: 'footer', label: 'Footer', icon: LayoutPanelTop },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'social', label: 'Social Media', icon: Globe },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'system', label: 'System', icon: MonitorCog },
];

const ASSET_SPECS: {
  key: AssetKey;
  title: string;
  helper: string;
  dimension: string;
}[] = [
  {
    key: 'logoUrl',
    title: 'Header Logo',
    helper: 'Displayed in the top navigation bar',
    dimension: 'Recommended 320×80px · PNG or SVG',
  },
  {
    key: 'footerLogoUrl',
    title: 'Footer Logo',
    helper: 'Displayed in the site footer',
    dimension: 'Recommended 320×80px · PNG or SVG',
  },
  {
    key: 'faviconUrl',
    title: 'Favicon',
    helper: 'Browser tab and bookmark icon',
    dimension: 'Recommended 64×64px · PNG or ICO',
  },
];

/* =====================================================
   PAGE
===================================================== */

export default function SettingsPage() {
  const [active, setActive] = useState<MenuId>('branding');
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<SiteSettings>({
    companyName: '',
    tagline: '',
    logoUrl: null,
    footerLogoUrl: null,
    faviconUrl: null,
    placeholderImageUrl: null,
    primaryColor: PRIMARY_COLOR,
    secondaryColor: SECONDARY_COLOR,
  });


  function handleAssetUpload(key: AssetKey, file: File | null) {
    if (!file) return;
    // Wire this up to your actual upload endpoint.
    const localUrl = URL.createObjectURL(file);
    setSettings((prev) => ({ ...prev, [key]: localUrl }));
    toast.success('Image selected — click Save to apply');
  }

  async function saveSettings() {
  setSaving(true);

  try {

    console.log('Saving...', settings);

    const response =
      await api.patch(
        '/settings',
        settings,
      );

    console.log(response.data);

    toast.success(
      'Settings saved successfully.',
    );

  } catch (error: any) {

    console.error(error);

    console.log(error.response);

    toast.error(
      'Failed to save settings.',
    );

  } finally {

    setSaving(false);

  }
}

  return (
    <div className="p-8">
      {/* ========================================= */}
      {/* PAGE HEADER */}
      {/* ========================================= */}

      <div className="mb-8">
        <h1 className="font-serif text-4xl font-semibold text-[#1B2A4A]">
          Settings
        </h1>
        <p className="mt-2 text-gray-500">
          Configure every aspect of your Rexus platform.
        </p>
      </div>

      {/* ========================================= */}
      {/* PAGE LAYOUT */}
      {/* ========================================= */}

      <div className="grid grid-cols-[270px_1fr] gap-8">
        {/* ========================================= */}
        {/* LEFT MENU */}
        {/* ========================================= */}

        <aside className="h-fit rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="font-semibold">Settings</h2>
          </div>

          <div className="p-3">
            {MENUS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`
                    mb-1
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    transition
                    ${
                      active === item.id
                        ? 'bg-[#1B7979] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ========================================= */}
        {/* RIGHT PANEL */}
        {/* ========================================= */}

        <section className="rounded-xl border bg-white shadow-sm">
          {active === 'branding' && (
            <>
              {/* Section header */}
              <div className="flex items-center justify-between border-b px-8 py-6">
                <div>
                  <h2 className="text-2xl font-semibold text-[#1B2A4A]">
                    Brand Identity
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage logos, company details, and brand colours.
                  </p>
                </div>

                <span
                  className="
                    rounded-full
                    bg-[#1B7979]/10
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#1B7979]
                  "
                >
                  Live
                </span>
              </div>

              <div className="space-y-10 p-8">
                {/* ========================================= */}
                {/* LOGOS & ASSETS */}
                {/* ========================================= */}

                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <ImageIcon size={16} className="text-gray-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Logos & Assets
                    </h3>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    {ASSET_SPECS.map((asset) => (
                      <div
                        key={asset.key}
                        className="rounded-xl border p-5"
                      >
                        <h4 className="font-semibold text-[#1B2A4A]">
                          {asset.title}
                        </h4>
                        <p className="mt-1 text-xs text-gray-500">
                          {asset.helper}
                        </p>

                        <div
                          className="
                            mt-4
                            flex
                            h-40
                            items-center
                            justify-center
                            rounded-lg
                            border-2
                            border-dashed
                            border-gray-200
                            bg-gray-50
                          "
                        >
                          {settings[asset.key] ? (
                            <Image
                              src={`${API_URL}${settings[asset.key]}`}
                              alt={asset.title}
                              width={asset.key === 'faviconUrl' ? 56 : 160}
                              height={asset.key === 'faviconUrl' ? 56 : 160}
                              className="object-contain"
                              unoptimized
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-300">
                              <ImageIcon size={28} />
                              <span className="text-xs text-gray-400">
                                No file uploaded
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="mt-3 text-[11px] text-gray-400">
                          {asset.dimension}
                        </p>

                        <label
                          className="
                            mt-4
                            flex
                            w-full
                            cursor-pointer
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:bg-gray-50
                          "
                        >
                          <Upload size={15} />
                          Upload File
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleAssetUpload(
                                asset.key,
                                e.target.files?.[0] ?? null
                              )
                            }
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ========================================= */}
                {/* COMPANY INFORMATION */}
                {/* ========================================= */}

                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Building2 size={16} className="text-gray-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Company Information
                    </h3>
                  </div>

                  <div className="rounded-xl border p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={settings.companyName}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              companyName: e.target.value,
                            })
                          }
                          placeholder="e.g. Rexus Ltd"
                          className="
                            w-full
                            rounded-lg
                            border
                            px-4
                            py-2.5
                            text-sm
                            outline-none
                            transition
                            focus:border-[#1B7979]
                            focus:ring-2
                            focus:ring-[#1B7979]/20
                          "
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Company Tagline
                        </label>
                        <input
                          type="text"
                          value={settings.tagline}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              tagline: e.target.value,
                            })
                          }
                          placeholder="e.g. Building better platforms"
                          className="
                            w-full
                            rounded-lg
                            border
                            px-4
                            py-2.5
                            text-sm
                            outline-none
                            transition
                            focus:border-[#1B7979]
                            focus:ring-2
                            focus:ring-[#1B7979]/20
                          "
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================= */}
                {/* BRAND COLORS */}
                {/* ========================================= */}

                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Palette size={16} className="text-gray-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Brand Colours
                    </h3>
                  </div>

                  <div className="rounded-xl border p-6">
                    <div className="grid gap-8 md:grid-cols-2">
                      {(
                        [
                          {
                            key: 'primaryColor' as const,
                            label: 'Primary Colour',
                          },
                          {
                            key: 'secondaryColor' as const,
                            label: 'Secondary Colour',
                          },
                        ]
                      ).map((color) => (
                        <div key={color.key}>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            {color.label}
                          </label>

                          <div className="flex items-center gap-3">
                            <div
                              className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border"
                              style={{ backgroundColor: settings[color.key] }}
                            >
                              <input
                                type="color"
                                value={settings[color.key]}
                                onChange={(e) =>
                                  setSettings({
                                    ...settings,
                                    [color.key]: e.target.value,
                                  })
                                }
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              />
                            </div>

                            <input
                              type="text"
                              value={settings[color.key]}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  [color.key]: e.target.value,
                                })
                              }
                              className="
                                flex-1
                                rounded-lg
                                border
                                px-4
                                py-2.5
                                text-sm
                                font-mono
                                outline-none
                                transition
                                focus:border-[#1B7979]
                                focus:ring-2
                                focus:ring-[#1B7979]/20
                              "
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================= */}
              {/* SAVE FOOTER */}
              {/* ========================================= */}

              <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-8 py-5">
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="
                    rounded-lg
                    bg-[#1B7979]
                    px-6
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#166666]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </>
          )}

          {active !== 'branding' && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <h2 className="text-2xl font-semibold text-[#1B2A4A]">
                {MENUS.find((menu) => menu.id === active)?.label}
              </h2>
              <p className="mt-3 text-sm text-gray-500">
                This section will be implemented soon.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}