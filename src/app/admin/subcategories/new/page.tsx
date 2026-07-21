'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NewSubCategoryPage() {

  const router = useRouter();

  const [categories, setCategories] =
    useState<any[]>([]);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    categoryId: '',
  });

  useEffect(() => {

    loadCategories();

  }, []);

  async function loadCategories() {

    try {

      const response =
        await api.get('/categories');

      setCategories(
        response.data,
      );

    } catch (error) {

      console.error(error);

      toast.error(
        'Failed to load categories',
      );

    }

  }

  async function submit(
    e: React.FormEvent,
  ) {

    e.preventDefault();

    try {

      await api.post(
        '/subcategories',
        form,
      );

      toast.success(
        'Sub Category created',
      );

      router.push(
        '/admin/subcategories',
      );

    } catch (error) {

      console.error(error);

      toast.error(
        'Create failed',
      );

    }

  }

  return (

    <main className="max-w-3xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Add Sub Category
      </h1>

      <form
        onSubmit={submit}
        className="space-y-6"
      >

        <input
          placeholder="Sub Category Name"
          className="w-full border p-4 rounded-xl"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Slug"
          className="w-full border p-4 rounded-xl"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
        />

        <select
          className="w-full border p-4 rounded-xl"
          value={form.categoryId}
          onChange={(e) =>
            setForm({
              ...form,
              categoryId:
                e.target.value,
            })
          }
        >

          <option value="">
            Select Category
          </option>

          {categories.map(
            (category) => (

              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>

            ),
          )}

        </select>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Save Sub Category
        </button>

      </form>

    </main>

  );
}