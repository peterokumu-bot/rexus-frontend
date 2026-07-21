'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SubCategoriesPage() {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function deleteSubCategory(id: string) {
    if (!confirm('Delete this sub category?')) {
      return;
    }

    try {
      await api.delete(`/subcategories/${id}`);

      toast.success('Sub Category deleted');

      loadSubCategories();
    } catch (error) {
      console.error(error);

      toast.error('Delete failed');
    }
  }

  async function loadSubCategories() {
    try {
      const response = await api.get('/subcategories');

      setSubCategories(response.data);
    } catch (error) {
      console.error(error);

      toast.error('Failed to load sub categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubCategories();
  }, []);

  return (
    <main className="p-8 sm:p-10">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between border-b border-[#E3DDD1] pb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A227]">
              Catalog
            </span>
            <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tight text-[#1B2A4A]">
              Sub Categories
            </h1>
            <p className="mt-2 text-sm text-[#6B6F76]">Manage product sub categories</p>
          </div>

          <Link
            href="/admin/subcategories/new"
            className="rounded-sm bg-[#1B2A4A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#243961]"
          >
            + Add Sub Category
          </Link>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-sm border border-[#E3DDD1] bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E3DDD1] text-left text-xs font-semibold uppercase tracking-[0.15em] text-[#6B6F76]">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center font-serif italic text-[#6B6F76]">
                    Loading…
                  </td>
                </tr>
              ) : subCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center italic text-[#6B6F76]">
                    No sub categories found.
                  </td>
                </tr>
              ) : (
                subCategories.map((subCategory) => (
                  <tr
                    key={subCategory.id}
                    className="border-b border-[#F1EDE3] last:border-b-0 transition hover:bg-[#FAF7F2]"
                  >
                    <td className="px-6 py-4 font-medium text-[#1A1A1A]">
                      {subCategory.name}
                    </td>

                    <td className="px-6 py-4 text-[#4A4D52]">{subCategory.slug}</td>

                    <td className="px-6 py-4 text-[#4A4D52]">
                      {subCategory.category?.name}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/subcategories/${subCategory.id}/edit`}
                          className="rounded-sm border border-[#C9C2B0] px-4 py-2 text-sm font-medium text-[#1B2A4A] transition hover:border-[#1B2A4A]"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => deleteSubCategory(subCategory.id)}
                          className="rounded-sm border border-[#D9B8B0] px-4 py-2 text-sm font-medium text-[#8C2F22] transition hover:bg-[#FBF0EE]"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}