'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',

    categoryId: '',
    subCategoryId: '',

    buyingPrice: '',
    price: '',

    stock: '',
    lowStockAlert: '5',

    imageUrl: '',

    metaTitle: '',
    metaDescription: '',

    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  });

  useEffect(() => {
    loadCategories();
    loadSubCategories();
  }, []);

  async function loadCategories() {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadSubCategories() {
    try {
      const response = await api.get('/subcategories');
      setSubCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  // Confirmed shape from the API: subcategory.category.id (nested
  // relation), with a flat categoryId fallback just in case.
  const visibleSubCategories = subCategories.filter((sub) => {
    const subCategoryId = sub.category?.id ?? sub.categoryId;
    return String(subCategoryId) === String(form.categoryId);
  });

  function handleCategoryChange(categoryId: string) {
    setForm({
      ...form,
      categoryId,
      // Clear subCategoryId so a stale selection from a different
      // category can't be submitted with the product.
      subCategoryId: '',
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post('/products', {
        ...form,

        buyingPrice: Number(form.buyingPrice),

        price: Number(form.price),

        stock: Number(form.stock),

        lowStockAlert: Number(form.lowStockAlert),
      });

      toast.success('Product created successfully');

      router.push('/admin/products');
    } catch (error) {
      console.error(error);

      toast.error('Failed to create product');
    }
  }

  const inputClass =
    'w-full border border-[#E3DDD1] bg-white p-4 rounded-sm text-[#1A1A1A] placeholder:text-[#9A958A] transition focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]/40';

  return (
    <main className="max-w-3xl mx-auto p-8 sm:p-10">
      <div className="mb-10 border-b border-[#E3DDD1] pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A227]">
          Catalog
        </span>
        <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tight text-[#1B2A4A]">
          Add Product
        </h1>
      </div>

      <form onSubmit={submit} className="space-y-10">
        {/* BASIC INFO */}
        <section className="space-y-4">
          <input
            placeholder="Product Name"
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Slug"
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />

          <textarea
            placeholder="Description"
            className={inputClass}
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </section>

        {/* CLASSIFICATION */}
        <section className="space-y-4 border-t border-[#E3DDD1] pt-8">
          <h2 className="font-serif text-xl font-semibold text-[#1B2A4A]">Classification</h2>

          {/* Category */}
          <div className="flex gap-2">
            <select
              className={inputClass}
              value={form.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <Link
              href="/admin/categories/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center whitespace-nowrap rounded-sm border border-[#C9A227]/50 px-4 text-sm font-medium text-[#9C6B12] transition hover:border-[#C9A227] hover:bg-[#FAF3E4]"
            >
              + Add Category
            </Link>
          </div>

          {/* Sub Category */}
          <div className="flex gap-2">
            <select
              className={inputClass}
              value={form.subCategoryId}
              onChange={(e) => setForm({ ...form, subCategoryId: e.target.value })}
              disabled={!form.categoryId}
            >
              <option value="">
                {form.categoryId ? 'Select Sub Category' : 'Select a category first'}
              </option>

              {visibleSubCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>

            <Link
              href="/admin/subcategories/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center whitespace-nowrap rounded-sm border border-[#C9A227]/50 px-4 text-sm font-medium text-[#9C6B12] transition hover:border-[#C9A227] hover:bg-[#FAF3E4]"
            >
              + Add Sub Category
            </Link>
          </div>
        </section>

        {/* PRICING */}
        <section className="space-y-4 border-t border-[#E3DDD1] pt-8">
          <h2 className="font-serif text-xl font-semibold text-[#1B2A4A]">Pricing</h2>

          <input
            type="number"
            placeholder="Buying Price"
            className={inputClass}
            value={form.buyingPrice}
            onChange={(e) => setForm({ ...form, buyingPrice: e.target.value })}
          />

          <input
            placeholder="Selling Price"
            className={inputClass}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <div className="rounded-sm border border-[#CBDDD0] bg-[#F1F8F3] p-4">
            <p className="font-serif font-semibold text-[#1B2A4A]">Estimated Profit:</p>

            <p className="mt-1 text-[#3F7D58]">
              KES{' '}
              {(Number(form.price || 0) - Number(form.buyingPrice || 0)).toLocaleString()}
            </p>
          </div>
        </section>

        {/* INVENTORY */}
        <section className="space-y-4 border-t border-[#E3DDD1] pt-8">
          <h2 className="font-serif text-xl font-semibold text-[#1B2A4A]">Inventory</h2>

          <input
            placeholder="Stock"
            className={inputClass}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <input
            type="number"
            placeholder="Low Stock Alert"
            className={inputClass}
            value={form.lowStockAlert}
            onChange={(e) => setForm({ ...form, lowStockAlert: e.target.value })}
          />
        </section>

        {/* MEDIA */}
        <section className="space-y-4 border-t border-[#E3DDD1] pt-8">
          <h2 className="font-serif text-xl font-semibold text-[#1B2A4A]">Media</h2>

          <input
            placeholder="Image URL"
            className={inputClass}
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
        </section>

        {/* SEO SETTINGS */}
        <section className="space-y-4 border-t border-[#E3DDD1] pt-8">
          <h2 className="font-serif text-xl font-semibold text-[#1B2A4A]">SEO Settings</h2>

          <input
            placeholder="Meta Title"
            className={inputClass}
            value={form.metaTitle}
            onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
          />

          <textarea
            placeholder="Meta Description"
            className={inputClass}
            rows={3}
            value={form.metaDescription}
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
          />
        </section>

        {/* MARKETING */}
        <section className="space-y-3 border-t border-[#E3DDD1] pt-8">
          <h2 className="font-serif text-xl font-semibold text-[#1B2A4A]">Marketing</h2>

          <label className="flex items-center gap-3 text-[#1A1A1A]">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="h-4 w-4 accent-[#C9A227]"
            />
            Featured Product
          </label>

          <label className="flex items-center gap-3 text-[#1A1A1A]">
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
              className="h-4 w-4 accent-[#C9A227]"
            />
            New Arrival
          </label>

          <label className="flex items-center gap-3 text-[#1A1A1A]">
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
              className="h-4 w-4 accent-[#C9A227]"
            />
            Best Seller
          </label>
        </section>

        <button
          type="submit"
          className="rounded-sm bg-[#1B2A4A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#243961]"
        >
          Save Product
        </button>
      </form>
    </main>
  );
}