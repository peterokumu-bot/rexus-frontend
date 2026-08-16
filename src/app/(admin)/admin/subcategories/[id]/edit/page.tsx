'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditSubCategoryPage() {

  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [categories, setCategories] =
    useState<any[]>([]);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    categoryId: '',
  });

  useEffect(() => {

    loadCategories();
    loadSubCategory();

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

    }

  }

  async function loadSubCategory() {

    try {

      const response =
        await api.get(
          `/subcategories/${params.id}`,
        );

      setForm({

        name:
          response.data.name || '',

        slug:
          response.data.slug || '',

        categoryId:
          response.data.categoryId || '',

      });

    } catch (error) {

      console.error(error);

      toast.error(
        'Failed to load sub category',
      );

    } finally {

      setLoading(false);

    }

  }

  async function submit(
    e: React.FormEvent,
  ) {

    e.preventDefault();

    try {

      await api.patch(
        `/subcategories/${params.id}`,
        form,
      );

      toast.success(
        'Sub Category updated',
      );

      router.push(
        '/admin/subcategories',
      );

    } catch (error) {

      console.error(error);

      toast.error(
        'Update failed',
      );

    }

  }

  if (loading) {

    return (
      <div className="p-8">
        Loading...
      </div>
    );

  }

  return (

    <main className="max-w-3xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Edit Sub Category
      </h1>

      <form
        onSubmit={submit}
        className="space-y-6"
      >

        <input
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
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Update Sub Category
        </button>

      </form>

    </main>

  );
}